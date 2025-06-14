
import { ReactFlowProvider } from "@xyflow/react";
import { StoryGraph } from "@/components/StoryGraph/StoryGraph";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { useState } from "react";

const Index = () => {
  // This state is now just for the header button
  const [isHeaderPreviewOpen, setIsHeaderPreviewOpen] = useState(false);

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
          onClick={() => setIsHeaderPreviewOpen(true)}
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
    </div>
  );
};

export default Index;
