import { MachineConfig } from '../validating-fsm';

export const ebnfMachineConfig: MachineConfig = {
    id: 'ebnf',
    initial: 'Grammar',
    predictableActionArguments: true,
    states: {
        Grammar: {
            on: {
                NCName: 'Production',
            },
        },
        Production: {
            on: {
                '::=': 'Item',
            },
        },
        Item: {
            initial: '::=',
            on: { NCName: 'Production' },
            states: {
                '::=': { on: { NCName: 'Primary' } },
                Primary: {
                    on: {
                        '?': 'Primary',
                        '**': 'Primary',
                        '+': 'Primary',
                    },
                },
            },
        },
    },
};
