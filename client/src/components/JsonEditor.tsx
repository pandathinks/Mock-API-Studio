import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Wand2 } from "lucide-react";

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label: string;
  testId?: string;
}

export default function JsonEditor({
  value,
  onChange,
  placeholder = "{}",
  label,
  testId = "json-editor",
}: JsonEditorProps) {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!value.trim()) {
      setIsValid(null);
      setError("");
      return;
    }
    try {
      JSON.parse(value);
      setIsValid(true);
      setError("");
    } catch (e) {
      setIsValid(false);
      setError(e instanceof Error ? e.message : "Invalid JSON");
    }
  }, [value]);

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(value);
      onChange(JSON.stringify(parsed, null, 2));
    } catch {
      // Already invalid, do nothing
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </label>
        <div className="flex items-center gap-2">
          {isValid !== null && (
            <span className="flex items-center gap-1 text-xs">
              {isValid ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Valid</span>
                </>
              ) : (
                <>
                  <XCircle className="w-3.5 h-3.5 text-red-500" />
                  <span className="text-red-600 dark:text-red-400">Invalid</span>
                </>
              )}
            </span>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleFormat}
            disabled={!isValid}
            data-testid={`${testId}-format-btn`}
          >
            <Wand2 className="w-3.5 h-3.5 mr-1" />
            Format
          </Button>
        </div>
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="font-mono text-sm min-h-48 resize-y"
        data-testid={testId}
      />
      {error && (
        <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
          <XCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}
