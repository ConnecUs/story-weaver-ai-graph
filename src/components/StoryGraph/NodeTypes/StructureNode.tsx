
import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';

const structureTypes = [
  { value: "sequence", label: "Sequence" },
  { value: "chapter", label: "Chapter/Scene" },
  { value: "act", label: "Act" }
];

function StructureNode({ data, selected }: { data: any, selected: boolean }) {
  return (
    <Card className={`w-80 shadow-md ${selected ? 'ring-2 ring-primary' : ''}`}>
      <CardHeader className="p-4 pb-2 bg-amber-50">
        <CardTitle className="text-lg font-medium text-amber-700">Structure Node</CardTitle>
        <CardDescription>Organizes story elements and flow</CardDescription>
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        <div className="mb-1">
          <Label htmlFor="structureType">Structure Type</Label>
          <Select value={data.structureType} onValueChange={data.onTypeChange}>
            <SelectTrigger id="structureType">
              <SelectValue placeholder="Select structure type" />
            </SelectTrigger>
            <SelectContent>
              {structureTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="mb-1">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={data.title}
            onChange={(e) => data.onTitleChange(e.target.value)}
            placeholder="Name this structure..."
          />
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={data.description}
            onChange={(e) => data.onDescriptionChange(e.target.value)}
            placeholder="Briefly describe this structure..."
          />
        </div>
        <Button 
          className="w-full mt-2" 
          variant="secondary" 
          onClick={data.sendDataForward}
          disabled={!data.title && !data.description}
        >
          Send Data Forward
        </Button>
        {data.receivedData && (
          <div className="mt-2 p-2 border rounded text-xs bg-amber-100 text-amber-700">
            <b>Received:</b> {typeof data.receivedData === "object" ? JSON.stringify(data.receivedData) : String(data.receivedData)}
          </div>
        )}
      </CardContent>
      
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-3 h-3 bg-amber-500" 
        id="structure-in"
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-3 h-3 bg-amber-500" 
        id="structure-out"
      />
    </Card>
  );
}

export default memo(StructureNode);
