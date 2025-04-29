
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { X, Download, Copy, Check } from "lucide-react";
import { toast } from "@/components/ui/sonner";

export function StoryPreview({ isOpen, onClose, storyContent = null }) {
  const [storyText, setStoryText] = useState(
    storyContent || "Your story will appear here once generated from the Output Node. Connect your story elements and use the Generate button in an Output Node to create your story."
  );
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(storyText);
    setIsCopied(true);
    toast.success("Story copied to clipboard");
    
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const handleExport = () => {
    // Create a Blob with the story text
    const blob = new Blob([storyText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Create a link element and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-story.txt';
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Story exported successfully");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold">Generated Story</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="p-4 flex-grow overflow-auto">
          <Textarea
            value={storyText}
            onChange={(e) => setStoryText(e.target.value)}
            className="w-full h-full min-h-[50vh]"
            placeholder="Your story will appear here..."
          />
        </div>
        <div className="p-4 border-t flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-1"
            onClick={copyToClipboard}
          >
            {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {isCopied ? "Copied" : "Copy"}
          </Button>
          <Button onClick={handleExport} className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            Export Story
          </Button>
        </div>
      </Card>
    </div>
  );
}
