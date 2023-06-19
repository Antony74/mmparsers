/* eslint-disable @typescript-eslint/no-explicit-any */
import { MachineConfig, createMachine } from 'xstate';
import { TokenEventObject } from './TokenEventObject';

const mmMachineConfig: MachineConfig<unknown, any, TokenEventObject> = {
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
};

export default createMachine<unknown, TokenEventObject>(mmMachineConfig);
