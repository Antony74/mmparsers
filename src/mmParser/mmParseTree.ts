export type MathSymbolNode = {
    type: 'MATH_SYMBOL';
    ws?: string[];
    text: string;
};
export type LabelNode = { type: 'LABEL'; ws?: string[]; text: string };
export type $cNode = { type: '$c'; ws?: string[]; text: '$c' };
export type $vNode = { type: '$v'; ws?: string[]; text: '$v' };
export type $dNode = { type: '$d'; ws?: string[]; text: '$d' };
export type $fNode = { type: '$f'; ws?: string[]; text: '$f' };
export type $eNode = { type: '$e'; ws?: string[]; text: '$e' };
export type $aNode = { type: '$a'; ws?: string[]; text: '$a' };
export type $pNode = { type: '$p'; ws?: string[]; text: '$p' };
export type $eqNode = { type: '$='; ws?: string[]; text: '$=' };
export type $dotNode = { type: '$.'; ws?: string[]; text: '$.' };
export type $BlockStartNode = { type: '${'; ws?: string[]; text: '${' };
export type $BlockEndNode = { type: '$}'; ws?: string[]; text: '$}' };
export type $IncludeStmtStartNode = { type: '$['; ws?: string[]; text: '$[' };
export type $IncludeStmtEndNode = { type: '$]'; ws?: string[]; text: '$]' };
export type OpenBracketNode = { type: '$('; ws?: string[]; text: '$(' };
export type CloseBracketNode = { type: '$)'; ws?: string[]; text: '$)' };

export type CompressedProofBlockNode = {
    type: 'COMPRESSED_PROOF_BLOCK';
    ws?: string[];
    text: string;
};

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
    trailingWs?: string[];
};

export type UncompressedProofNode = {
    type: 'uncompressed_proof';
    children: LabelNode[];
    ws?: string[];
};

export type CompressedProofNode = {
    type: 'compressed_proof';
    children: [
        OpenBracketNode,
        LabelsNode,
        CloseBracketNode,
        CompressedProofBlocksNode,
    ];
    ws?: string[];
};

export type LabelsNode = {
    type: 'labels';
    children: LabelNode[];
    ws?: string[];
};

export type CompressedProofBlocksNode = {
    type: 'compressed_proof_blocks';
    children: CompressedProofBlockNode[];
    ws?: string[];
};

export type ChildStatement =
    | BlockNode
    | VariableStmtNode
    | DisjointStmtNode
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

export type DisjointStmtNode = {
    type: 'disjoint_stmt';
    children: [$dNode, VariablesNode, $dotNode];
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
        UncompressedProofNode | CompressedProofNode,
        $dotNode,
    ];
    ws?: string[];
};

export type IncludeStmtNode = {
    type: 'include_stmt';
    children: [$IncludeStmtStartNode, MathSymbolNode, $IncludeStmtEndNode];
    ws?: string[];
};

export type BlockNode = {
    type: 'block';
    children: [$BlockStartNode, StatementsNode, $BlockEndNode];
    ws?: string[];
};

export type Database = {
    type: 'database';
    children: (IncludeStmtNode | ConstantStmtNode | ChildStatement)[];
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
    | CompressedProofNode
    | UncompressedProofNode
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
