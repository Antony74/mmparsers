import { createMachine } from 'xstate';
import { TokenEventObject } from './TokenEventObject';

const fsm = createMachine<unknown, TokenEventObject>({
    id: 'mmParser',
    initial: 'outermost_scope_stmt',
    predictableActionArguments: true,
    states: {
        outermost_scope_stmt: {
            on: {
                $c: '$c',
                _COMMENT: 'outermost_scope_stmt',
                WHITESPACE: 'outermost_scope_stmt',
            },
        },
        _COMMENT: {
            on: { WHITESPACE: 'outermost_scope_stmt' },
        },
        $c: {
            on: { '$.': 'outermost_scope_stmt' },
            initial: '$c',
            states: { $c: { on: {} } },
        },
    },
});

export default fsm;
