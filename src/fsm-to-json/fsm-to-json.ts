import { JsonWriter } from '../jsonWriter/jsonWriter';

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

export type State = {
    value: string | object;
    event: { type: string };
};

export type Actor = {
    start: () => void;
    send: (token: TokenEventObject) => void;
    onTransition: (fn: (state: State) => void) => void;
};

const stateValueToPath = (stateValue: string | object): string[] => {
    if (typeof stateValue === 'string') {
        return [stateValue];
    } else {
        const keys = Object.keys(stateValue);
        const values = Object.values(stateValue);
        if (keys.length !== 1) {
            throw new Error('Expected exactly one key');
        }
        if (values.length !== 1) {
            throw new Error('Expected exactly one value');
        }
        return [keys[0], ...stateValueToPath(values[0])];
    }
};

export const createFsmToJson = (
    actor: Actor,
    jsonWriter: JsonWriter,
): TokenStream => {
    actor.onTransition((state: State) => {
        if (state.event.type === 'xstate.init') {
            return;
        }

        const path = stateValueToPath(state.value);
        console.log(JSON.stringify(state.value));
    });

    actor.start();

    const hook: TokenStream = {
        onToken: (token: TokenEventObject): void => {
            actor.send(token);
        },
        finish: () => {
            // Need to check the state machine is in a valid state to terminate
            jsonWriter.finish();
        },
    };
    return hook;
};
