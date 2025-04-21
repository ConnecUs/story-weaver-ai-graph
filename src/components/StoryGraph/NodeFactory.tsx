
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

export function NodeFactory({ onAddNode }) {
  const [expanded, setExpanded] = useState(false);
  
  const nodeTypes = [
    {
      type: 'idea',
      name: 'Idea Node',
      description: 'Start with a story concept',
      color: 'bg-blue-100'
    },
    {
      type: 'prompt',
      name: 'Prompt Node',
      description: 'Request AI assistance',
      color: 'bg-purple-100'
    },
    {
      type: 'development',
      name: 'Development Node',
      description: 'Develop story elements',
      color: 'bg-green-100'
    },
    {
      type: 'structure',
      name: 'Structure Node',
      description: 'Organize story flow',
      color: 'bg-amber-100'
    },
    {
      type: 'output',
      name: 'Output Node',
      description: 'Generate the final story',
      color: 'bg-red-100'
    }
  ];
  
  return (
    <div className="fixed bottom-6 left-6 z-10">
      {expanded ? (
        <Card className="shadow-lg">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-lg">Add Node</CardTitle>
            <CardDescription>Select a node type to add to your story</CardDescription>
          </CardHeader>
          <CardContent className="p-4 grid grid-cols-1 gap-2">
            {nodeTypes.map((node) => (
              <Button
                key={node.type}
                variant="outline"
                className={`justify-start text-left h-auto p-3 ${node.color}`}
                onClick={() => {
                  onAddNode(node.type);
                  setExpanded(false);
                }}
              >
                <div>
                  <div className="font-medium">{node.name}</div>
                  <div className="text-xs text-muted-foreground">{node.description}</div>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>
      ) : (
        <Button 
          className="h-12 w-12 rounded-full shadow-lg"
          onClick={() => setExpanded(true)}
        >
          <Plus className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}
