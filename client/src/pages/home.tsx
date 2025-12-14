import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import EndpointForm from "@/components/EndpointForm";
import EmptyState from "@/components/EmptyState";
import TestModal from "@/components/TestModal";
import ThemeToggle from "@/components/ThemeToggle";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Endpoint } from "@/components/EndpointCard";

export default function Home() {
  const { toast } = useToast();
  const [activeEndpointId, setActiveEndpointId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [testingEndpoint, setTestingEndpoint] = useState<Endpoint | null>(null);

  const { data: endpoints = [], isLoading } = useQuery<Endpoint[]>({
    queryKey: ["/api/endpoints"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<Endpoint, "id">) => {
      const res = await apiRequest("POST", "/api/endpoints", data);
      return res.json();
    },
    onSuccess: (newEndpoint: Endpoint) => {
      queryClient.invalidateQueries({ queryKey: ["/api/endpoints"] });
      setActiveEndpointId(newEndpoint.id);
      setIsCreating(false);
      toast({ title: "Endpoint created", description: `${newEndpoint.method} ${newEndpoint.path}` });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create endpoint", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Omit<Endpoint, "id"> }) => {
      const res = await apiRequest("PUT", `/api/endpoints/${id}`, data);
      return res.json();
    },
    onSuccess: (updated: Endpoint) => {
      queryClient.invalidateQueries({ queryKey: ["/api/endpoints"] });
      toast({ title: "Endpoint updated", description: `${updated.method} ${updated.path}` });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update endpoint", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/endpoints/${id}`);
      return id;
    },
    onSuccess: (deletedId: string) => {
      queryClient.invalidateQueries({ queryKey: ["/api/endpoints"] });
      if (activeEndpointId === deletedId) {
        setActiveEndpointId(null);
      }
      toast({ title: "Endpoint deleted" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete endpoint", variant: "destructive" });
    },
  });

  const activeEndpoint = endpoints.find((ep) => ep.id === activeEndpointId);

  const handleCreateNew = () => {
    setActiveEndpointId(null);
    setIsCreating(true);
  };

  const handleSelectEndpoint = (id: string | null) => {
    setActiveEndpointId(id);
    setIsCreating(false);
  };

  const handleSave = (data: Omit<Endpoint, "id"> & { id?: string }) => {
    if (data.id) {
      const { id, ...rest } = data;
      updateMutation.mutate({ id, data: rest });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const style = {
    "--sidebar-width": "18rem",
    "--sidebar-width-icon": "4rem",
  };

  const isPending = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar
          endpoints={endpoints}
          activeEndpointId={activeEndpointId}
          onSelectEndpoint={handleSelectEndpoint}
          onCreateNew={handleCreateNew}
        />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between gap-4 p-3 border-b shrink-0">
            <div className="flex items-center gap-2">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <h1 className="text-lg font-medium">
                {isCreating
                  ? "New Endpoint"
                  : activeEndpoint
                  ? `${activeEndpoint.method} ${activeEndpoint.path}`
                  : "Mock API Configuration"}
              </h1>
            </div>
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto p-6">
            {isLoading ? (
              <div className="max-w-3xl mx-auto space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
              </div>
            ) : endpoints.length === 0 && !isCreating ? (
              <EmptyState onCreateNew={handleCreateNew} />
            ) : isCreating ? (
              <div className="max-w-3xl mx-auto">
                <EndpointForm onSave={handleSave} />
              </div>
            ) : activeEndpoint ? (
              <div className="max-w-3xl mx-auto">
                <EndpointForm
                  endpoint={activeEndpoint}
                  onSave={handleSave}
                  onDelete={handleDelete}
                  onTest={setTestingEndpoint}
                />
              </div>
            ) : (
              <EmptyState onCreateNew={handleCreateNew} />
            )}
          </main>
        </div>
      </div>
      <TestModal
        endpoint={testingEndpoint}
        open={!!testingEndpoint}
        onClose={() => setTestingEndpoint(null)}
      />
    </SidebarProvider>
  );
}
