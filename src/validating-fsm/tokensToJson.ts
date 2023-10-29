import { JsonWriter } from '../jsonWriter/jsonWriter';

import {
    StateChange,
    StateChangeDirection,
    TokenEventObject,
    TokenStateStream,
} from './validatingFsm';

export const createTokensToJson = (writer: JsonWriter): TokenStateStream => {
    const state: string[] = [];

    writer
        .beginObject()
        .name('type')
        .value('Grammar')
        .name('children')
        .beginArray();

    const hook: TokenStateStream = {
        onToken: (
            token: TokenEventObject,
            stateChanges: StateChange[],
        ): void => {
//            console.log(stateChanges);
            stateChanges.forEach((stateChange) => {
//                console.log(stateChange.direction);

                if (
                    stateChange.direction === StateChangeDirection.up ||
                    stateChange.direction === StateChangeDirection.across
                ) {
                    if (state.pop()) {
                        writer.close().close();
                    } else if (
                        stateChange.direction === StateChangeDirection.up
                    ) {
                        throw new Error(`We seem to have gone up too far`);
                    }
                }

                if (stateChange.direction === StateChangeDirection.across) {
                    state.push(token.type);

                    writer
                        .beginObject()
                        .name('type')
                        .value(stateChange.state)
                        .name('children')
                        .beginArray();

                    writer
                        .beginObject()
                        .name('type')
                        .value(token.type)
                        .name('text')
                        .value(token.text)
                        .close();
                }

                if (stateChange.direction === StateChangeDirection.down) {
                    state.push(token.type);

                    writer
                        .beginObject()
                        .name('type')
                        .value(token.type)
                        .name('text')
                        .value(token.text)
                        .name('children')
                        .beginArray();
                }
            });
        },
    };

    return hook;
};
