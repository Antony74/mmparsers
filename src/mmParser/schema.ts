/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { JSONSchemaType } from 'ajv';
import {
    $aNode,
    $BlockEndNode,
    $BlockStartNode,
    $cNode,
    $dotNode,
    $eNode,
    $eqNode,
    $fNode,
    $pNode,
    $vNode,
    AssertionNode,
    ConstantsNode,
    FloatingStmtNode,
    LabelNode,
    MathSymbolNode,
    UncompressedProofNode,
    StatementNode,
    VariablesNode,
} from './mmParseTree';

const typeSchema = <Type extends string>(t: Type) => {
    return { type: 'string', enum: [t] } as const;
};

const ws = {
    type: 'array',
    items: { type: 'string' },
    nullable: true,
} as const;

const leafNodeFreeTextSchema = <T extends string>(t: T) => {
    return {
        type: 'object',
        properties: {
            type: typeSchema(t),
            text: { type: 'string' },
            ws,
        },
        required: ['type', 'text'],
    } as const;
};

const leafNodeFixedTextSchema = <Type extends string>(t: Type) => {
    return {
        type: 'object',
        properties: {
            type: typeSchema(t),
            text: { type: 'string', enum: [t] },
            ws,
        },
        required: ['type', 'text'],
    } as const;
};

const parentNodeSchema = <Type extends string, Items>(
    t: Type,
    items: Items
) => {
    return {
        type: 'object',
        properties: {
            type: typeSchema(t),
            children: { type: 'array', items },
            ws,
        },
        required: ['type', 'children'],
    } as const;
};

const parentNodeTrailingSchema = <Type extends string, Items>(
    t: Type,
    items: Items
) => {
    const base = parentNodeSchema(t, items);
    return { ...base, properties: { ...base.properties, trailingWs: ws } };
};

export const mathSymbolNodeSchema: JSONSchemaType<MathSymbolNode> =
    leafNodeFreeTextSchema('MATH_SYMBOL');

export const labelNodeSchema: JSONSchemaType<LabelNode> =
    leafNodeFreeTextSchema('LABEL');

export const $cNodeSchema: JSONSchemaType<$cNode> =
    leafNodeFixedTextSchema('$c');

export const $vNodeSchema: JSONSchemaType<$vNode> =
    leafNodeFreeTextSchema('$v');

export const $fNodeSchema: JSONSchemaType<$fNode> =
    leafNodeFreeTextSchema('$f');

export const $eNodeSchema: JSONSchemaType<$eNode> =
    leafNodeFreeTextSchema('$e');

export const $aNodeSchema: JSONSchemaType<$aNode> =
    leafNodeFreeTextSchema('$a');

export const $pNodeSchema: JSONSchemaType<$pNode> =
    leafNodeFreeTextSchema('$p');

export const $eqNodeSchema: JSONSchemaType<$eqNode> =
    leafNodeFreeTextSchema('$=');

export const $dotNodeSchema: JSONSchemaType<$dotNode> =
    leafNodeFreeTextSchema('$.');

export const $BlockStartNodeSchema: JSONSchemaType<$BlockStartNode> =
    leafNodeFreeTextSchema('${');

export const $BlockEndNodeSchema: JSONSchemaType<$BlockEndNode> =
    leafNodeFreeTextSchema('$}');

export const constantsNodeSchema: JSONSchemaType<ConstantsNode> =
    parentNodeSchema('constants', mathSymbolNodeSchema);

export const variablesNodeSchema: JSONSchemaType<VariablesNode> =
    parentNodeSchema('variables', mathSymbolNodeSchema);

export const statementNodeSchema: JSONSchemaType<StatementNode> =
    parentNodeSchema('statement', mathSymbolNodeSchema);

export const assertionNodeSchema: JSONSchemaType<AssertionNode> =
    parentNodeTrailingSchema('assertion', mathSymbolNodeSchema);

export const proofNodeSchema: JSONSchemaType<UncompressedProofNode> = parentNodeSchema(
    'uncompressed_proof',
    labelNodeSchema
);

export const floatingStmtNodeSchema: JSONSchemaType<FloatingStmtNode> = {
    type: 'object',
    properties: {
        type: typeSchema('floating_stmt'),
        children: {
            type: 'array',
            items: [
                labelNodeSchema,
                $fNodeSchema,
                statementNodeSchema,
                $dotNodeSchema,
            ],
            minItems: 4,
            maxItems: 4,
        },
        ws,
    },
    required: ['type', 'children'],
};

// export const blockNodeSchema: JSONSchemaType<BlockNode> = {
//     $id: 'block',
//     type: 'object',
//     properties: {
//         type: 'block',
//         children: {
//             type: 'array',
//             items: [
//                 $BlockStartNodeSchema,
//                 statementsNodeSchema,
//                 $BlockEndNodeSchema,
//             ],
//         },
//         ws,
//     },
//     required: ['type', 'children'],
// };

// export const childStatementSchema: JSONSchemaType<ChildStatement> = {
//     oneOf: [{ $ref: 'block' }, variablesNodeSchema, flo],
// };
