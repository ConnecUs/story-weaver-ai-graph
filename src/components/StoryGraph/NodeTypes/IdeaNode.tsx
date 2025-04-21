
import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

function IdeaNode({ data, selected }: { data: any, selected: boolean }) {
  return (
    <Card className={`w-80 shadow-md transition-shadow ${selected ? 'ring-2 ring-primary' : ''}`}>
      <CardHeader className="p-4 pb-2 bg-blue-50">
        <CardTitle className="text-lg font-medium text-blue-700">Idea Node</CardTitle>
        <CardDescription>Initial concept or story element</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <Textarea 
          value={data.content} 
          onChange={(e) => data.onChange(e.target.value)}
          placeholder="Enter your story idea..."
          className="min-h-[100px] text-sm"
        />
      </CardContent>
      
      {/* Output handle - can connect to other nodes */}
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-3 h-3 bg-blue-500" 
        id="idea-out"
      />
    </Card>
  );
}

export default memo(IdeaNode);
