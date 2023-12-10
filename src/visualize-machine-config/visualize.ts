import graphviz from 'graphviz';
import { graphviz as nodegraphviz } from 'node-graphviz';
import { MachineConfig } from '../fsm-to-json/validatingFsm';

export const toGraphViz = (machineConfig: MachineConfig): graphviz.Graph => {
    const graph = graphviz.digraph(machineConfig.id);

    Object.keys(machineConfig.states).forEach((sourceNodeKey) => {
        const node = machineConfig.states[sourceNodeKey];
        graph.addNode(sourceNodeKey);
        Object.keys(node.on).forEach((edgeKey) => {
            const destinationNodeKey = node.on[edgeKey];
            graph.addEdge(sourceNodeKey, destinationNodeKey, {label: edgeKey});
        });
    });

    return graph;
};

export const toSvg = (machineConfig: MachineConfig): Promise<string> => {
    return nodegraphviz.layout(toGraphViz(machineConfig).to_dot(), 'svg');
};

