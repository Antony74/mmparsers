/* eslint-disable @typescript-eslint/no-explicit-any */
import { BlockNodeFacade, ProvableStmtNodeFacade } from './facade';
import {
    ConstantStmtNode,
    VariableStmtNode,
    EssentialStmtNode,
    FloatingStmtNode,
    AxiomStmtNode,
    AssertionNode,
    IncludeStmtNode,
} from './mmParseTree';

export type ParserEvents = {
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

export const setParserEvents = (parserEvents: ParserEvents | null): void => {
    currentParserEvents = parserEvents;
}

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

