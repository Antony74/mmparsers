/* eslint-disable @typescript-eslint/no-explicit-any */
import nearley from 'nearley';
import { performanceInfoWrapObject } from '../utils/performanceInfo';
import {
    commentsToTokensReducer,
    emptyWsAndTokens,
    minToken,
    combineWsAndToken,
} from '../utils/tokenHelpers';
import {
    BlockNodeFacade,
    createFacadeHelper,
    ProvableStmtNodeFacade,
} from './facade';
import {
    Database,
    BlockNode,
    ConstantStmtNode,
    VariableStmtNode,
    EssentialStmtNode,
    FloatingStmtNode,
    AxiomStmtNode,
    ProvableStmtNode,
    AssertionNode,
    IncludeStmtNode,
} from './mmParseTree';
import { setParserEvents } from './parserEvents';

export type MmParser = {
    feed: (chunk: string) => void;
    finish(): Database;
};

export const createMmParser = (): MmParser => {
    const facadeHelper = createFacadeHelper();
    let database: Database = { type: 'database', children: [] };

    const events = performanceInfoWrapObject({
        database: (d: any): null => {
            // console.log('database');
            const db = d
                .flat(3)
                .reduce(commentsToTokensReducer, emptyWsAndTokens);

            database = {
                type: 'database',
                children: db.tokens,
                trailingWs: db.ws,
            };
            return null;
        },

        block: (d: any): BlockNodeFacade => {
            // console.log('block');

            const statements = d[2]
                .flat(3)
                .reduce(commentsToTokensReducer, emptyWsAndTokens);

            const blockNode: BlockNode = {
                type: 'block',
                children: [
                    minToken(d[0]), // ${
                    combineWsAndToken(d[1], {
                        type: 'statements',
                        children: statements.tokens,
                    }),
                    combineWsAndToken(statements.ws, minToken(d[3])), // $}
                ],
            };

            return facadeHelper.createBlockNodeFacade(blockNode);
        },

        constant_stmt: (d: any): ConstantStmtNode => {
            // console.log('constant_stmt');
            d = d.flat();

            const constants = d
                .slice(2, -1)
                .flat(Number.MAX_SAFE_INTEGER)
                .reduce(commentsToTokensReducer, emptyWsAndTokens);

            return {
                type: 'constant_stmt',
                children: [
                    minToken(d[0]), // $c
                    combineWsAndToken(d[1], {
                        type: 'constants',
                        children: constants.tokens,
                    }),
                    combineWsAndToken(constants.ws, minToken(d[d.length - 1])), // $.
                ],
            };
        },

        variable_stmt: (d: any): VariableStmtNode => {
            // console.log('variable_stmt');
            d = d.flat(Number.MAX_SAFE_INTEGER);

            const variables = d
                .slice(2, -1)
                .reduce(commentsToTokensReducer, emptyWsAndTokens);

            return {
                type: 'variable_stmt',
                children: [
                    minToken(d[0]), // $v
                    combineWsAndToken(d[1], {
                        type: 'variables',
                        children: variables.tokens,
                    }),
                    combineWsAndToken(variables.ws, minToken(d[d.length - 1])), // $.
                ],
            };
        },

        essential_stmt: (d: any): EssentialStmtNode => {
            // console.log('essential_stmt');
            d = d.flat(Number.MAX_SAFE_INTEGER);
            const statements = d
                .slice(4, -1)
                .reduce(commentsToTokensReducer, emptyWsAndTokens);
            return {
                type: 'essential_stmt',
                children: [
                    minToken(d[0]), // LABEL
                    combineWsAndToken(d[1], minToken(d[2])), // $e
                    combineWsAndToken(d[3], {
                        type: 'statement',
                        children: statements.tokens,
                    }),
                    combineWsAndToken(statements.ws, minToken(d[d.length - 1])), // $.
                ],
            };
        },

        floating_stmt: (d: any): FloatingStmtNode => {
            // console.log('floating_stmt');
            d = d.flat(Number.MAX_SAFE_INTEGER);
            const statements = d
                .slice(4, -1)
                .reduce(commentsToTokensReducer, emptyWsAndTokens);

            return {
                type: 'floating_stmt',
                children: [
                    minToken(d[0]), // LABEL
                    combineWsAndToken(d[1], minToken(d[2])), // $f
                    combineWsAndToken(d[3], {
                        type: 'statement',
                        children: statements.tokens,
                    }),
                    combineWsAndToken(statements.ws, minToken(d[d.length - 1])), // $.
                ],
            };
        },

        axiom_stmt: (d: any): AxiomStmtNode => {
            // console.log('axiom_stmt');
            d = d.flat(1);
            const assertion = d[6];
            const trailingWs = assertion.trailingWs;
            delete assertion.trailingWs;
            return {
                type: 'axiom_stmt',
                children: [
                    minToken(d[0]), // LABEL
                    combineWsAndToken(d[1], minToken(d[2])), // $a
                    combineWsAndToken(
                        d[3],
                        minToken(d[4].flat(Number.MAX_SAFE_INTEGER)[0]) // typecode
                    ),
                    combineWsAndToken(d[5], d[6]), // assertion
                    combineWsAndToken(trailingWs, minToken(d[7])), // $.
                ],
            };
        },

        provable_stmt: (d: any): ProvableStmtNodeFacade => {
            console.log(`provable_stmt ${d[0].text}`);

            const proof = d[9]
                .flat(Number.MAX_SAFE_INTEGER)
                .reduce(commentsToTokensReducer, emptyWsAndTokens);

            const assertion = d[6];
            const trailingWs = assertion.trailingWs;
            delete assertion.trailingWs;

            const provableStmtNode: ProvableStmtNode = {
                type: 'provable_stmt',
                children: [
                    minToken(d[0]), // label
                    combineWsAndToken(d[1], minToken(d[2])), // $p
                    combineWsAndToken(
                        d[3],
                        minToken(d[4].flat(Number.MAX_SAFE_INTEGER)[0]) // typecode
                    ),
                    combineWsAndToken(d[5], assertion), // assertion
                    combineWsAndToken(trailingWs, minToken(d[7])), // $=
                    combineWsAndToken(d[8], {
                        type: 'proof',
                        children: proof.tokens,
                    }),
                    combineWsAndToken(proof.ws, minToken(d[10])), // $.
                ],
            };
            return facadeHelper.createProvableStmtNodeFacade(provableStmtNode);
        },

        assertion: (d: any): AssertionNode => {
            // console.log('assertion');

            const symbols = d
                .flat(Number.MAX_SAFE_INTEGER)
                .reduce(commentsToTokensReducer, emptyWsAndTokens);

            return {
                type: 'assertion',
                children: symbols.tokens,
                trailingWs: symbols.ws,
            };
        },

        include_stmt: (d: any): IncludeStmtNode => {
            // console.log('include_stmt');
            d = d.flat(1);

            return {
                type: 'include_stmt',
                children: [
                    minToken(d[0]), // $[
                    combineWsAndToken(d[1], minToken(d[2])), // MATH_SYMBOL
                    combineWsAndToken(d[3], minToken(d[4])), // $]
                ],
            };
        },

        _: (d: any[]): string[] => {
            return d
                .flat(Number.MAX_SAFE_INTEGER)
                .filter((item) => item !== null);
        },

        whitespace: (d: any): [string] => {
            return d[0].text;
        },
        comment: (d: any): [string] => {
            return d[0].text;
        },
    });

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const grammar = require('./mmParser');

    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

    const hook = {
        feed: (chunk: string): void => {
            setParserEvents(events);
            parser.feed(chunk);
            setParserEvents(null);
        },
        finish: (): Database => {
            console.log(events.report());

            if (parser.results.length > 1) {
                throw new Error('Ambiguous');
            } else if (parser.results.length < 1) {
                throw new Error('No results');
            }

            return facadeHelper.removeFacades(database);
        },
    };

    return hook;
};
