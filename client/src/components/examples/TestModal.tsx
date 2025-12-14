import { useState } from "react";
import TestModal from "../TestModal";
import { Button } from "@/components/ui/button";
import type { Endpoint } from "../EndpointCard";

// todo: remove mock functionality
const mockEndpoint: Endpoint = {
  id: "1",
  method: "GET",
  path: "/api/users",
  validationSchema: "{}",
  response: '{\n  "users": [\n    { "id": 1, "name": "John" },\n    { "id": 2, "name": "Jane" }\n  ]\n}',
  statusCode: 200,
};

export default function TestModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open Test Modal</Button>
      <TestModal
        endpoint={mockEndpoint}
        open={open}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
