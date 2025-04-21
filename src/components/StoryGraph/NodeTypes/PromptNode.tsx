
import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

function PromptNode({ data, selected }: { data: any, selected: boolean }) {
  return (
    <Card className={`w-80 shadow-md transition-shadow ${selected ? 'ring-2 ring-primary' : ''}`}>
      <CardHeader className="p-4 pb-2 bg-purple-50">
        <CardTitle className="text-lg font-medium text-purple-700">Prompt Node</CardTitle>
        <CardDescription>Instructions for AI assistance</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <Textarea 
          value={data.content} 
          onChange={(e) => data.onChange(e.target.value)}
          placeholder="Write a prompt for AI assistance..."
          className="min-h-[100px] text-sm mb-3"
        />
        <Button className="w-full" variant="outline" onClick={data.onGenerate} disabled={!data.content}>
          <ArrowRight className="h-4 w-4 mr-2" /> Generate
        </Button>
      </CardContent>
      
      {/* Input handle - can be connected from other nodes */}
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-3 h-3 bg-purple-500" 
        id="prompt-in"
      />
      
      {/* Output handle - can connect to other nodes */}
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-3 h-3 bg-purple-500" 
        id="prompt-out"
      />
    </Card>
  );
}

export default memo(PromptNode);
