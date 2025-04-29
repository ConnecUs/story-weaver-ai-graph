
import { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Node types
import IdeaNode from './NodeTypes/IdeaNode';
import PromptNode from './NodeTypes/PromptNode';
import DevelopmentNode from './NodeTypes/DevelopmentNode';
import StructureNode from './NodeTypes/StructureNode';
import OutputNode from './NodeTypes/OutputNode';

// Custom hooks
import { useGraphState } from './hooks/useGraphState';
import { useNodeManagement } from './hooks/useNodeManagement';
import { useGraphPersistence } from './hooks/useGraphPersistence';

// Components
import { NodeFactory } from './NodeFactory';
import { GraphPanel } from './components/GraphPanel';
import { NodeContextMenu } from './components/NodeContextMenu';
import { nodeTypesList } from './constants/nodeTypes';

const nodeTypes = {
  idea: IdeaNode,
  prompt: PromptNode,
  development: DevelopmentNode,
  structure: StructureNode,
  output: OutputNode,
};

export function StoryGraph() {
  const reactFlowWrapper = useRef(null);
  const { screenToFlowPosition } = useReactFlow();
  
  // Custom hooks
  const {
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
    getId
  } = useGraphState();
  
  const { addNode, deleteSelected } = useNodeManagement({ 
    nodes, 
    setNodes, 
    setEdges, 
    reactFlowInstance, 
    sendDataToNextNodes, 
    getId 
  });
  
  const { saveGraph, loadSavedGraph } = useGraphPersistence({ 
    reactFlowInstance, 
    setNodes, 
    setEdges 
  });

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const handleContextMenu = useCallback(
    (event) => {
      // Prevent default context menu
      event.preventDefault();
      
      if (reactFlowInstance) {
        // Convert the mouse position to flow position
        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY
        });
        
        // Store the position where we want to add the node
        setContextMenuPosition(position);
      }
    },
    [reactFlowInstance, screenToFlowPosition, setContextMenuPosition]
  );

  return (
    <div className="w-full h-screen" ref={reactFlowWrapper}>
      <NodeContextMenu 
        nodeTypesList={nodeTypesList}
        onAddNode={addNode}
        contextMenuPosition={contextMenuPosition}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDragOver={onDragOver}
          onContextMenu={handleContextMenu}
          nodeTypes={nodeTypes}
          fitView
          snapToGrid
          proOptions={{ hideAttribution: true }}
        >
          <Controls />
          <MiniMap 
            nodeStrokeWidth={3}
            zoomable
            pannable
          />
          <Background color="#f0f0f0" gap={12} size={1} />
          
          <GraphPanel 
            deleteSelected={deleteSelected}
            saveGraph={saveGraph}
            loadSavedGraph={loadSavedGraph}
          />
          
          <NodeFactory onAddNode={addNode} />
        </ReactFlow>
      </NodeContextMenu>
    </div>
  );
}
