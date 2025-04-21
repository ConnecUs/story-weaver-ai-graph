
import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

function OutputNode({ data, selected }: { data: any, selected: boolean }) {
  return (
    <Card className={`w-80 shadow-md transition-shadow ${selected ? 'ring-2 ring-primary' : ''}`}>
      <CardHeader className="p-4 pb-2 bg-red-50">
        <CardTitle className="text-lg font-medium text-red-700">Output Node</CardTitle>
        <CardDescription>Generate the final story</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-3">
          <Label htmlFor="length">Story Length</Label>
          <Select value={data.length} onValueChange={data.onLengthChange}>
            <SelectTrigger id="length">
              <SelectValue placeholder="Select length" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="short">Short (500 words)</SelectItem>
              <SelectItem value="medium">Medium (1500 words)</SelectItem>
              <SelectItem value="long">Long (3000+ words)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="mb-3">
          <Label className="mb-1 block">Creativity Level</Label>
          <Slider
            value={[data.creativity]}
            min={0}
            max={10}
            step={1}
            onValueChange={(value) => data.onCreativityChange(value[0])}
            className="mb-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Conservative</span>
            <span>Balanced</span>
            <span>Creative</span>
          </div>
        </div>
        
        <div className="mb-4">
          <Label htmlFor="tone">Writing Tone</Label>
          <Select value={data.tone} onValueChange={data.onToneChange}>
            <SelectTrigger id="tone">
              <SelectValue placeholder="Select tone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="serious">Serious</SelectItem>
              <SelectItem value="humorous">Humorous</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="whimsical">Whimsical</SelectItem>
              <SelectItem value="poetic">Poetic</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button className="w-full" onClick={data.onGenerate}>Generate Story</Button>
      </CardContent>
      
      {/* Input handle - can be connected from other nodes */}
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-3 h-3 bg-red-500" 
        id="output-in"
      />
    </Card>
  );
}

export default memo(OutputNode);
