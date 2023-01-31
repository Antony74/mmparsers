/* eslint-disable @typescript-eslint/no-explicit-any */
import nearley from 'nearley';
import { BlockNodeFacade, createBlockNodeFacade, createProvableStmtNodeFacade, ProvableStmtNodeFacade } from './facade';
import {
    TreeNode,
    TreeNodeLeaf,
    isParentNode,
    Database,
    BlockNode,
    ConstantStmtNode,
    VariableStmtNode,
    EssentialStmtNode,
    FloatingStmtNode,
    AxiomStmtNode,
    ProvableStmtNode,
    AssertionNode,
} from './mmParseTree';

export type MmParser = {
    feed: (chunk: string) => void;
    finish(): Database;
};

type ParserEvents = {
    database: (d: any) => Database;
    block: (d: any) => BlockNodeFacade;
    constant_stmt: (d: any) => ConstantStmtNode;
    variable_stmt: (d: any) => VariableStmtNode;
    essential_stmt: (d: any) => EssentialStmtNode;
    floating_stmt: (d: any) => FloatingStmtNode;
    axiom_stmt: (d: any) => AxiomStmtNode;
    provable_stmt: (d: any) => ProvableStmtNodeFacade;
    assertion: (d: any) => AssertionNode;
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
    database(d: any): Database {
        if (currentParserEvents) {
            return getParserEvents().database(d);
        } else {
            return null as unknown as Database;
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

    if (isParentNode(token)) {
        return token;
    }

    const { type, text } = token;
    return { type, text };
};

type WSAndTokens = { ws: string[]; tokens: TreeNode[] };

const emptyWsAndTokens = { tokens: [] };

const commentsToTokensReducer = (acc: any, value: any): WSAndTokens => {
    if (value.type) {
        const { type, text } = minToken(value);
        return {
            ws: [],
            tokens: [...acc.tokens, { type, ws: acc.ws, text }],
        };
    } else {
        return { ws: [...acc.ws, ...value], tokens: acc.tokens };
    }
};

export const createMmParser = (): MmParser => {
    const events: ParserEvents | null = {
        database: (d: any): Database => {
            return { type: 'database', children: d.flat(3) };
        },

        block: (d: any): BlockNodeFacade => {
            const blockNode: BlockNode = {
                type: 'block',
                children: [
                    minToken(d[0]),
                    //            d[1],
                    {
                        type: 'statements',
                        children: d[2].flat(3),
                    },
                    minToken(d[3]),
                ],
            };
            return createBlockNodeFacade(blockNode);
        },

        constant_stmt: (d: any): ConstantStmtNode => {
            d = d.flat();
            return {
                type: 'constant_stmt',
                children: [
                    minToken(d[0]),
                    //            d[1],
                    {
                        type: 'constants',
                        children: d
                            .slice(2, -1)
                            .flat(Number.MAX_SAFE_INTEGER)
                            .reduce(commentsToTokensReducer, emptyWsAndTokens)
                            .tokens,
                    },
                    minToken(d[d.length - 1]),
                ],
            };
        },

        variable_stmt: (d: any): VariableStmtNode => {
            d = d.flat(Number.MAX_SAFE_INTEGER);
            return {
                type: 'variable_stmt',
                children: [
                    minToken(d[0]),
                    //            d[1],
                    {
                        type: 'variables',
                        children: d
                            .slice(2, -1)
                            .reduce(commentsToTokensReducer, emptyWsAndTokens)
                            .tokens,
                    },
                    minToken(d[d.length - 1]),
                ],
            };
        },

        essential_stmt: (d: any): EssentialStmtNode => {
            d = d.flat(Number.MAX_SAFE_INTEGER);
            return {
                type: 'essential_stmt',
                children: [
                    minToken(d[0]),
                    //            minToken(d[1]),
                    minToken(d[2]),
                    //            minToken(d[3]),
                    {
                        type: 'statement',
                        children: d
                            .slice(4, -1)
                            .reduce(commentsToTokensReducer, emptyWsAndTokens)
                            .tokens,
                    },
                    minToken(d[d.length - 1]),
                ],
            };
        },

        floating_stmt: (d: any): FloatingStmtNode => {
            d = d.flat(Number.MAX_SAFE_INTEGER);
            return {
                type: 'floating_stmt',
                children: [
                    minToken(d[0]),
                    //            minToken(d[1]),
                    minToken(d[2]),
                    //            minToken(d[3]),
                    {
                        type: 'statement',
                        children: d
                            .slice(4, -1)
                            .reduce(commentsToTokensReducer, emptyWsAndTokens)
                            .tokens,
                    },
                    minToken(d[d.length - 1]),
                ],
            };
        },

        axiom_stmt: (d: any): AxiomStmtNode => {
            d = d.flat(1);
            return {
                type: 'axiom_stmt',
                children: [
                    minToken(d[0]), // LABEL
                    //            d[1], // _
                    minToken(d[2]), // $a
                    //            d[3], // _
                    minToken(d[4].flat(Number.MAX_SAFE_INTEGER)[0]), // typecode
                    //            d[5], // _
                    d[6], // assertion
                    minToken(d[7]), // $.
                ],
            };
        },

        provable_stmt: (d: any): ProvableStmtNodeFacade => {
            const provableStmtNode: ProvableStmtNode = {
                type: 'provable_stmt',
                children: [
                    minToken(d[0]), // label
                    //          d[1], // _
                    minToken(d[2]), // $p
                    //            d[3], // _
                    minToken(d[4].flat(Number.MAX_SAFE_INTEGER)[0]), // typecode
                    //            d[5], // _
                    d[6], // assertion
                    minToken(d[7]), // $=
                    //            d[8], // _
                    {
                        type: 'proof',
                        children: d[9]
                            .flat(Number.MAX_SAFE_INTEGER)
                            .reduce(commentsToTokensReducer, emptyWsAndTokens)
                            .tokens,
                    },
                    minToken(d[10]), // $.
                ],
            };
            return createProvableStmtNodeFacade(provableStmtNode);
        },

        assertion: (d: any): AssertionNode => {
            return {
                type: 'assertion',
                children: d
                    .flat(Number.MAX_SAFE_INTEGER)
                    .reduce(commentsToTokensReducer, emptyWsAndTokens).tokens,
            };
        },

        _: (d: any[]): string[] => {
            return d
                .flat(Number.MAX_SAFE_INTEGER)
                .filter((item) => item !== null);
        },

        whitespace: (d: any): [string] => d[0].text,
        comment: (d: any): [string] => d[0].text,
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

            return parser.results[0];
        },
    };

    return hook;
};
