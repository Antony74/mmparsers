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

type StackItem = { states: MachineStates; state: string };

export const createValidatingFSM = (
    stateMachine: MachineConfig,
): TokenStream => {
    const stack: StackItem[] = [
        { states: stateMachine.states, state: stateMachine.initial! },
    ];

    const top = (): StackItem => {
        return stack[stack.length - 1];
    };

    const hook = {
        onToken: (token: TokenEventObject): string => {
            const originalState = top().state;
            
            while (stack.length) {
                const stackItem = top();
                const node = stackItem.states[stackItem.state];
                const transition = node.on[token.type];

                if (node.on[token.type]) {
                    stackItem.state = transition;
                    const newNode = stackItem.states[stackItem.state];
                    if (newNode.states) {
                        stack.push({
                            states: newNode.states,
                            state: newNode.initial!,
                        });
                    }
                    return top().state;
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
    return hook;
};
