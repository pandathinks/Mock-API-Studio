import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, Terminal, FileJson } from "lucide-react";
import { useState } from "react";
import type { Endpoint } from "./EndpointCard";
import MethodBadge from "./MethodBadge";

interface TestModalProps {
  endpoint: Endpoint | null;
  open: boolean;
  onClose: () => void;
  baseUrl?: string;
}

export default function TestModal({
  endpoint,
  open,
  onClose,
  baseUrl = "http://localhost:5000",
}: TestModalProps) {
  const [copied, setCopied] = useState(false);

  if (!endpoint) return null;

  const curlCommand = `curl -X ${endpoint.method} "${baseUrl}/mock${endpoint.path}"${
    endpoint.method !== "GET" && endpoint.method !== "DELETE"
      ? ` \\\n  -H "Content-Type: application/json" \\\n  -d '${JSON.stringify({ example: "data" })}'`
      : ""
  }`;

  const handleCopy = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  let formattedResponse = endpoint.response;
  try {
    formattedResponse = JSON.stringify(JSON.parse(endpoint.response), null, 2);
  } catch {
    // Keep original if not valid JSON
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span>Test Endpoint</span>
            <MethodBadge method={endpoint.method} />
            <code className="font-mono text-sm text-muted-foreground">
              {endpoint.path}
            </code>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="curl" className="mt-4">
          <TabsList>
            <TabsTrigger value="curl" className="gap-2" data-testid="tab-curl">
              <Terminal className="w-4 h-4" />
              cURL
            </TabsTrigger>
            <TabsTrigger value="response" className="gap-2" data-testid="tab-response">
              <FileJson className="w-4 h-4" />
              Response Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="curl" className="mt-4">
            <Card className="p-4 relative">
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={handleCopy}
                data-testid="button-copy-curl"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>
              <pre className="font-mono text-sm whitespace-pre-wrap pr-20 text-foreground">
                {curlCommand}
              </pre>
            </Card>
          </TabsContent>

          <TabsContent value="response" className="mt-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Badge
                  variant="outline"
                  className={`${
                    endpoint.statusCode >= 200 && endpoint.statusCode < 300
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                      : endpoint.statusCode >= 400
                      ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                      : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                  } no-default-hover-elevate no-default-active-elevate`}
                >
                  {endpoint.statusCode}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Content-Type: application/json
                </span>
              </div>
              <pre className="font-mono text-sm whitespace-pre-wrap text-foreground overflow-auto max-h-64">
                {formattedResponse}
              </pre>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
