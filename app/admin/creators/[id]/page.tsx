import { redirect } from "next/navigation";

// Notification deep links point here; creator profiles open as a drawer on the
// creators list, so forward there with the id.
export default async function CreatorDeepLinkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/admin/users/creators?creatorId=${encodeURIComponent(id)}`);
}
