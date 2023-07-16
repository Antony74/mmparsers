export type TokenEventObject = {
    type: string;
    text: string;
    line?: number;
    col?: number;
};

export interface TokenStream {
    onToken(token: TokenEventObject): string;
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

export const createValidatingFSM = (
    stateMachine: MachineConfig,
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
                const msg = [
                    `In state ${state}, unexpected token ${token.type}`,
                ];

                if (token.line !== undefined) {
                    msg.push(`line ${token.line}`);
                }

                if (token.col !== undefined) {
                    msg.push(`col ${token.col}`);
                }

                throw new Error(msg.join(', '));
            }
        },
    };
    return hook;
};
