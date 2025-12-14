import { useState } from "react";
import JsonEditor from "../JsonEditor";

export default function JsonEditorExample() {
  const [value, setValue] = useState(JSON.stringify({ name: "test", value: 123 }, null, 2));

  return (
    <div className="max-w-xl">
      <JsonEditor
        label="Response Body"
        value={value}
        onChange={setValue}
        placeholder='{"key": "value"}'
        testId="example-json-editor"
      />
    </div>
  );
}
