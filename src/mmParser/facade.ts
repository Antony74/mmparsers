// Nearley doesn't seem to handle very large parse trees well, so we hide them behind a facade

import { v4 as uuidv4 } from 'uuid';

import { BlockNode, ProvableStmtNode } from './mmParseTree';

export type BlockNodeFacade = {
    type: 'block';
    uuid: string;
};

export type ProvableStmtNodeFacade = {
    type: 'provable_stmt';
    uuid: string;
};

const blockNodeMap = new Map<string, BlockNode>();
const provableStmtNodeMap = new Map<string, ProvableStmtNode>();

export const createBlockNodeFacade = (
    blockNode: BlockNode
): BlockNodeFacade => {
    const blockNodeFacade: BlockNodeFacade = { type: 'block', uuid: uuidv4() };
    blockNodeMap.set(blockNodeFacade.uuid, blockNode);
    return blockNodeFacade;
};

export const restoreBlockNode = (
    blockNodeFacade: BlockNodeFacade
): BlockNode => {
    const blockNode = blockNodeMap.get(blockNodeFacade.uuid);

    if (blockNode === undefined) {
        throw new Error('BlockNode not found');
    }

    blockNodeMap.delete(blockNodeFacade.uuid);
    return blockNode;
};

export const createProvableStmtNodeFacade = (
    provableStmtNode: ProvableStmtNode
): ProvableStmtNodeFacade => {
    const provableStmtNodeFacade: ProvableStmtNodeFacade = {
        type: 'provable_stmt',
        uuid: uuidv4(),
    };
    provableStmtNodeMap.set(provableStmtNodeFacade.uuid, provableStmtNode);
    return provableStmtNodeFacade;
};

export const restoreProvableStmtNode = (
    provableStmtNodeFacade: ProvableStmtNodeFacade
): ProvableStmtNode => {
    const provableStmtNode = provableStmtNodeMap.get(provableStmtNodeFacade.uuid);

    if (provableStmtNode === undefined) {
        throw new Error('ProvableStmtNode not found');
    }

    provableStmtNodeMap.delete(provableStmtNodeFacade.uuid);
    return provableStmtNode;
};
