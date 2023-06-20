/* eslint-disable @typescript-eslint/no-explicit-any */
import { StateMachine, StateNode, StateNodesConfig } from 'xstate';

import { TokenStream } from './tokenStream';
import { TokenEventObject } from './TokenEventObject';

type Machine = StateMachine<unknown, any, TokenEventObject>;
//type Nodes = StateNodesConfig<unknown, any, TokenEventObject>;
//type Node = StateNode<unknown, any, TokenEventObject>;

export const createRecursiveFiniteStateMachine = (
    stateMachine: Machine
): TokenStream => {
    let state: string[] = [(stateMachine.initial ?? '').toString()];

    const hook = {
        onToken: (token: TokenEventObject): string[] => {
            const nodes = stateMachine.getFromRelativePath(state);
            const node = nodes[nodes.length - 1];
            const transition = node.on[token.type];
            if (node.on[token.type]) {
                if (transition.length !== 1) {
                    throw new Error(`Why do we not have exactly one transistion?`);
                }
                const target = transition[0].target;
                if (!target || target.length !== 1) {
                    throw new Error(`Why do we not have exactly one target?`);
                }
                state = target[0].path;
                return state;
            } else {
                throw new Error(
                    `In state ${state}, unexpected token ${token.type}, line ${token.line} col ${token.col}`
                );
            }
        },
    };
    return hook;
};
