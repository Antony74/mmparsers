import fsp from 'fs/promises';
import path from 'path';

import { ebnfMachineConfig } from './ebnf-to-json/ebnf-bootstrap-machine-config';
import * as visualize from './visualize-machine-config/visualize';

const main = async (): Promise<void> => {
    const filename = path.join(
        __dirname,
        'ebnf-to-json',
        'ebnf-bootstrap-machine-config.svg',
    );
    return fsp.writeFile(filename, await visualize.toSvg(ebnfMachineConfig));
};

main();
