import EmptyState from "../EmptyState";

export default function EmptyStateExample() {
  return (
    <div className="h-80 border rounded-lg">
      <EmptyState onCreateNew={() => console.log("Create new endpoint")} />
    </div>
  );
}
