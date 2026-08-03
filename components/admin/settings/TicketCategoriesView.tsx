"use client";

import TaxonomyPillsView from "./TaxonomyPillsView";
import {
  useTicketCategories,
  useCreateTicketCategory,
  useUpdateTicketCategory,
  useDeleteTicketCategory,
} from "@/hooks/useAdminTaxonomies";

export default function TicketCategoriesView() {
  const { data: categories = [], isLoading } = useTicketCategories();
  const createMutation = useCreateTicketCategory();
  const updateMutation = useUpdateTicketCategory();
  const deleteMutation = useDeleteTicketCategory();

  return (
    <TaxonomyPillsView
      title="Ticket Categories"
      subtitle="These are the issue categories users pick when opening a support ticket."
      entityLabel="Category"
      entityLabelPlural="categories"
      deleteWarning="This action will remove it from the support ticket form options."
      items={categories}
      isLoading={isLoading}
      isSaving={createMutation.isPending || updateMutation.isPending}
      isDeleting={deleteMutation.isPending}
      onCreate={(name, onSuccess) =>
        createMutation.mutate({ name }, { onSuccess })
      }
      onUpdate={(id, name, onSuccess) =>
        updateMutation.mutate({ id, data: { name } }, { onSuccess })
      }
      onDelete={(id, onSuccess) => deleteMutation.mutate(id, { onSuccess })}
    />
  );
}
