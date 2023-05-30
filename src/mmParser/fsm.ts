import { createMachine } from 'xstate';

const fsm = createMachine({
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
        $c: { on: { '$.': 'outermost_scope_stmt' }, initial: '$c', states: {} },
    },
});

export default fsm;