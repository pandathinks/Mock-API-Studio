import MethodBadge from "../MethodBadge";

export default function MethodBadgeExample() {
  return (
    <div className="flex gap-2 flex-wrap">
      <MethodBadge method="GET" />
      <MethodBadge method="POST" />
      <MethodBadge method="PUT" />
      <MethodBadge method="PATCH" />
      <MethodBadge method="DELETE" />
    </div>
  );
}
