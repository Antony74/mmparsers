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
            on: { '::=': 'Item' },
            states: {
                '::=': {
                    on: {
                        NCName: 'NCName',
                        StringLiteral: 'StringLiteral',
                        CharClass: 'CharClass',
                    },
                },
                NCName: {
                    on: {
                        '?': 'NCName',
                        '**': 'NCName',
                        '+': 'NCName',
                        NCName: 'NCName',
                        StringLiteral: 'StringLiteral',
                        CharClass: 'CharClass',
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
        },
    },
};
