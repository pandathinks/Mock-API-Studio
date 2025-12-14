import EndpointForm from "../EndpointForm";
import type { Endpoint } from "../EndpointCard";

// todo: remove mock functionality
const mockEndpoint: Endpoint = {
  id: "1",
  method: "GET",
  path: "/api/users",
  validationSchema: '{\n  "type": "object",\n  "properties": {\n    "name": { "type": "string" }\n  }\n}',
  response: '{\n  "users": [\n    { "id": 1, "name": "John" },\n    { "id": 2, "name": "Jane" }\n  ]\n}',
  statusCode: 200,
};

export default function EndpointFormExample() {
  return (
    <div className="max-w-2xl">
      <EndpointForm
        endpoint={mockEndpoint}
        onSave={(data) => console.log("Save:", data)}
        onDelete={(id) => console.log("Delete:", id)}
        onTest={(ep) => console.log("Test:", ep)}
      />
    </div>
  );
}
