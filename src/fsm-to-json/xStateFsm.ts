/* eslint-disable @typescript-eslint/no-unused-vars */
import { createMachine, interpret } from 'xstate';
import { Actor, TokenEventObject } from './fsm-to-json';
import { MachineConfig } from './validatingFsm';

export const createXStateFSM = (machineConfig: MachineConfig): Actor => {
    return interpret(createMachine<unknown, TokenEventObject>(machineConfig));
};
