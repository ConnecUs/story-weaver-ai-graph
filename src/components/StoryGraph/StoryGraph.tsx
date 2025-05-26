
import { useCallback, useRef, useState } from 'react';
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
import { StoryPreview } from '../StoryOutput/StoryPreview';

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
  const [hoveredNode, setHoveredNode] = useState(null);
  
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
  
  const { 
    addNode, 
    deleteSelected, 
    isStoryPreviewOpen,
    setIsStoryPreviewOpen,
    generatedStoryContent
  } = useNodeManagement({ 
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
      event.preventDefault();
      console.log('Context menu triggered at:', event.clientX, event.clientY);
      
      if (reactFlowInstance) {
        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY
        });
        
        console.log('Setting context menu position to:', position);
        setContextMenuPosition(position);
        
        // Check if we're hovering over a node
        const rect = reactFlowWrapper.current.getBoundingClientRect();
        const flowPosition = screenToFlowPosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
        });
        
        const nodeAtPosition = nodes.find(node => {
          const nodeRect = {
            x: node.position.x,
            y: node.position.y,
            width: 200, // approximate node width
            height: 100 // approximate node height
          };
          
          return flowPosition.x >= nodeRect.x && 
                 flowPosition.x <= nodeRect.x + nodeRect.width &&
                 flowPosition.y >= nodeRect.y && 
                 flowPosition.y <= nodeRect.y + nodeRect.height;
        });
        
        setHoveredNode(nodeAtPosition);
        console.log('Hovered node:', nodeAtPosition?.type || 'none');
      }
    },
    [reactFlowInstance, screenToFlowPosition, setContextMenuPosition, nodes]
  );

  const onNodeMouseEnter = useCallback((event, node) => {
    setHoveredNode(node);
  }, []);

  const onNodeMouseLeave = useCallback(() => {
    setHoveredNode(null);
  }, []);

  return (
    <div className="w-full h-screen" ref={reactFlowWrapper}>
      <NodeContextMenu 
        nodeTypesList={nodeTypesList}
        onAddNode={addNode}
        contextMenuPosition={contextMenuPosition}
        hoveredNode={hoveredNode}
        edges={edges}
      >
        <div className="w-full h-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDragOver={onDragOver}
            onContextMenu={handleContextMenu}
            onNodeMouseEnter={onNodeMouseEnter}
            onNodeMouseLeave={onNodeMouseLeave}
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
        </div>
      </NodeContextMenu>
      
      <StoryPreview 
        isOpen={isStoryPreviewOpen} 
        onClose={() => setIsStoryPreviewOpen(false)}
        storyContent={generatedStoryContent}
      />
    </div>
  );
}
