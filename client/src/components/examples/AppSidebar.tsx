import { useState } from "react";
import AppSidebar from "../AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import type { Endpoint } from "../EndpointCard";

// todo: remove mock functionality
const mockEndpoints: Endpoint[] = [
  {
    id: "1",
    method: "GET",
    path: "/api/users",
    validationSchema: "{}",
    response: '{"users": []}',
    statusCode: 200,
  },
  {
    id: "2",
    method: "POST",
    path: "/api/users",
    validationSchema: '{"required": ["name"]}',
    response: '{"id": 1}',
    statusCode: 201,
  },
  {
    id: "3",
    method: "DELETE",
    path: "/api/users/:id",
    validationSchema: "{}",
    response: "{}",
    statusCode: 204,
  },
];

export default function AppSidebarExample() {
  const [activeId, setActiveId] = useState<string | null>("1");

  const style = {
    "--sidebar-width": "18rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-96 w-full border rounded-lg overflow-hidden">
        <AppSidebar
          endpoints={mockEndpoints}
          activeEndpointId={activeId}
          onSelectEndpoint={setActiveId}
          onCreateNew={() => console.log("Create new")}
        />
        <div className="flex-1 bg-background p-4">
          <p className="text-muted-foreground text-sm">Main content area</p>
        </div>
      </div>
    </SidebarProvider>
  );
}
