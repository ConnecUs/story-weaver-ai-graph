
import { useCallback, useState } from 'react';
import {
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  type Edge,
  MarkerType,
} from '@xyflow/react';

export function useGraphState() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

  const onConnect = useCallback(
    (params) => {
      const edge = {
        ...params,
        animated: true,
        style: { strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#888',
        },
      };
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges]
  );

  const sendDataToNextNodes = useCallback((fromNodeId, dataToSend) => {
    // Debugging
    console.log(`Sending data from node ${fromNodeId}:`, dataToSend);
    
    // Find all edges that start from this node
    const connectedEdges = edges.filter(edge => edge.source === fromNodeId);
    console.log(`Found ${connectedEdges.length} connected edges`);
    
    if (connectedEdges.length === 0) {
      console.log('No connected nodes to send data to');
    }
    
    setNodes((nds) =>
      nds.map((node) => {
        // Check if this node is a target of any edge starting from fromNodeId
        const isTarget = connectedEdges.some(edge => node.id === edge.target);
        
        if (isTarget) {
          console.log(`Sending data to node ${node.id}`);
          return {
            ...node,
            data: { 
              ...node.data,
              receivedData: dataToSend,
            },
          };
        }
        return node;
      })
    );
  }, [edges, setNodes]);

  const getId = () => `node_${Math.random().toString(36).substr(2, 9)}`;

  return {
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    reactFlowInstance,
    setReactFlowInstance,
    contextMenuPosition,
    setContextMenuPosition,
    sendDataToNextNodes,
    getId,
  };
}
