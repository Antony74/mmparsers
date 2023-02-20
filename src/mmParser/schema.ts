import { JSONSchemaType } from 'ajv';
import { MathSymbolNode } from './mmParseTree';

export const mathSymbolNodeSchema: JSONSchemaType<MathSymbolNode> = {
    type: 'object',
    properties: {
        type: {
            type: 'string',
            enum: ['MATH_SYMBOL'],
        },
        text: {
            type: 'string', 
        },
        ws: {
            type: 'array',
            items: { type: 'string' },
            nullable: true,
        },
    },
    required: ['type', 'text'],
};
