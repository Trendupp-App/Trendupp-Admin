import { redirect } from "next/navigation";

// Notification deep links point here; brand profiles open as a drawer on the
// brands list, so forward there with the id.
export default async function BrandDeepLinkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/admin/users/brands?brandId=${encodeURIComponent(id)}`);
}
