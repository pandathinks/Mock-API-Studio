import { Badge } from "@/components/ui/badge";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface MethodBadgeProps {
  method: HttpMethod;
}

const methodColors: Record<HttpMethod, string> = {
  GET: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  POST: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  PUT: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  PATCH: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  DELETE: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
};

export default function MethodBadge({ method }: MethodBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={`${methodColors[method]} font-mono text-xs px-2 py-0.5 no-default-hover-elevate no-default-active-elevate`}
      data-testid={`badge-method-${method.toLowerCase()}`}
    >
      {method}
    </Badge>
  );
}

export type { HttpMethod };
