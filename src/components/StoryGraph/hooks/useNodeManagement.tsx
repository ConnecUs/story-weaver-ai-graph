import { useCallback, useState } from 'react';
import { useReactFlow } from '@xyflow/react';
import { useAiGeneration } from '../AiIntegration';

export function useNodeManagement({ nodes, setNodes, setEdges, reactFlowInstance, sendDataToNextNodes, getId }) {
  const { screenToFlowPosition } = useReactFlow();
  const { generateStory } = useAiGeneration();
  const [isStoryPreviewOpen, setIsStoryPreviewOpen] = useState(false);
  const [generatedStoryContent, setGeneratedStoryContent] = useState("");

  const addNode = useCallback(
    (type, position = null) => {
      if (!reactFlowInstance) return;
      
      // If position is not provided, use the center of the viewport
      const nodePosition = position || screenToFlowPosition({ 
        x: window.innerWidth / 2, 
        y: window.innerHeight / 2 
      });
      
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
            onGenerate: async () => {
              console.log('Generate final story');
              
              // Collect all story elements from connected nodes
              const node = nodes.find(n => n.id === nodeId);
              if (!node || !node.data.receivedData) {
                alert('Please connect this output node to story elements first');
                return;
              }
              
              // Get settings from the output node
              const settings = {
                length: node.data.length,
                creativity: node.data.creativity,
                tone: node.data.tone
              };
              
              // Generate story using the AI integration
              const generatedStory = await generateStory(node.data.receivedData, settings);
              setGeneratedStoryContent(generatedStory);
              setIsStoryPreviewOpen(true);
            },
            receivedData: undefined,
          };
          break;
      }

      const newNode = {
        id: nodeId,
        type,
        position: nodePosition,
        data: nodeData,
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [reactFlowInstance, screenToFlowPosition, setNodes, sendDataToNextNodes, getId, nodes, generateStory, setIsStoryPreviewOpen]
  );

  const deleteSelected = useCallback(() => {
    setNodes((nds) => nds.filter((node) => !node.selected));
    setEdges((eds) => eds.filter((edge) => {
      const sourceNode = nodes.find((node) => node.id === edge.source);
      const targetNode = nodes.find((node) => node.id === edge.target);
      return !sourceNode?.selected && !targetNode?.selected;
    }));
  }, [nodes, setNodes, setEdges]);

  return {
    addNode,
    deleteSelected,
    isStoryPreviewOpen,
    setIsStoryPreviewOpen,
    generatedStoryContent
  };
}
