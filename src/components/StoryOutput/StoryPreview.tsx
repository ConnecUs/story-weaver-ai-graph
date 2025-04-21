
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";

export function StoryPreview({ isOpen, onClose }) {
  const [storyText, setStoryText] = useState(
    "Your story will appear here once generated from the Output Node. Connect your story elements and use the Generate button in an Output Node to create your story."
  );

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
          <Button>Export Story</Button>
        </div>
      </Card>
    </div>
  );
}
