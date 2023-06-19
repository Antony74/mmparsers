import { interpret } from 'xstate';
import { Token } from 'moo';

import { TokenStream } from './tokenStream';
import fsm from './fsm';
import { TokenEventObject } from './TokenEventObject';

export const createFsmParserValidator = (): TokenStream => {
    const actor = interpret(fsm);
    actor.subscribe((state) => {
        console.log(state._event.name);
    });
    actor.onTransition((state, event: TokenEventObject) => {
        console.log(JSON.stringify({ state, event }));
        console.log();
        if (state.event.type === 'xstate.init') {
            return;
        }
        if (!state.changed) {
            throw new Error(
                `In state ${state.value}, unexpected token ${event.type}, line ${event.line} col ${event.col}`
            );
        }
    });
    actor.start();

    const hook = {
        onToken: (token: Token): void => {
            console.log(`onToken ${token.type}`);

            const { type } = token;

            if (type === undefined) {
                throw new Error(`Token encountered without type ${token}`);
            }

            const tokenEventObject: TokenEventObject = { ...token, type };
            actor.send(tokenEventObject);
        },
    };

    return hook;
};
