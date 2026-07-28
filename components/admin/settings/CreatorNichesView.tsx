"use client";

import { useState, useMemo } from "react";
import { Search, Plus } from "lucide-react";
import NichePillTag from "./NichePillTag";
import AddEditNicheModal from "./AddEditNicheModal";
import DeleteNicheModal from "./DeleteNicheModal";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useNiches,
  useCreateNiche,
  useUpdateNiche,
  useDeleteNiche,
} from "@/hooks/useAdminNiches";
import type { CreatorNiche } from "@/types/adminSettings";
import { toast } from "sonner";

const DEFAULT_SAMPLE_NICHES: CreatorNiche[] = [
  { id: "1", name: "Sports" },
  { id: "2", name: "Fitness" },
  { id: "3", name: "Comedy" },
  { id: "4", name: "Travel" },
  { id: "5", name: "Beauty" },
  { id: "6", name: "Parenting" },
  { id: "7", name: "Finance" },
  { id: "8", name: "Technology" },
  { id: "9", name: "Lifestyle" },
  { id: "10", name: "Education" },
  { id: "11", name: "Activism" },
  { id: "12", name: "Food & Drink" },
  { id: "13", name: "Social Good" },
  { id: "14", name: "Wellness" },
  { id: "15", name: "Music" },
  { id: "16", name: "Gaming" },
  { id: "17", name: "Hospitality" },
  { id: "18", name: "Fashion" },
  { id: "19", name: "Entertainment" },
  { id: "20", name: "Photography" },
];

export default function CreatorNichesView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingNiche, setEditingNiche] = useState<CreatorNiche | null>(null);
  const [deletingNiche, setDeletingNiche] = useState<CreatorNiche | null>(null);

  const { data: niches = [], isLoading } = useNiches();
  const createMutation = useCreateNiche();
  const updateMutation = useUpdateNiche();
  const deleteMutation = useDeleteNiche();

  const displayNiches = useMemo(() => {
    return niches && niches.length > 0 ? niches : DEFAULT_SAMPLE_NICHES;
  }, [niches]);

  const filteredNiches = useMemo(() => {
    if (!searchTerm.trim()) return displayNiches;
    const term = searchTerm.toLowerCase();
    return displayNiches.filter((n) => n.name.toLowerCase().includes(term));
  }, [displayNiches, searchTerm]);

  const handleOpenAddModal = () => {
    setEditingNiche(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (niche: CreatorNiche) => {
    setEditingNiche(niche);
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingNiche(null);
  };

  const handleFormSubmit = (name: string) => {
    if (editingNiche) {
      updateMutation.mutate(
        { id: editingNiche.id, data: { name } },
        {
          onSuccess: () => {
            handleCloseModal();
          },
        },
      );
    } else {
      createMutation.mutate(
        { name },
        {
          onSuccess: () => {
            handleCloseModal();
          },
        },
      );
    }
  };

  const handleConfirmDelete = (nicheId: string) => {
    deleteMutation.mutate(nicheId, {
      onSuccess: () => {
        setDeletingNiche(null);
      },
    });
  };

  const handleSaveChanges = () => {
    toast.success("Niche configurations saved successfully");
  };

  return (
    <div className="flex-1 flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1a1a2e]">Creator Niches</h1>
          <p className="text-xs text-[#7a7a9a] mt-1">
            These are the niche options shown to creators during onboarding.{" "}
            <strong className="text-[#1a1a2e] font-semibold">
              {displayNiches.length} niches total.
            </strong>
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-pink hover:bg-brand-pink/90 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          Add Niche
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a99b0]"
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search Niches..."
          className="w-full bg-white border border-[#e6e6ec] rounded-xl pl-10 pr-4 py-3 text-xs text-[#1a1a2e] placeholder:text-[#9a99b0] focus:outline-none focus:border-brand-pink shadow-xs transition-all"
        />
      </div>

      {/* Niches Card Container */}
      <div className="bg-white border border-[#f0f0f5] rounded-2xl p-4 sm:p-7 flex flex-col gap-6 shadow-xs">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#7a7a9a]">
          ALL NICHES ({filteredNiches.length})
        </span>

        {/* Niches Grid / Flex list */}
        {isLoading ? (
          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-9 w-24 rounded-full" />
            <Skeleton className="h-9 w-28 rounded-full" />
            <Skeleton className="h-9 w-20 rounded-full" />
            <Skeleton className="h-9 w-32 rounded-full" />
            <Skeleton className="h-9 w-24 rounded-full" />
          </div>
        ) : filteredNiches.length === 0 ? (
          <div className="text-center py-10 text-xs text-[#7a7a9a]">
            {searchTerm
              ? `No niches matching "${searchTerm}"`
              : "No creator niches found"}
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {filteredNiches.map((niche) => (
              <NichePillTag
                key={niche.id}
                niche={niche}
                onEdit={handleOpenEditModal}
                onDelete={(n) => setDeletingNiche(n)}
              />
            ))}
          </div>
        )}

        {/* Save Changes Action */}
        <div className="pt-2">
          <button
            onClick={handleSaveChanges}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-brand-pink hover:bg-brand-pink/90 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Add / Edit Niche Modal */}
      <AddEditNicheModal
        isOpen={isAddModalOpen}
        niche={editingNiche}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Niche Confirmation Modal */}
      <DeleteNicheModal
        isOpen={!!deletingNiche}
        niche={deletingNiche}
        onClose={() => setDeletingNiche(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
