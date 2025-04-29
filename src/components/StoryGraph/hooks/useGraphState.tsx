
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
    setNodes((nds) =>
      nds.map((node) => {
        const isTarget = edges.some(
          (edge) => edge.source === fromNodeId && node.id === edge.target
        );
        if (isTarget) {
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
