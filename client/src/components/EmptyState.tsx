import { Button } from "@/components/ui/button";
import { Server, Plus } from "lucide-react";

interface EmptyStateProps {
  onCreateNew: () => void;
}

export default function EmptyState({ onCreateNew }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Server className="w-8 h-8 text-muted-foreground" />
      </div>
      <h2 className="text-lg font-medium mb-2">No Mock Endpoints</h2>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">
        Create your first mock endpoint to start building your API simulation.
        Configure paths, validation schemas, and responses.
      </p>
      <Button onClick={onCreateNew} data-testid="button-create-first">
        <Plus className="w-4 h-4 mr-2" />
        Create First Endpoint
      </Button>
    </div>
  );
}
