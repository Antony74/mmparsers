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


export const createFsmToJson = (
    actor: Actor,
    jsonWriter: JsonWriter,
    tag: string,
): TokenStream => {
    actor.onTransition((state: State) => {
        if (state.event.type === 'xstate.init') {
            return;
        }

        console.log(JSON.stringify(state.value), tag);
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
