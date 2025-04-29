
import { Panel } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { Trash, Save } from 'lucide-react';

interface GraphPanelProps {
  deleteSelected: () => void;
  saveGraph: () => void;
  loadSavedGraph: () => void;
}

export function GraphPanel({ deleteSelected, saveGraph, loadSavedGraph }: GraphPanelProps) {
  return (
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
  );
}
