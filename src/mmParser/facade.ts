// Nearley doesn't seem to handle very large parse trees well, so we hide them behind a facade

import { v4 as uuidv4 } from 'uuid';

import { BlockNode, ProvableStmtNode } from './mmParseTree';

export type BlockNodeFacade = {
    type: 'block_facade';
    uuid: string;
};

export type ProvableStmtNodeFacade = {
    type: 'provable_stmt_facade';
    uuid: string;
};

export type FacadeHelper = {
    createBlockNodeFacade: (blockNode: BlockNode) => BlockNodeFacade;
    createProvableStmtNodeFacade: (
        provableStmtNode: ProvableStmtNode
    ) => ProvableStmtNodeFacade;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    removeFacades: (parentNode: any) => any;
};

export const createFacadeHelper = (): FacadeHelper => {
    const blockNodeMap = new Map<string, BlockNode>();
    const provableStmtNodeMap = new Map<string, ProvableStmtNode>();

    const createBlockNodeFacade = (blockNode: BlockNode): BlockNodeFacade => {
        const blockNodeFacade: BlockNodeFacade = {
            type: 'block_facade',
            uuid: uuidv4(),
        };
        blockNodeMap.set(blockNodeFacade.uuid, blockNode);
        return blockNodeFacade;
    };

    const restoreBlockNode = (blockNodeFacade: BlockNodeFacade): BlockNode => {
        const blockNode = blockNodeMap.get(blockNodeFacade.uuid);

        if (blockNode === undefined) {
            throw new Error('BlockNode not found');
        }

        return blockNode;
    };

    const createProvableStmtNodeFacade = (
        provableStmtNode: ProvableStmtNode
    ): ProvableStmtNodeFacade => {
        const provableStmtNodeFacade: ProvableStmtNodeFacade = {
            type: 'provable_stmt_facade',
            uuid: uuidv4(),
        };
        provableStmtNodeMap.set(provableStmtNodeFacade.uuid, provableStmtNode);
        return provableStmtNodeFacade;
    };

    const restoreProvableStmtNode = (
        provableStmtNodeFacade: ProvableStmtNodeFacade
    ): ProvableStmtNode => {
        const provableStmtNode = provableStmtNodeMap.get(
            provableStmtNodeFacade.uuid
        );

        if (provableStmtNode === undefined) {
            throw new Error('ProvableStmtNode not found');
        }

        return provableStmtNode;
    };

    // type MMNodeWithFacade = MMNode | BlockNodeFacade | ProvableStmtNodeFacade;

    /* eslint-disable @typescript-eslint/no-explicit-any */
    const removeFacades = (parentNode: any): any => {
        return {
            ...parentNode,
            children: parentNode.children.map((node: any) => {
                switch (node.type) {
                    case 'block_facade':
                        return restoreBlockNode(node);
                    case 'provable_stmt_facade':
                        return restoreProvableStmtNode(node);
                    default:
                        return node;
                }
            }),
        };
    };

    return {
        createBlockNodeFacade,
        createProvableStmtNodeFacade,
        removeFacades,
    };
};
