"use client";

import { useState, useMemo } from "react";
import { Search, Plus } from "lucide-react";
import NichePillTag from "./NichePillTag";
import AddEditNicheModal from "./AddEditNicheModal";
import DeleteNicheModal from "./DeleteNicheModal";
import { Skeleton } from "@/components/ui/skeleton";
import type { CreatorNiche } from "@/types/adminSettings";

export interface TaxonomyPillsViewProps {
  /** Page heading, e.g. "Brand Industries" */
  title: string;
  /** Subtitle sentence explaining where the values are used */
  subtitle: string;
  /** Singular noun used in buttons/modals, e.g. "Industry" */
  entityLabel: string;
  /** Plural noun, e.g. "industries" */
  entityLabelPlural: string;
  /** Consequence sentence in the delete confirmation */
  deleteWarning: string;
  items: CreatorNiche[];
  isLoading: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  onCreate: (name: string, onSuccess: () => void) => void;
  onUpdate: (id: string, name: string, onSuccess: () => void) => void;
  onDelete: (id: string, onSuccess: () => void) => void;
}

/**
 * Generic name-pill CRUD view (search, add/edit/delete modals) — the Creator
 * Niches UI, reused for Brand Industries and Ticket Categories.
 */
export default function TaxonomyPillsView({
  title,
  subtitle,
  entityLabel,
  entityLabelPlural,
  deleteWarning,
  items,
  isLoading,
  isSaving,
  isDeleting,
  onCreate,
  onUpdate,
  onDelete,
}: TaxonomyPillsViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CreatorNiche | null>(null);
  const [deletingItem, setDeletingItem] = useState<CreatorNiche | null>(null);

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return items;
    const term = searchTerm.toLowerCase();
    return items.filter((n) => n.name.toLowerCase().includes(term));
  }, [items, searchTerm]);

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingItem(null);
  };

  const handleFormSubmit = (name: string) => {
    if (editingItem) {
      onUpdate(editingItem.id, name, handleCloseModal);
    } else {
      onCreate(name, handleCloseModal);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1a1a2e]">{title}</h1>
          <p className="text-xs text-[#7a7a9a] mt-1">
            {subtitle}{" "}
            <strong className="text-[#1a1a2e] font-semibold">
              {items.length} {entityLabelPlural} total.
            </strong>
          </p>
        </div>

        <button
          onClick={() => {
            setEditingItem(null);
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-pink hover:bg-brand-pink/90 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          Add {entityLabel}
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
          placeholder={`Search ${entityLabelPlural}...`}
          className="w-full bg-white border border-[#e6e6ec] rounded-xl pl-10 pr-4 py-3 text-xs text-[#1a1a2e] placeholder:text-[#9a99b0] focus:outline-none focus:border-brand-pink shadow-xs transition-all"
        />
      </div>

      {/* Pills Card Container */}
      <div className="bg-white border border-[#f0f0f5] rounded-2xl p-7 flex flex-col gap-6 shadow-xs">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#7a7a9a]">
          ALL {entityLabelPlural.toUpperCase()} ({filteredItems.length})
        </span>

        {isLoading ? (
          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-9 w-24 rounded-full" />
            <Skeleton className="h-9 w-28 rounded-full" />
            <Skeleton className="h-9 w-20 rounded-full" />
            <Skeleton className="h-9 w-32 rounded-full" />
            <Skeleton className="h-9 w-24 rounded-full" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-10 text-xs text-[#7a7a9a]">
            {searchTerm
              ? `No ${entityLabelPlural} matching "${searchTerm}"`
              : `No ${entityLabelPlural} found`}
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {filteredItems.map((item) => (
              <NichePillTag
                key={item.id}
                niche={item}
                onEdit={(n) => {
                  setEditingItem(n);
                  setIsAddModalOpen(true);
                }}
                onDelete={(n) => setDeletingItem(n)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <AddEditNicheModal
        isOpen={isAddModalOpen}
        niche={editingItem}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        isSubmitting={isSaving}
        entityLabel={entityLabel}
      />

      {/* Delete Confirmation Modal */}
      <DeleteNicheModal
        isOpen={!!deletingItem}
        niche={deletingItem}
        onClose={() => setDeletingItem(null)}
        onConfirm={(id) => onDelete(id, () => setDeletingItem(null))}
        isDeleting={isDeleting}
        entityLabel={entityLabel}
        warning={deleteWarning}
      />
    </div>
  );
}
