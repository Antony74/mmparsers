type LeafNode = { type: string; text: string };
type ParentNode = { type: string; children: (LeafNode | Node)[] };
type Node = LeafNode | ParentNode;

const isParentNode = (node: Node): node is ParentNode => 'children' in node;

export const reverseParse = (node: Node): string => {
    if (isParentNode(node)) {
        return node.children.map(reverseParse).join('');
    } else {
        return node.text;
    }
};
