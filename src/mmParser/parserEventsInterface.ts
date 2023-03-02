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
