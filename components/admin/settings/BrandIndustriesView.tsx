"use client";

import TaxonomyPillsView from "./TaxonomyPillsView";
import {
  useIndustries,
  useCreateIndustry,
  useUpdateIndustry,
  useDeleteIndustry,
} from "@/hooks/useAdminTaxonomies";

export default function BrandIndustriesView() {
  const { data: industries = [], isLoading } = useIndustries();
  const createMutation = useCreateIndustry();
  const updateMutation = useUpdateIndustry();
  const deleteMutation = useDeleteIndustry();

  return (
    <TaxonomyPillsView
      title="Brand Industries"
      subtitle="These are the industry options shown to advertisers during onboarding."
      entityLabel="Industry"
      entityLabelPlural="industries"
      deleteWarning="This action will remove it from advertiser onboarding options."
      items={industries}
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
