import { interpret, EventObject, StateMachine, StateSchema } from 'xstate';
import { TokenStream } from './tokenStream';
import { Token } from 'moo';

type TokenEventObject = Omit<EventObject, 'type'> & {
    line: number;
    col: number;
    type: string;
};

export const createFsmParserValidator = (
    fsm: StateMachine<unknown, StateSchema<unknown>, TokenEventObject>
): TokenStream => {
    const actor = interpret(fsm);
    actor.subscribe((state) => console.log(state.value));
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
            if (token === undefined) {
                return;
            }

            const { type } = token;

            if (type === undefined) {
                throw new Error(`Token encountered without type ${token}`);
            }

            const tokenWithType: TokenEventObject = { ...token, type };
            actor.send(tokenWithType);
        },
    };

    return hook;
};
