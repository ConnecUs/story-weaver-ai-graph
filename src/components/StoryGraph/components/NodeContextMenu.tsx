
import { useCallback } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
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
}

export function NodeContextMenu({ children, nodeTypesList, onAddNode, contextMenuPosition }: NodeContextMenuProps) {
  const handleAddNodeFromContextMenu = useCallback(
    (type: string) => {
      onAddNode(type, contextMenuPosition);
    },
    [onAddNode, contextMenuPosition]
  );

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent>
        {nodeTypesList.map((node) => (
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
