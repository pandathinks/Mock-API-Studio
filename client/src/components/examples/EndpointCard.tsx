import { useState } from "react";
import EndpointCard, { type Endpoint } from "../EndpointCard";

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
    response: '{"id": 1, "name": "John"}',
    statusCode: 201,
  },
];

export default function EndpointCardExample() {
  const [activeId, setActiveId] = useState("1");

  return (
    <div className="space-y-2 max-w-xs">
      {mockEndpoints.map((endpoint) => (
        <EndpointCard
          key={endpoint.id}
          endpoint={endpoint}
          isActive={activeId === endpoint.id}
          onClick={() => setActiveId(endpoint.id)}
        />
      ))}
    </div>
  );
}
