import { isParentNode, MMNode } from '../mmParser/mmParseTree';

export const reverseParse = (node: MMNode): string => {
    const ws = (node.ws ?? []).join('');

    if (isParentNode(node)) {
        const text = ws + node.children.map(reverseParse).join('');
        if (node.type === 'database') {
            const trailingWs = (node.trailingWs ?? []).join('');
            return text + trailingWs;
        } else {
            return text;
        }
    } else {
        return ws + node.text;
    }
};
