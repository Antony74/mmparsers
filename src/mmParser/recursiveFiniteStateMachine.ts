import { TokenStream } from './tokenStream';
import { TokenEventObject } from './TokenEventObject';
import { MachineConfig, MachineStates } from './mmStateMachine';

export const createRecursiveFiniteStateMachine = (
    stateMachine: MachineConfig
): TokenStream => {
    const stack: MachineStates[] = [stateMachine.states];
    const top = (): MachineStates => {
        return stack[stack.length - 1];
    };

    let state: string = (stateMachine.initial ?? '').toString();

    const hook = {
        onToken: (token: TokenEventObject): string => {
            const nodes = top();
            const node = nodes[state];
            const transition = node.on[token.type];
            if (node.on[token.type]) {
                state = transition;
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
