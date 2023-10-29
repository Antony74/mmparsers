export type TokenEventObject = {
    type: string;
    text: string;
    line?: number;
    col?: number;
};

export interface TokenStream {
    onToken(token: TokenEventObject): void;
}

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

export enum StateChangeDirection {
    up = 'up',
    down = 'down',
    across = 'across',
}

export type StateChange = { direction: StateChangeDirection; state: string };

export interface TokenStateStream {
    onToken(token: TokenEventObject, stateChanges: StateChange[]): void;
}

export const createValidatingFSM = (
    stateMachine: MachineConfig,
    tokenStateStream: TokenStateStream,
): TokenStream => {
    const stack: StackItem[] = [
        { states: stateMachine.states, state: stateMachine.initial! },
    ];

    const top = (): StackItem => {
        return stack[stack.length - 1];
    };

    const hook: TokenStream = {
        onToken: (token: TokenEventObject): void => {
            const originalState = top().state;
            const stateChanges: StateChange[] = [];

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
                        stateChanges.push({
                            direction: StateChangeDirection.down,
                            state,
                        });
                    } else {
                        stateChanges.push({
                            direction: StateChangeDirection.across,
                            state: transition,
                        });
                    }

                    tokenStateStream.onToken(token, stateChanges);

                    return;
                }
                stack.pop();
                stateChanges.push({
                    direction: StateChangeDirection.up,
                    state: '',
                });
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
    return hook;
};
