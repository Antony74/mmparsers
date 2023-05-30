// nodejs has an inbuilt profiler, but sometimes we just want to measure
// the performance of a bunch of specific functions.  In which case we
// can wrap them as follows

/* eslint-disable @typescript-eslint/no-explicit-any */

type WithReportFn = { report: () => string };

export const performanceInfoWrapFn = <
    FN extends (...args: Parameters<FN>) => ReturnType<FN>
>(
    name: string,
    fn: FN
): ((...args: Parameters<FN>) => ReturnType<FN>) & WithReportFn => {
    let callCount = 0;
    let callTime = 0;
    const wrappedFn = (...args: Parameters<FN>): ReturnType<FN> => {
        const start = performance.now();
        const result = fn(...args);
        const end = performance.now();

        callTime += end - start;
        ++callCount;
        return result;
    };
    return Object.assign(wrappedFn, {
        report: () => {
            const seconds = (callTime / 1000).toFixed(2);
            const paddedCallCount = `${callCount}`.padStart(5);
            return [
                name.padEnd(15),
                callCount === 1
                    ? `called ${paddedCallCount} time  taking`
                    : `called ${paddedCallCount} times taking`,
                `${seconds}`,
                `seconds`,
            ].join(' ');
        },
    });
};

interface Accumlator<T> {
    reportFunctions: (() => string)[];
    obj: Partial<T>;
}

export const performanceInfoWrapObject = <T extends object>(
    obj: T
): T & WithReportFn => {    
    const accumlated: Accumlator<T> = Object.keys(obj).reduce(
        (acc: Accumlator<T>, name): Accumlator<T> => {
            if (typeof (obj as any)[name] === 'function') {
                const wrappedFn = performanceInfoWrapFn(
                    name,
                    (obj as any)[name]
                );
                return {
                    reportFunctions: [...acc.reportFunctions, wrappedFn.report],
                    obj: { ...acc.obj, [name]: wrappedFn },
                };
            } else {
                return {
                    reportFunctions: acc.reportFunctions,
                    obj: { ...acc.obj, [name]: (obj as any)[name] },
                };
            }
        },
        { reportFunctions: [], obj: {} as Partial<T> }
    );

    return Object.assign(accumlated.obj as T, {
        report: () => {
            return [
                '',
                'Performance report:',
                ...accumlated.reportFunctions.map((fn) => fn()),
            ].join('\n');
        },
    });
};
