import { createMachine, interpret } from 'xstate';
import { TokenStream, TokenEventObject, MachineConfig, StateChange } from './validatingFsm';

// This only exists to check (via unit testing) that our state machine
// implmentation does not diverge from xstate.  Thus we can trust
// the xstate diagrams.

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

export const createParserValidator = (
    nextTokenStream: TokenStream,
    machineConfig: MachineConfig,
): TokenStream => {
    const actor = interpret(
        createMachine<unknown, TokenEventObject>(machineConfig),
    );
    actor.onTransition((state, event: TokenEventObject) => {
        if (state.event.type === 'xstate.init') {
            return;
        }

        const nextState = nextTokenStream.onToken(event);
        const path = stateValueToPath(state.value);

        if (nextState[nextState.length - 1].state !== path[path.length - 1]) {
            throw new Error(
                `nextState ${JSON.stringify(
                    nextState,
                )} has diverged from xstate ${JSON.stringify(path)}`,
            );
        }
    });
    actor.start();

    const hook: TokenStream = {
        onToken: (token: TokenEventObject): StateChange[] => {
            console.log(`onToken ${token.type} ${token.text}`);
            actor.send(token);
            return [];
        },
    };

    return hook;
};
