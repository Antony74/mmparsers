import { createMachine } from 'xstate';
import { TokenEventObject } from './TokenEventObject';

export type MachineState = { on: { [key: string]: string }, initial?: string, states?: MachineStates };

export type MachineStates = { [key: string]: MachineState };

export type MachineConfig = {
    id: string;
    initial: string;
    predictableActionArguments: boolean;
    states: MachineStates;
};

export const mmMachineConfig: MachineConfig = {
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
