/* eslint-disable @typescript-eslint/no-explicit-any */
import nearley from 'nearley';
import {
    BlockNodeFacade,
    createFacadeHelper,
    ProvableStmtNodeFacade,
} from './facade';
import {
    TreeNode,
    TreeNodeLeaf,
    isGenericParentNode,
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

export type MmParser = {
    feed: (chunk: string) => void;
    finish(): Database;
};

type ParserEvents = {
    database: (d: any) => void;
    block: (d: any) => BlockNodeFacade;
    constant_stmt: (d: any) => ConstantStmtNode;
    variable_stmt: (d: any) => VariableStmtNode;
    essential_stmt: (d: any) => EssentialStmtNode;
    floating_stmt: (d: any) => FloatingStmtNode;
    axiom_stmt: (d: any) => AxiomStmtNode;
    provable_stmt: (d: any) => ProvableStmtNodeFacade;
    assertion: (d: any) => AssertionNode;
    include_stmt: (d: any) => IncludeStmtNode;
    _: (d: any[]) => string[];
    whitespace: (d: any) => [string];
    comment: (d: any) => [string];
};

let currentParserEvents: ParserEvents | null;

const getParserEvents = (): ParserEvents => {
    if (!currentParserEvents) {
        throw new Error('Unexpect call to getParserEvents');
    }

    return currentParserEvents;
};

export const parserEvents: ParserEvents = {
    database(d: any): void {
        if (currentParserEvents) {
            getParserEvents().database(d);
        }
    },
    block(d: any): BlockNodeFacade {
        return getParserEvents().block(d);
    },
    constant_stmt(d: any): ConstantStmtNode {
        return getParserEvents().constant_stmt(d);
    },
    variable_stmt(d: any): VariableStmtNode {
        return getParserEvents().variable_stmt(d);
    },
    essential_stmt(d: any): EssentialStmtNode {
        return getParserEvents().essential_stmt(d);
    },
    floating_stmt(d: any): FloatingStmtNode {
        return getParserEvents().floating_stmt(d);
    },
    axiom_stmt(d: any): AxiomStmtNode {
        return getParserEvents().axiom_stmt(d);
    },
    provable_stmt(d: any): ProvableStmtNodeFacade {
        return getParserEvents().provable_stmt(d);
    },
    assertion(d: any): AssertionNode {
        return getParserEvents().assertion(d);
    },
    include_stmt(d: any): IncludeStmtNode {
        return getParserEvents().include_stmt(d);
    },
    _(d: any[]): string[] {
        return getParserEvents()._(d);
    },
    whitespace(d: any): [string] {
        return getParserEvents().whitespace(d);
    },
    comment(d: any): [string] {
        return getParserEvents().comment(d);
    },
};

const minToken = <T extends TreeNode>(token: T): T | TreeNodeLeaf => {
    if (!token.type) {
        throw new Error('Type missing from token');
    }

    if (isGenericParentNode(token)) {
        return token;
    }

    if ((token as any).uuid) {
        return token;
    }

    const { type, text } = token;
    return { type, text };
};

type WSAndTokens = { ws: string[]; tokens: TreeNode[] };

const emptyWsAndTokens = { tokens: [] };

const commentsToTokensReducer = (acc: any, value: any): WSAndTokens => {
    if (value.type) {
        const token = minToken(value);
        const type = token.type;
        return {
            ws: [],
            tokens: [...acc.tokens, { type, ws: acc.ws, ...token }],
        };
    } else {
        return {
            ws: acc.ws ? [...acc.ws, value] : [value],
            tokens: acc.tokens,
        };
    }
};

const combine = <T extends TreeNode>(ws: string | string[], token: T): T => {
    if (Array.isArray(ws)) {
        return { ws, ...token };
    } else {
        return { ws: [ws], ...token };
    }
};

export const createMmParser = (): MmParser => {
    const facadeHelper = createFacadeHelper();
    let database: Database = { type: 'database', children: [] };

    const events: ParserEvents | null = {
        database: (d: any): null => {
            console.log('database');
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
            console.log('block');

            const statements = d[2]
                .flat(3)
                .reduce(commentsToTokensReducer, emptyWsAndTokens);

            const blockNode: BlockNode = {
                type: 'block',
                children: [
                    minToken(d[0]), // ${
                    combine(d[1], {
                        type: 'statements',
                        children: statements.tokens,
                    }),
                    combine(statements.ws, minToken(d[3])), // $}
                ],
            };

            return facadeHelper.createBlockNodeFacade(blockNode);
        },

        constant_stmt: (d: any): ConstantStmtNode => {
            console.log('constant_stmt');
            d = d.flat();

            const constants = d
                .slice(2, -1)
                .flat(Number.MAX_SAFE_INTEGER)
                .reduce(commentsToTokensReducer, emptyWsAndTokens);

            return {
                type: 'constant_stmt',
                children: [
                    minToken(d[0]), // $c
                    combine(d[1], {
                        type: 'constants',
                        children: constants.tokens,
                    }),
                    combine(constants.ws, minToken(d[d.length - 1])), // $.
                ],
            };
        },

        variable_stmt: (d: any): VariableStmtNode => {
            console.log('variable_stmt');
            d = d.flat(Number.MAX_SAFE_INTEGER);

            const variables = d
                .slice(2, -1)
                .reduce(commentsToTokensReducer, emptyWsAndTokens);

            return {
                type: 'variable_stmt',
                children: [
                    minToken(d[0]), // $v
                    combine(d[1], {
                        type: 'variables',
                        children: variables.tokens,
                    }),
                    combine(variables.ws, minToken(d[d.length - 1])), // $.
                ],
            };
        },

        essential_stmt: (d: any): EssentialStmtNode => {
            console.log('essential_stmt');
            d = d.flat(Number.MAX_SAFE_INTEGER);
            const statements = d
                .slice(4, -1)
                .reduce(commentsToTokensReducer, emptyWsAndTokens);
            return {
                type: 'essential_stmt',
                children: [
                    minToken(d[0]), // LABEL
                    combine(d[1], minToken(d[2])), // $e
                    combine(d[3], {
                        type: 'statement',
                        children: statements.tokens,
                    }),
                    combine(statements.ws, minToken(d[d.length - 1])), // $.
                ],
            };
        },

        floating_stmt: (d: any): FloatingStmtNode => {
            console.log('floating_stmt');
            d = d.flat(Number.MAX_SAFE_INTEGER);
            const statements = d
                .slice(4, -1)
                .reduce(commentsToTokensReducer, emptyWsAndTokens);

            return {
                type: 'floating_stmt',
                children: [
                    minToken(d[0]), // LABEL
                    combine(d[1], minToken(d[2])), // $f
                    combine(d[3], {
                        type: 'statement',
                        children: statements.tokens,
                    }),
                    combine(statements.ws, minToken(d[d.length - 1])), // $.
                ],
            };
        },

        axiom_stmt: (d: any): AxiomStmtNode => {
            console.log('axiom_stmt');
            d = d.flat(1);
            const assertion = d[6];
            const trailingWs = assertion.trailingWs;
            delete assertion.trailingWs;
            return {
                type: 'axiom_stmt',
                children: [
                    minToken(d[0]), // LABEL
                    combine(d[1], minToken(d[2])), // $a
                    combine(
                        d[3],
                        minToken(d[4].flat(Number.MAX_SAFE_INTEGER)[0]) // typecode
                    ),
                    combine(d[5], d[6]), // assertion
                    combine(trailingWs, minToken(d[7])), // $.
                ],
            };
        },

        provable_stmt: (d: any): ProvableStmtNodeFacade => {
            console.log(`provable_stmt ${d[0].text}`);

            const proof = d[9]
                .flat(Number.MAX_SAFE_INTEGER)
                .reduce(commentsToTokensReducer, emptyWsAndTokens);

            const provableStmtNode: ProvableStmtNode = {
                type: 'provable_stmt',
                children: [
                    minToken(d[0]), // label
                    combine(d[1], minToken(d[2])), // $p
                    combine(
                        d[3],
                        minToken(d[4].flat(Number.MAX_SAFE_INTEGER)[0]) // typecode
                    ),
                    combine(d[5], d[6]), // assertion
                    combine(d[6].trailingWs, minToken(d[7])), // $=
                    combine(d[8], {
                        type: 'proof',
                        children: proof.tokens,
                    }),
                    combine(proof.ws, minToken(d[10])), // $.
                ],
            };
            return facadeHelper.createProvableStmtNodeFacade(provableStmtNode);
        },

        assertion: (d: any): AssertionNode => {
            console.log('assertion');

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
            console.log('include_stmt');
            d = d.flat(1);

            return {
                type: 'include_stmt',
                children: [
                    minToken(d[0]),
                    combine(d[1], minToken(d[2])),
                    combine(d[3], minToken(d[4])),
                ],
            };
        },

        _: (d: any[]): string[] => {
            //            console.log('_');
            return d
                .flat(Number.MAX_SAFE_INTEGER)
                .filter((item) => item !== null);
        },

        whitespace: (d: any): [string] => {
            //            console.log('whitespace');
            return d[0].text;
        },
        comment: (d: any): [string] => {
            //           console.log('comment');
            return d[0].text;
        },
    };

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const grammar = require('./mmParser');

    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

    const hook = {
        feed: (chunk: string): void => {
            currentParserEvents = events;
            parser.feed(chunk);
            currentParserEvents = null;
        },
        finish: (): Database => {
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
