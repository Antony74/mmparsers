import { interpret } from 'xstate';

import { TokenStream } from './tokenStream';
import mmStateMachine from './mmStateMachine';
import { TokenEventObject } from './TokenEventObject';

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

export const createFsmParserValidator = (
    nextTokenStream: TokenStream
): TokenStream => {
    const actor = interpret(mmStateMachine);
    actor.onTransition((state, event: TokenEventObject) => {
        if (state.event.type === 'xstate.init') {
            return;
        }

        const nextState = nextTokenStream.onToken(event);
        const path = stateValueToPath(state.value);

        if (nextState !== path[path.length - 1]) {
            throw new Error(
                `nextState ${JSON.stringify(
                    nextState
                )} has diverged from xstate ${JSON.stringify(path)}`
            );
        }
    });
    actor.start();

    const hook: TokenStream = {
        onToken: (token: TokenEventObject): string => {
            console.log(`onToken ${token.type}`);
            actor.send(token);
            return '';
        },
    };

    return hook;
};
