export type TreeNodeLeaf = { type: string; text: string; ws?: string[] };

export type TreeNodeParent = {
    type: string;
    ws?: string[];
    children: (TreeNodeLeaf | TreeNodeParent)[];
};

export type TreeNode = TreeNodeLeaf | TreeNodeParent;

export type MathSymbolNode = {
    type: 'MATH_SYMBOL';
    ws?: string[];
    text: string;
};
export type LabelNode = { type: 'LABEL'; ws?: string[]; text: string };
export type $cNode = { type: '$c'; ws?: string[]; text: '$c' };
export type $vNode = { type: '$v'; ws?: string[]; text: '$v' };
export type $fNode = { type: '$f'; ws?: string[]; text: '$f' };
export type $eNode = { type: '$e'; ws?: string[]; text: '$e' };
export type $aNode = { type: '$a'; ws?: string[]; text: '$a' };
export type $pNode = { type: '$p'; ws?: string[]; text: '$p' };
export type $eqNode = { type: '$='; ws?: string[]; text: '$=' };
export type $dotNode = { type: '$.'; ws?: string[]; text: '$.' };
export type $BlockStartNode = { type: '${'; ws?: string[]; text: '${' };
export type $BlockEndNode = { type: '$}'; ws?: string[]; text: '$}' };

export type ConstantsNode = {
    type: 'constants';
    children: MathSymbolNode[];
    ws?: string[];
};

export type VariablesNode = {
    type: 'variables';
    children: MathSymbolNode[];
    ws?: string[];
};

export type StatementNode = {
    type: 'statement';
    children: MathSymbolNode[];
    ws?: string[];
};

export type AssertionNode = {
    type: 'assertion';
    children: MathSymbolNode[];
    ws?: string[];
};

export type ProofNode = {
    type: 'proof';
    children: LabelNode[];
    ws?: string[];
};

export type ChildStatement =
    | BlockNode
    | VariableStmtNode
    // | DisjointStmtNode
    | FloatingStmtNode
    | EssentialStmtNode
    | AxiomStmtNode
    | ProvableStmtNode;

export type StatementsNode = {
    type: 'statements';
    children: ChildStatement[];
    ws?: string[];
};

export type ConstantStmtNode = {
    type: 'constant_stmt';
    children: [$cNode, ConstantsNode, $dotNode];
    ws?: string[];
};

export type VariableStmtNode = {
    type: 'variable_stmt';
    children: [$vNode, VariablesNode, $dotNode];
    ws?: string[];
};

export type EssentialStmtNode = {
    type: 'essential_stmt';
    children: [LabelNode, $eNode, StatementNode, $dotNode];
    ws?: string[];
};

export type FloatingStmtNode = {
    type: 'floating_stmt';
    children: [LabelNode, $fNode, StatementNode, $dotNode];
    ws?: string[];
};

export type AxiomStmtNode = {
    type: 'axiom_stmt';
    children: [LabelNode, $aNode, MathSymbolNode, AssertionNode, $dotNode];
    ws?: string[];
};

export type ProvableStmtNode = {
    type: 'provable_stmt';
    children: [
        LabelNode,
        $pNode,
        MathSymbolNode,
        AssertionNode,
        $eqNode,
        ProofNode,
        $dotNode
    ];
    ws?: string[];
};

export type BlockNode = {
    type: 'block';
    children: [$BlockStartNode, StatementsNode, $BlockEndNode];
    ws?: string[];
};

export type Database = {
    type: 'database';
    children: // IncludeStmtNode |
    (ConstantStmtNode | ChildStatement)[];
    ws?: string[];
    trailingWs?: string[];
};

export type MMNodeParent =
    | Database
    | BlockNode
    | ProvableStmtNode
    | AxiomStmtNode
    | FloatingStmtNode
    | EssentialStmtNode
    | VariableStmtNode
    | ConstantStmtNode
    | StatementsNode
    | ProofNode
    | AssertionNode
    | StatementNode
    | VariablesNode
    | ConstantsNode;

export type MMNodeLeaf =
    | MathSymbolNode
    | LabelNode
    | $cNode
    | $vNode
    | $fNode
    | $eNode
    | $aNode
    | $pNode
    | $eqNode
    | $dotNode
    | $BlockStartNode
    | $BlockEndNode;

export type MMNode = MMNodeLeaf | MMNodeParent;

export const isGenericParentNode = (node: TreeNode): node is TreeNodeParent =>
    'children' in node;

export const isParentNode = (node: MMNode): node is MMNodeParent =>
    'children' in node;
