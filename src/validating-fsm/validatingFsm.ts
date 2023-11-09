import { JsonWriter } from "../jsonWriter/jsonWriter";

export type TokenEventObject = {
    type: string;
    text: string;
    line?: number;
    col?: number;
};

export interface TokenStream {
    onToken(token: TokenEventObject): void;
    finish(): void;
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
    jsonWriter: JsonWriter,
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

                        jsonWriter.name('children').beginArray();
                    } else {
                        jsonWriter.beginObject().name('type').value(token.type);

                        // ideally only do text for leaf nodes
                        jsonWriter.name('text').value(token.text);
                        }

                    return;
                }
                stack.pop();
                jsonWriter.close();
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
        finish: () => {
            // Need to check the state machine is in a valid state to terminate
            jsonWriter.finish();
        }
    };
    return hook;
};
