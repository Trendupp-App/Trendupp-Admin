"use client";

import { useState, useMemo } from "react";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useNewsCategories,
  useCreateNewsCategory,
  useUpdateNewsCategory,
  useDeleteNewsCategory,
} from "@/hooks/useAdminSettingsExtra";
import type { NewsCategory } from "@/types/adminSettings";
import { toast } from "sonner";

const DEFAULT_SAMPLE_CATEGORIES: NewsCategory[] = [
  { id: "749dc76f-2ae5-4518-b205-80ff3af1e12a", name: "Industry" },
  { id: "cat-2", name: "Platform Update" },
  { id: "cat-3", name: "Advertiser" },
  { id: "cat-4", name: "Creators" },
];

function NewsCategoryFormInner({
  category,
  onClose,
  onSubmit,
  isSubmitting = false,
}: {
  category: NewsCategory | null;
  onClose: () => void;
  onSubmit: (name: string) => void;
  isSubmitting?: boolean;
}) {
  const [name, setName] = useState(category?.name || "");
  const isEditing = !!category;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit(name.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-2">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-[#1a1a2e]">Name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Industry"
          required
          autoFocus
          className="w-full bg-[#f8f8fa] border border-[#ececf2] rounded-xl px-4 py-3 text-xs text-[#1a1a2e] placeholder:text-[#9a99b0] focus:outline-none focus:border-brand-pink focus:bg-white transition-all"
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
          className="rounded-xl border-[#e0e0ea] text-xs font-semibold text-[#1a1a2e] px-5 py-2.5 hover:bg-[#fafafa]"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !name.trim()}
          className="rounded-xl bg-brand-pink hover:bg-brand-pink/90 text-white text-xs font-semibold px-6 py-2.5 disabled:opacity-50"
        >
          {isSubmitting
            ? "Saving..."
            : isEditing
              ? "Save Changes"
              : "+ Add Categories"}
        </Button>
      </div>
    </form>
  );
}

export default function NewsCategoriesView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<NewsCategory | null>(
    null,
  );
  const [deletingCategory, setDeletingCategory] = useState<NewsCategory | null>(
    null,
  );

  const { data: categories = [], isLoading } = useNewsCategories();
  const createMutation = useCreateNewsCategory();
  const updateMutation = useUpdateNewsCategory();
  const deleteMutation = useDeleteNewsCategory();

  const displayCategories = useMemo(() => {
    return categories && categories.length > 0
      ? categories
      : DEFAULT_SAMPLE_CATEGORIES;
  }, [categories]);

  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return displayCategories;
    const term = searchTerm.toLowerCase();
    return displayCategories.filter((c) => c.name.toLowerCase().includes(term));
  }, [displayCategories, searchTerm]);

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (category: NewsCategory) => {
    setEditingCategory(category);
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingCategory(null);
  };

  const handleFormSubmit = (name: string) => {
    if (editingCategory) {
      updateMutation.mutate(
        { id: editingCategory.id, data: { name } },
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

  const handleConfirmDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        setDeletingCategory(null);
      },
    });
  };

  const handleSaveChanges = () => {
    toast.success("News category configurations saved successfully");
  };

  return (
    <div className="flex-1 flex flex-col gap-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1a1a2e]">News categories</h1>
          <p className="text-xs text-[#7a7a9a] mt-1">
            These are the news categories options shown in News page.{" "}
            <strong className="text-[#1a1a2e] font-semibold">
              {displayCategories.length} categories total.
            </strong>
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-pink hover:bg-brand-pink/90 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          Categories
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
          placeholder="Search categories..."
          className="w-full bg-white border border-[#e6e6ec] rounded-xl pl-10 pr-4 py-3 text-xs text-[#1a1a2e] placeholder:text-[#9a99b0] focus:outline-none focus:border-brand-pink shadow-xs transition-all"
        />
      </div>

      {/* Card Container */}
      <div className="bg-white border border-[#f0f0f5] rounded-2xl p-7 flex flex-col gap-6 shadow-xs">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#7a7a9a]">
          ALL CATEGORIES ({filteredCategories.length})
        </span>

        {isLoading ? (
          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-9 w-24 rounded-full" />
            <Skeleton className="h-9 w-32 rounded-full" />
            <Skeleton className="h-9 w-28 rounded-full" />
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-10 text-xs text-[#7a7a9a]">
            {searchTerm
              ? `No news categories matching "${searchTerm}"`
              : "No news categories found"}
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {filteredCategories.map((cat) => (
              <div
                key={cat.id}
                className="bg-[#f8f8fa] border border-[#e8e8f0] px-3.5 py-2 rounded-full text-xs font-semibold text-[#1a1a2e] inline-flex items-center gap-2 transition-all hover:bg-white hover:border-[#d0d0dc] hover:shadow-xs"
              >
                <span>{cat.name}</span>
                <div className="flex items-center gap-1.5 ml-1">
                  <button
                    onClick={() => handleOpenEditModal(cat)}
                    title="Edit category"
                    className="text-[#9a99b0] hover:text-brand-pink transition-colors cursor-pointer"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => setDeletingCategory(cat)}
                    title="Delete category"
                    className="text-[#9a99b0] hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pt-2">
          <button
            onClick={handleSaveChanges}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-brand-pink hover:bg-brand-pink/90 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Dialog
        open={isAddModalOpen}
        onOpenChange={(open) => !open && handleCloseModal()}
      >
        <DialogContent className="max-w-md bg-white rounded-2xl p-6 border-0 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#1a1a2e]">
              {editingCategory ? "Edit Category" : "Add New Categories"}
            </DialogTitle>
          </DialogHeader>

          {isAddModalOpen && (
            <NewsCategoryFormInner
              key={editingCategory?.id || "new"}
              category={editingCategory}
              onClose={handleCloseModal}
              onSubmit={handleFormSubmit}
              isSubmitting={
                createMutation.isPending || updateMutation.isPending
              }
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog
        open={!!deletingCategory}
        onOpenChange={(open) => !open && setDeletingCategory(null)}
      >
        <DialogContent className="max-w-md bg-white rounded-2xl p-6 border-0 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#1a1a2e]">
              Delete Category
            </DialogTitle>
            <DialogDescription className="text-xs text-[#7a7a9a] mt-1.5 leading-relaxed">
              Are you sure you want to delete the news category &ldquo;
              <span className="font-semibold text-[#1a1a2e]">
                {deletingCategory?.name}
              </span>
              &rdquo;?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex items-center justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setDeletingCategory(null)}
              disabled={deleteMutation.isPending}
              className="rounded-xl border-[#e0e0ea] text-xs font-semibold text-[#1a1a2e] px-5 py-2.5 hover:bg-[#fafafa]"
            >
              Cancel
            </Button>
            <Button
              onClick={() =>
                deletingCategory && handleConfirmDelete(deletingCategory.id)
              }
              disabled={deleteMutation.isPending}
              className="rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-5 py-2.5"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
