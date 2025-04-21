
import { useCallback, useState, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  Panel,
  useReactFlow,
  type Node,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import IdeaNode from './NodeTypes/IdeaNode';
import PromptNode from './NodeTypes/PromptNode';
import DevelopmentNode from './NodeTypes/DevelopmentNode';
import StructureNode from './NodeTypes/StructureNode';
import OutputNode from './NodeTypes/OutputNode';
import { NodeFactory } from './NodeFactory';
import { Button } from '@/components/ui/button';
import { Save, Trash } from 'lucide-react';

// Custom node components mapping
const nodeTypes = {
  idea: IdeaNode,
  prompt: PromptNode,
  development: DevelopmentNode,
  structure: StructureNode,
  output: OutputNode,
};

export function StoryGraph() {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (params) => {
      // Custom edge with animated line and arrow marker
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

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Generate a unique ID
  const getId = () => `node_${Math.random().toString(36).substr(2, 9)}`;

  // Add new node at the center of the viewport
  const addNode = useCallback(
    (type) => {
      if (!reactFlowInstance) return;

      const position = screenToFlowPosition({ 
        x: window.innerWidth / 2, 
        y: window.innerHeight / 2 
      });

      // Add specific properties based on node type
      let nodeData = {};
      
      switch (type) {
        case 'idea':
          nodeData = {
            content: '',
            onChange: (content) => {
              setNodes((nds) =>
                nds.map((node) => {
                  if (node.id === nodeId) {
                    return { ...node, data: { ...node.data, content } };
                  }
                  return node;
                })
              );
            },
          };
          break;
          
        case 'prompt':
          nodeData = {
            content: '',
            onChange: (content) => {
              setNodes((nds) =>
                nds.map((node) => {
                  if (node.id === nodeId) {
                    return { ...node, data: { ...node.data, content } };
                  }
                  return node;
                })
              );
            },
            onGenerate: () => {
              // In a real implementation, this would trigger AI generation
              console.log('Generate from prompt:', nodeId);
              // Placeholder for AI integration
              alert('AI generation would happen here in a complete implementation');
            },
          };
          break;
          
        case 'development':
          nodeData = {
            elementType: 'character',
            title: '',
            content: '',
            onTypeChange: (elementType) => {
              setNodes((nds) =>
                nds.map((node) => {
                  if (node.id === nodeId) {
                    return { ...node, data: { ...node.data, elementType } };
                  }
                  return node;
                })
              );
            },
            onTitleChange: (title) => {
              setNodes((nds) =>
                nds.map((node) => {
                  if (node.id === nodeId) {
                    return { ...node, data: { ...node.data, title } };
                  }
                  return node;
                })
              );
            },
            onContentChange: (content) => {
              setNodes((nds) =>
                nds.map((node) => {
                  if (node.id === nodeId) {
                    return { ...node, data: { ...node.data, content } };
                  }
                  return node;
                })
              );
            },
          };
          break;
          
        case 'structure':
          nodeData = {
            structureType: 'sequence',
            title: '',
            description: '',
            onTypeChange: (structureType) => {
              setNodes((nds) =>
                nds.map((node) => {
                  if (node.id === nodeId) {
                    return { ...node, data: { ...node.data, structureType } };
                  }
                  return node;
                })
              );
            },
            onTitleChange: (title) => {
              setNodes((nds) =>
                nds.map((node) => {
                  if (node.id === nodeId) {
                    return { ...node, data: { ...node.data, title } };
                  }
                  return node;
                })
              );
            },
            onDescriptionChange: (description) => {
              setNodes((nds) =>
                nds.map((node) => {
                  if (node.id === nodeId) {
                    return { ...node, data: { ...node.data, description } };
                  }
                  return node;
                })
              );
            },
          };
          break;
          
        case 'output':
          nodeData = {
            length: 'medium',
            creativity: 5,
            tone: 'serious',
            onLengthChange: (length) => {
              setNodes((nds) =>
                nds.map((node) => {
                  if (node.id === nodeId) {
                    return { ...node, data: { ...node.data, length } };
                  }
                  return node;
                })
              );
            },
            onCreativityChange: (creativity) => {
              setNodes((nds) =>
                nds.map((node) => {
                  if (node.id === nodeId) {
                    return { ...node, data: { ...node.data, creativity } };
                  }
                  return node;
                })
              );
            },
            onToneChange: (tone) => {
              setNodes((nds) =>
                nds.map((node) => {
                  if (node.id === nodeId) {
                    return { ...node, data: { ...node.data, tone } };
                  }
                  return node;
                })
              );
            },
            onGenerate: () => {
              // In a real implementation, this would generate the final story
              console.log('Generate final story');
              // Placeholder for story generation
              alert('Story generation would happen here in a complete implementation');
            },
          };
          break;
      }

      const nodeId = getId();
      const newNode = {
        id: nodeId,
        type,
        position,
        data: nodeData,
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [reactFlowInstance, screenToFlowPosition, setNodes]
  );

  // Delete selected nodes and connected edges
  const deleteSelected = useCallback(() => {
    setNodes((nds) => nds.filter((node) => !node.selected));
    setEdges((eds) => eds.filter((edge) => {
      const sourceNode = nodes.find((node) => node.id === edge.source);
      const targetNode = nodes.find((node) => node.id === edge.target);
      return !sourceNode?.selected && !targetNode?.selected;
    }));
  }, [nodes, setNodes, setEdges]);

  // Save the current graph (placeholder for real save functionality)
  const saveGraph = useCallback(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      localStorage.setItem('storyGraphSave', JSON.stringify(flow));
      alert('Graph saved locally! In a real implementation, this would be saved to a database.');
    }
  }, [reactFlowInstance]);

  // Load saved graph on initial render (if available)
  const loadSavedGraph = useCallback(() => {
    const savedFlow = localStorage.getItem('storyGraphSave');
    if (savedFlow) {
      const flow = JSON.parse(savedFlow);
      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);
    }
  }, [setNodes, setEdges]);

  return (
    <div className="w-full h-screen" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDragOver={onDragOver}
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
        
        <Panel position="top-right" className="flex gap-2">
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={deleteSelected}
            className="flex items-center"
          >
            <Trash className="h-4 w-4 mr-1" /> Delete Selected
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={saveGraph}
            className="flex items-center"
          >
            <Save className="h-4 w-4 mr-1" /> Save Graph
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadSavedGraph}
          >
            Load Saved
          </Button>
        </Panel>
        
        <NodeFactory onAddNode={addNode} />
      </ReactFlow>
    </div>
  );
}
