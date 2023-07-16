import { MachineConfig } from '../validating-fsm';

export const ebnfMachineConfig: MachineConfig = {
    id: 'ebnf',
    initial: 'Grammar',
    predictableActionArguments: true,
    states: {
        Grammar: {
            on: {
                NCName: 'NCName',
            },
        },
        NCName: {
            on: {
                '::=': 'Item',
            },
        },
        Item: {
            initial: '::=',
            on: {},
            states: {
                '::=': { on: { NCName: 'Primary' } },
                Primary: {
                    on: { '?': 'Primary', '*': 'Primary', '+': 'Primary' },
                },
            },
        },
    },
};
