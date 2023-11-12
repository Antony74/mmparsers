import { JsonWriter } from '../jsonWriter/jsonWriter';
import { MachineConfig, MachineState } from './validatingFsm';

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
    event: TokenEventObject | { type: 'xstate.init' };
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

const writeToken = (jsonWriter: JsonWriter, event: TokenEventObject): void => {
    jsonWriter.beginObject();
    jsonWriter.name('type').value(event.type);
    jsonWriter.name('text').value(event.text);
    jsonWriter.close();
};

type NamedMachineState = MachineState & { name: string };

export const createFsmToJson = (
    actor: Actor,
    machineConfig: MachineConfig,
    jsonWriter: JsonWriter,
): TokenStream => {
    let oldStack: string[] = [];
    let delayedWriteToken: TokenEventObject | null = null;

    actor.onTransition((state: State) => {
        const newStack = stateValueToPath(state.value);
        console.log(newStack);

        const machineState = newStack.reduce(
            (acc: NamedMachineState | undefined, name) => {
                const machineState = acc
                    ? acc.states![name]
                    : machineConfig.states[newStack[0]];
                return { ...machineState, name };
            },
            undefined,
        );

        if (state.event.type === 'xstate.init') {
            jsonWriter.beginObject();
            jsonWriter.name('type').value(newStack[0]);
            jsonWriter.name('children').beginArray();
            return;
        }

        const event = state.event as TokenEventObject;

        let divergentPoint = 0;
        while (
            oldStack.length > divergentPoint &&
            newStack.length > divergentPoint &&
            oldStack[divergentPoint] === newStack[divergentPoint]
        ) {
            ++divergentPoint;
        }

        console.log({ divergentPoint });

        // Do we need to move up the stack at all?
        while (oldStack.length > divergentPoint) {
            jsonWriter.close().close();
            oldStack.pop();
        }

        if (
            machineState &&
            machineState.start &&
            newStack.length &&
            newStack.length === oldStack.length + 1 &&
            machineState.name === newStack[newStack.length - 1]
        ) {
            jsonWriter.close().close();
            oldStack.pop();
        }

        while (oldStack.length < newStack.length) {
            const type = newStack[oldStack.length];
            jsonWriter.beginObject();
            jsonWriter.name('type').value(type);
            jsonWriter.name('children').beginArray();
            oldStack.push(type);
        }

        if (delayedWriteToken) {
            writeToken(jsonWriter, delayedWriteToken);
            delayedWriteToken = null;
        }

        if (machineState && machineState.delayedWrite) {
            delayedWriteToken = event;
        } else {
            writeToken(jsonWriter, event);
        }

        oldStack = newStack;
    });

    actor.start();

    const hook: TokenStream = {
        onToken: (token: TokenEventObject): void => {
            actor.send(token);
        },
        finish: () => {
            // Need to check the state machine is in a valid state to terminate
            while (oldStack.length) {
                jsonWriter.close().close();
                oldStack.pop();
            }
            jsonWriter.close().close();
            jsonWriter.finish();
        },
    };
    return hook;
};
