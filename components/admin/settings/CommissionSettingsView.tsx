"use client";

import { useState } from "react";
import CommissionTierList from "./CommissionTierList";
import CommissionTierForm from "./CommissionTierForm";
import DeleteCommissionTierModal from "./DeleteCommissionTierModal";
import {
  useCommissionTiers,
  useCreateCommissionTier,
  useUpdateCommissionTier,
  useDeleteCommissionTier,
} from "@/hooks/useAdminCommissions";
import type {
  CommissionTier,
  CreateCommissionTierDto,
} from "@/types/adminSettings";

type ViewMode = "list" | "create" | "edit";

export default function CommissionSettingsView() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedTier, setSelectedTier] = useState<CommissionTier | null>(null);
  const [tierToDelete, setTierToDelete] = useState<CommissionTier | null>(null);

  const { data: tiers = [], isLoading } = useCommissionTiers();

  const createMutation = useCreateCommissionTier();
  const updateMutation = useUpdateCommissionTier();
  const deleteMutation = useDeleteCommissionTier();

  const handleAddTier = () => {
    setSelectedTier(null);
    setViewMode("create");
  };

  const handleEditTier = (tier: CommissionTier) => {
    setSelectedTier(tier);
    setViewMode("edit");
  };

  const handleDeletePrompt = (tier: CommissionTier) => {
    setTierToDelete(tier);
  };

  const handleConfirmDelete = (tierId: string) => {
    deleteMutation.mutate(tierId, {
      onSuccess: () => {
        setTierToDelete(null);
      },
    });
  };

  const handleFormSubmit = (formData: CreateCommissionTierDto) => {
    if (viewMode === "edit" && selectedTier?.id) {
      updateMutation.mutate(
        { id: selectedTier.id, data: formData },
        {
          onSuccess: () => {
            setViewMode("list");
            setSelectedTier(null);
          },
        },
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => {
          setViewMode("list");
          setSelectedTier(null);
        },
      });
    }
  };

  const handleCancelForm = () => {
    setViewMode("list");
    setSelectedTier(null);
  };

  const defaultTier = tiers.find((t) => t.isDefault);
  const defaultRate = defaultTier?.ratePercentage || 15;

  return (
    <div className="flex-1 flex flex-col gap-6">
      {/* Title */}
      <h1 className="text-xl font-bold text-[#1a1a2e]">Platform Commission</h1>

      {/* Content depending on viewMode */}
      {viewMode === "list" ? (
        <CommissionTierList
          tiers={tiers}
          isLoading={isLoading}
          onAddTier={handleAddTier}
          onEditTier={handleEditTier}
          onDeleteTier={handleDeletePrompt}
        />
      ) : (
        <CommissionTierForm
          initialData={selectedTier}
          defaultRate={defaultRate}
          onCancel={handleCancelForm}
          onSubmit={handleFormSubmit}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteCommissionTierModal
        isOpen={!!tierToDelete}
        tier={tierToDelete}
        onClose={() => setTierToDelete(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
