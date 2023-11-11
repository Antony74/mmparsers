/* eslint-disable @typescript-eslint/no-empty-function */
import { Actor, State, TokenEventObject } from './fsm-to-json';

export type MachineState = {
    on: { [key: string]: string };
    initial?: string;
    states?: MachineStates;
};

export type MachineStates = { [key: string]: MachineState };

export type MachineConfig = {
    id: string;
    initial: string;
    predictableActionArguments: boolean;
    states: MachineStates;
};

type StackItem = { states: MachineStates; state: string };

export const createValidatingFSM = (stateMachine: MachineConfig): Actor => {
    const stack: StackItem[] = [
        { states: stateMachine.states, state: stateMachine.initial! },
    ];

    const top = (): StackItem => {
        return stack[stack.length - 1];
    };

    let listener: (state: State) => void;

    const actor: Actor = {
        onTransition: (_listener) => {
            if (listener !== undefined) {
                throw new Error('This Actor only takes one listener');
            }
            listener = _listener;
        },
        start: () => {
            listener({
                event: { type: 'xstate.init' },
                value: stateMachine.initial,
            });
        },
        send: (token: TokenEventObject): void => {
            const originalState = top().state;

            while (stack.length) {
                const stackItem = top();
                const node = stackItem.states[stackItem.state];
                const transition = node.on[token.type];

                if (node.on[token.type]) {
                    stackItem.state = transition;
                    const newNode = stackItem.states[stackItem.state];
                    if (newNode.states) {
                        const state = newNode.initial!;
                        stack.push({
                            states: newNode.states,
                            state,
                        });
                    }

                    const value = [...stack]
                        .reverse()
                        .reduce(
                            (acc: string | object, { state }) =>
                                acc ? { [state]: acc } : state,
                            '',
                        );

                    listener({ value, event: token });
                    return;
                }
                stack.pop();
            }

            const msg = [
                `In state ${originalState}, unexpected token ${token.type}`,
            ];

            if (token.line !== undefined) {
                msg.push(`line ${token.line}`);
            }

            if (token.col !== undefined) {
                msg.push(`col ${token.col}`);
            }

            throw new Error(msg.join(', '));
        },
    };
    return actor;
};
