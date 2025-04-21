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

  const addNode = useCallback(
    (type) => {
      if (!reactFlowInstance) return;
      const position = screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
      const nodeId = getId();
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
            sendDataForward: () => {
              setNodes((nds) => {
                const node = nds.find(n => n.id === nodeId);
                if (!node) return nds;
                sendDataToNextNodes(nodeId, { content: node.data.content });
                return nds;
              });
            },
            receivedData: undefined,
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
              console.log('Generate from prompt:', nodeId);
              alert('AI generation would happen here in a complete implementation');
            },
            sendDataForward: () => {
              setNodes((nds) => {
                const node = nds.find(n => n.id === nodeId);
                if (!node) return nds;
                sendDataToNextNodes(nodeId, { content: node.data.content });
                return nds;
              });
            },
            receivedData: undefined,
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
            sendDataForward: () => {
              setNodes((nds) => {
                const node = nds.find(n => n.id === nodeId);
                if (!node) return nds;
                sendDataToNextNodes(nodeId, { elementType: node.data.elementType, title: node.data.title, content: node.data.content });
                return nds;
              });
            },
            receivedData: undefined,
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
            sendDataForward: () => {
              setNodes((nds) => {
                const node = nds.find(n => n.id === nodeId);
                if (!node) return nds;
                sendDataToNextNodes(nodeId, { structureType: node.data.structureType, title: node.data.title, description: node.data.description });
                return nds;
              });
            },
            receivedData: undefined,
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
              console.log('Generate final story');
              alert('Story generation would happen here in a complete implementation');
            },
            receivedData: undefined,
          };
          break;
      }

      const newNode = {
        id: nodeId,
        type,
        position,
        data: nodeData,
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [reactFlowInstance, screenToFlowPosition, setNodes, sendDataToNextNodes]
  );

  const deleteSelected = useCallback(() => {
    setNodes((nds) => nds.filter((node) => !node.selected));
    setEdges((eds) => eds.filter((edge) => {
      const sourceNode = nodes.find((node) => node.id === edge.source);
      const targetNode = nodes.find((node) => node.id === edge.target);
      return !sourceNode?.selected && !targetNode?.selected;
    }));
  }, [nodes, setNodes, setEdges]);

  const saveGraph = useCallback(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      localStorage.setItem('storyGraphSave', JSON.stringify(flow));
      alert('Graph saved locally! In a real implementation, this would be saved to a database.');
    }
  }, [reactFlowInstance]);

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
