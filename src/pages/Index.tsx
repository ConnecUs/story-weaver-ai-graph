
import { useState } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import { StoryGraph } from "@/components/StoryGraph/StoryGraph";
import { StoryPreview } from "@/components/StoryOutput/StoryPreview";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

const Index = () => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <div className="h-screen w-full overflow-hidden flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b bg-white">
        <div>
          <h1 className="text-2xl font-bold">Story Weaver</h1>
          <p className="text-sm text-muted-foreground">AI-Powered Node-Based Story Generator</p>
        </div>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => setIsPreviewOpen(true)}
        >
          <BookOpen className="h-4 w-4" /> 
          View Story
        </Button>
      </header>
      
      <div className="flex-grow relative">
        <ReactFlowProvider>
          <StoryGraph />
        </ReactFlowProvider>
      </div>
      
      <StoryPreview 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
      />
    </div>
  );
};

export default Index;
