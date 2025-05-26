
import { useCallback } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
  ContextMenuLabel
} from "@/components/ui/context-menu";

interface NodeTypeItem {
  type: string;
  name: string;
  description: string;
  color: string;
}

interface NodeContextMenuProps {
  children: React.ReactNode;
  nodeTypesList: NodeTypeItem[];
  onAddNode: (type: string, position: { x: number, y: number }) => void;
  contextMenuPosition: { x: number, y: number };
  hoveredNode?: any;
  edges: any[];
}

const getNodeBlueprints = (parentNodeType: string): string[] => {
  const blueprints = {
    idea: ['prompt', 'development'],
    prompt: ['development', 'structure'],
    development: ['structure', 'output'],
    structure: ['output'],
    output: []
  };
  
  return blueprints[parentNodeType] || [];
};

export function NodeContextMenu({ 
  children, 
  nodeTypesList, 
  onAddNode, 
  contextMenuPosition,
  hoveredNode,
  edges
}: NodeContextMenuProps) {
  const handleAddNodeFromContextMenu = useCallback(
    (type: string) => {
      console.log('Adding node from context menu:', type, 'at position:', contextMenuPosition);
      onAddNode(type, contextMenuPosition);
    },
    [onAddNode, contextMenuPosition]
  );

  // Get suggested blueprints based on hovered node
  const suggestedTypes = hoveredNode ? getNodeBlueprints(hoveredNode.type) : [];
  const suggestedNodes = nodeTypesList.filter(node => suggestedTypes.includes(node.type));
  const otherNodes = nodeTypesList.filter(node => !suggestedTypes.includes(node.type));

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        {suggestedNodes.length > 0 && (
          <>
            <ContextMenuLabel>Suggested for {hoveredNode?.type} node</ContextMenuLabel>
            {suggestedNodes.map((node) => (
              <ContextMenuItem 
                key={`suggested-${node.type}`}
                onClick={() => handleAddNodeFromContextMenu(node.type)}
                className={`cursor-pointer ${node.color} border-l-2 border-blue-500`}
              >
                <div>
                  <div className="font-medium">📋 {node.name}</div>
                  <div className="text-xs text-muted-foreground">{node.description}</div>
                </div>
              </ContextMenuItem>
            ))}
            <ContextMenuSeparator />
            <ContextMenuLabel>All Node Types</ContextMenuLabel>
          </>
        )}
        
        {otherNodes.map((node) => (
          <ContextMenuItem 
            key={node.type} 
            onClick={() => handleAddNodeFromContextMenu(node.type)}
            className={`cursor-pointer ${node.color}`}
          >
            <div>
              <div className="font-medium">{node.name}</div>
              <div className="text-xs text-muted-foreground">{node.description}</div>
            </div>
          </ContextMenuItem>
        ))}
      </ContextMenuContent>
    </ContextMenu>
  );
}
