import { MachineConfig } from '../fsm-to-json/validatingFsm';

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
                '::=': '::=',
            },
        },
        '::=': {
            on: {
                NCName: 'NCName',
                StringLiteral: 'StringLiteral',
                CharClass: 'CharClass',
            },
        },
        NCName: {
            delayedWrite: true,
            on: {
                '?': 'NCName',
                '**': 'NCName',
                '+': 'NCName',
                NCName: 'NCName',
                StringLiteral: 'StringLiteral',
                CharClass: 'CharClass',
                '::=': '::=',
            },
        },
        StringLiteral: {
            on: {
                '?': 'StringLiteral',
                '**': 'StringLiteral',
                '+': 'StringLiteral',
                NCName: 'NCName',
                StringLiteral: 'StringLiteral',
                CharClass: 'CharClass',
            },
        },
        CharClass: {
            on: {
                '?': 'CharClass',
                '**': 'CharClass',
                '+': 'CharClass',
                NCName: 'NCName',
                StringLiteral: 'StringLiteral',
                CharClass: 'CharClass',
            },
        },
    },
};
