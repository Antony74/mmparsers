import { EventObject } from 'xstate';

export type TokenEventObject = Omit<EventObject, 'type'> & {
    line: number;
    col: number;
    type: string;
};
