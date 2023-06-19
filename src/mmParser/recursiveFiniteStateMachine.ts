/* eslint-disable @typescript-eslint/no-explicit-any */
import { StateMachine, StateNode, StateNodesConfig } from "xstate";

import { TokenStream } from "./tokenStream"
import { TokenEventObject } from "./TokenEventObject";

type Machine = StateMachine<unknown, any, TokenEventObject>;
type Nodes = StateNodesConfig<unknown, any, TokenEventObject>;
type Node = StateNode<unknown, any, TokenEventObject>;

export const createRecursiveFiniteStateMachine = (stateMachine: Machine): TokenStream => {
    const stack: Nodes[] = [stateMachine.states];
    const top = (state: string | symbol | number | undefined): Node => {
        if (typeof(state) === 'string') {
        return stack[stack.length - 1][state];
        } else {
            throw new Error(`Unexpected state`);
        }
    }

    let state = stateMachine.initial;

    const hook = {onToken: (token: TokenEventObject): void => {
        const node: Node = top(state);
        const transition = node.on[token.type];
        if (node.on[token.type]) {
            transition.values.toString();
            state = transition.values.toString();
        } else {
            throw new Error(`unexpected token ${token.type}`)
        }
    }}
    return hook;
}