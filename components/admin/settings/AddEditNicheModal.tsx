"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { CreatorNiche } from "@/types/adminSettings";

interface AddEditNicheModalProps {
  isOpen: boolean;
  niche: CreatorNiche | null;
  onClose: () => void;
  onSubmit: (name: string) => void;
  isSubmitting?: boolean;
}

function NicheFormInner({
  niche,
  onClose,
  onSubmit,
  isSubmitting = false,
}: Omit<AddEditNicheModalProps, "isOpen">) {
  const [name, setName] = useState(niche?.name || "");
  const isEditing = !!niche;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit(name.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-2">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-[#1a1a2e]">Niche Name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Cryptocurrency"
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
              : "+ Add Niche"}
        </Button>
      </div>
    </form>
  );
}

export default function AddEditNicheModal({
  isOpen,
  niche,
  onClose,
  onSubmit,
  isSubmitting = false,
}: AddEditNicheModalProps) {
  const isEditing = !!niche;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-white rounded-2xl p-6 border-0 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-[#1a1a2e]">
            {isEditing ? "Edit Niche" : "Add New Niche"}
          </DialogTitle>
        </DialogHeader>

        {isOpen && (
          <NicheFormInner
            key={niche?.id || "new"}
            niche={niche}
            onClose={onClose}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
