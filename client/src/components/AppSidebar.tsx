import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Server } from "lucide-react";
import EndpointCard, { type Endpoint } from "./EndpointCard";

interface AppSidebarProps {
  endpoints: Endpoint[];
  activeEndpointId: string | null;
  onSelectEndpoint: (id: string | null) => void;
  onCreateNew: () => void;
}

export default function AppSidebar({
  endpoints,
  activeEndpointId,
  onSelectEndpoint,
  onCreateNew,
}: AppSidebarProps) {
  const [search, setSearch] = useState("");

  const filteredEndpoints = endpoints.filter(
    (ep) =>
      ep.path.toLowerCase().includes(search.toLowerCase()) ||
      ep.method.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2 mb-4">
          <Server className="w-5 h-5 text-primary" />
          <span className="font-semibold">MockAPI</span>
        </div>
        <Button className="w-full" onClick={onCreateNew} data-testid="button-new-endpoint">
          <Plus className="w-4 h-4 mr-2" />
          New Endpoint
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <div className="px-4 py-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search endpoints..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
                data-testid="input-search-endpoints"
              />
            </div>
          </div>
          <SidebarGroupContent className="px-2">
            <SidebarMenu>
              {filteredEndpoints.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  {search ? "No matching endpoints" : "No endpoints yet"}
                </div>
              ) : (
                filteredEndpoints.map((endpoint) => (
                  <SidebarMenuItem key={endpoint.id} className="mb-1">
                    <EndpointCard
                      endpoint={endpoint}
                      isActive={activeEndpointId === endpoint.id}
                      onClick={() => onSelectEndpoint(endpoint.id)}
                    />
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
