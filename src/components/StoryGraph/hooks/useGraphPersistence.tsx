
import { useCallback } from 'react';

export function useGraphPersistence({ reactFlowInstance, setNodes, setEdges }) {
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

  return {
    saveGraph,
    loadSavedGraph
  };
}
