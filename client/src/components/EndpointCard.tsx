import { Card } from "@/components/ui/card";
import MethodBadge, { type HttpMethod } from "./MethodBadge";
import { CheckCircle, AlertCircle } from "lucide-react";

export interface Endpoint {
  id: string;
  method: HttpMethod;
  path: string;
  validationSchema: string;
  response: string;
  statusCode: number;
}

interface EndpointCardProps {
  endpoint: Endpoint;
  isActive: boolean;
  onClick: () => void;
}

export default function EndpointCard({ endpoint, isActive, onClick }: EndpointCardProps) {
  const isValidJson = (() => {
    try {
      JSON.parse(endpoint.response);
      return true;
    } catch {
      return false;
    }
  })();

  return (
    <Card
      className={`p-3 cursor-pointer transition-colors hover-elevate active-elevate-2 ${
        isActive ? "bg-sidebar-accent border-sidebar-accent-border" : ""
      }`}
      onClick={onClick}
      data-testid={`card-endpoint-${endpoint.id}`}
    >
      <div className="flex items-center gap-3">
        <MethodBadge method={endpoint.method} />
        <span className="font-mono text-sm truncate flex-1" data-testid={`text-path-${endpoint.id}`}>
          {endpoint.path}
        </span>
        {isValidJson ? (
          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
        ) : (
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
        )}
      </div>
    </Card>
  );
}
