
import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const developmentTypes = [
  { value: "character", label: "Character" },
  { value: "setting", label: "Setting" },
  { value: "plotPoint", label: "Plot Point" },
  { value: "theme", label: "Theme" },
  { value: "object", label: "Object" },
  { value: "conflict", label: "Conflict" },
];

function DevelopmentNode({ data, selected }: { data: any, selected: boolean }) {
  return (
    <Card className={`w-80 shadow-md transition-shadow ${selected ? 'ring-2 ring-primary' : ''}`}>
      <CardHeader className="p-4 pb-2 bg-green-50">
        <CardTitle className="text-lg font-medium text-green-700">Development Node</CardTitle>
        <CardDescription>Detailed story element</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-3">
          <Label htmlFor="type">Element Type</Label>
          <Select value={data.elementType} onValueChange={data.onTypeChange}>
            <SelectTrigger id="type">
              <SelectValue placeholder="Select element type" />
            </SelectTrigger>
            <SelectContent>
              {developmentTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="mb-3">
          <Label htmlFor="title">Title</Label>
          <input
            id="title"
            value={data.title}
            onChange={(e) => data.onTitleChange(e.target.value)}
            placeholder="Name this element..."
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <Label htmlFor="content">Details</Label>
          <Textarea 
            id="content"
            value={data.content} 
            onChange={(e) => data.onContentChange(e.target.value)}
            placeholder="Describe this story element..."
            className="min-h-[100px] text-sm"
          />
        </div>
      </CardContent>
      
      {/* Input handle - can be connected from other nodes */}
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-3 h-3 bg-green-500" 
        id="dev-in"
      />
      
      {/* Output handle - can connect to other nodes */}
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-3 h-3 bg-green-500" 
        id="dev-out"
      />
    </Card>
  );
}

export default memo(DevelopmentNode);
