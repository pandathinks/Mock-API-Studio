import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import EndpointForm from "@/components/EndpointForm";
import EmptyState from "@/components/EmptyState";
import TestModal from "@/components/TestModal";
import ThemeToggle from "@/components/ThemeToggle";
import type { Endpoint } from "@/components/EndpointCard";
import type { HttpMethod } from "@/components/MethodBadge";

// todo: remove mock functionality
const initialMockEndpoints: Endpoint[] = [
  {
    id: "1",
    method: "GET",
    path: "/api/users",
    validationSchema: '{\n  "type": "object",\n  "additionalProperties": true\n}',
    response: '{\n  "users": [\n    { "id": 1, "name": "John Doe" },\n    { "id": 2, "name": "Jane Smith" }\n  ]\n}',
    statusCode: 200,
  },
  {
    id: "2",
    method: "POST",
    path: "/api/users",
    validationSchema: '{\n  "type": "object",\n  "properties": {\n    "name": { "type": "string" },\n    "email": { "type": "string", "format": "email" }\n  },\n  "required": ["name"],\n  "additionalProperties": true\n}',
    response: '{\n  "id": 3,\n  "name": "New User",\n  "message": "User created successfully"\n}',
    statusCode: 201,
  },
  {
    id: "3",
    method: "GET",
    path: "/api/users/:id",
    validationSchema: "{}",
    response: '{\n  "id": 1,\n  "name": "John Doe",\n  "email": "john@example.com"\n}',
    statusCode: 200,
  },
  {
    id: "4",
    method: "DELETE",
    path: "/api/users/:id",
    validationSchema: "{}",
    response: '{\n  "message": "User deleted"\n}',
    statusCode: 200,
  },
];

export default function Home() {
  // todo: remove mock functionality - replace with API calls
  const [endpoints, setEndpoints] = useState<Endpoint[]>(initialMockEndpoints);
  const [activeEndpointId, setActiveEndpointId] = useState<string | null>(
    endpoints.length > 0 ? endpoints[0].id : null
  );
  const [isCreating, setIsCreating] = useState(false);
  const [testingEndpoint, setTestingEndpoint] = useState<Endpoint | null>(null);

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
      // Update existing
      setEndpoints((prev) =>
        prev.map((ep) => (ep.id === data.id ? { ...ep, ...data } as Endpoint : ep))
      );
    } else {
      // Create new
      const newEndpoint: Endpoint = {
        ...data,
        id: crypto.randomUUID(),
      } as Endpoint;
      setEndpoints((prev) => [...prev, newEndpoint]);
      setActiveEndpointId(newEndpoint.id);
      setIsCreating(false);
    }
  };

  const handleDelete = (id: string) => {
    setEndpoints((prev) => prev.filter((ep) => ep.id !== id));
    if (activeEndpointId === id) {
      setActiveEndpointId(endpoints.length > 1 ? endpoints[0].id : null);
    }
    setIsCreating(false);
  };

  const style = {
    "--sidebar-width": "18rem",
    "--sidebar-width-icon": "4rem",
  };

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
            {endpoints.length === 0 && !isCreating ? (
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
