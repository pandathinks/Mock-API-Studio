import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import JsonEditor from "./JsonEditor";
import type { Endpoint } from "./EndpointCard";
import type { HttpMethod } from "./MethodBadge";
import { Save, Trash2, Play } from "lucide-react";

interface EndpointFormProps {
  endpoint?: Endpoint;
  onSave: (endpoint: Omit<Endpoint, "id"> & { id?: string }) => void;
  onDelete?: (id: string) => void;
  onTest?: (endpoint: Endpoint) => void;
}

const defaultEndpoint: Omit<Endpoint, "id"> = {
  method: "GET",
  path: "/api/",
  validationSchema: "{}",
  response: '{\n  "message": "Success"\n}',
  statusCode: 200,
};

export default function EndpointForm({
  endpoint,
  onSave,
  onDelete,
  onTest,
}: EndpointFormProps) {
  const [form, setForm] = useState<Omit<Endpoint, "id"> & { id?: string }>(
    endpoint || defaultEndpoint
  );

  useEffect(() => {
    setForm(endpoint || defaultEndpoint);
  }, [endpoint]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  const isValid = (() => {
    try {
      JSON.parse(form.validationSchema);
      JSON.parse(form.response);
      return form.path.startsWith("/");
    } catch {
      return false;
    }
  })();

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="method" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Method
            </Label>
            <Select
              value={form.method}
              onValueChange={(value: HttpMethod) =>
                setForm({ ...form, method: value })
              }
            >
              <SelectTrigger id="method" data-testid="select-method">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="PATCH">PATCH</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2 space-y-2">
            <Label htmlFor="path" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Path
            </Label>
            <Input
              id="path"
              value={form.path}
              onChange={(e) => setForm({ ...form, path: e.target.value })}
              placeholder="/api/resource"
              className="font-mono"
              data-testid="input-path"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="statusCode" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Status
            </Label>
            <Select
              value={form.statusCode.toString()}
              onValueChange={(value) =>
                setForm({ ...form, statusCode: parseInt(value) })
              }
            >
              <SelectTrigger id="statusCode" data-testid="select-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="200">200 OK</SelectItem>
                <SelectItem value="201">201 Created</SelectItem>
                <SelectItem value="204">204 No Content</SelectItem>
                <SelectItem value="400">400 Bad Request</SelectItem>
                <SelectItem value="401">401 Unauthorized</SelectItem>
                <SelectItem value="403">403 Forbidden</SelectItem>
                <SelectItem value="404">404 Not Found</SelectItem>
                <SelectItem value="500">500 Server Error</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <JsonEditor
          label="Validation Schema (JSON Schema - permissive by default)"
          value={form.validationSchema}
          onChange={(value) => setForm({ ...form, validationSchema: value })}
          placeholder='{"type": "object", "properties": {"name": {"type": "string"}}}'
          testId="input-validation-schema"
        />

        <JsonEditor
          label="Mock Response Body"
          value={form.response}
          onChange={(value) => setForm({ ...form, response: value })}
          placeholder='{"message": "Success"}'
          testId="input-response"
        />

        <div className="flex items-center justify-end gap-2 pt-4 border-t">
          {endpoint && onDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive" data-testid="button-delete">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Endpoint?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently remove the mock endpoint for{" "}
                    <code className="font-mono bg-muted px-1 rounded">
                      {endpoint.method} {endpoint.path}
                    </code>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(endpoint.id)}
                    className="bg-destructive text-destructive-foreground"
                    data-testid="button-confirm-delete"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {endpoint && onTest && (
            <Button
              type="button"
              variant="outline"
              onClick={() => onTest(endpoint)}
              data-testid="button-test"
            >
              <Play className="w-4 h-4 mr-2" />
              Test
            </Button>
          )}
          <Button type="submit" disabled={!isValid} data-testid="button-save">
            <Save className="w-4 h-4 mr-2" />
            {endpoint ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
