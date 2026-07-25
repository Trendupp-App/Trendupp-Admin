"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { FaqItem, CreateFaqDto } from "@/types/adminSettings";

interface AddEditFaqModalProps {
  isOpen: boolean;
  faq: FaqItem | null;
  onClose: () => void;
  onSubmit: (data: CreateFaqDto) => void;
  isSubmitting?: boolean;
}

const CATEGORY_OPTIONS = [
  "Payments",
  "Getting Started",
  "Campaigns",
  "Creators",
  "Brands",
  "Social Impact",
];

function FaqFormInner({
  faq,
  onClose,
  onSubmit,
  isSubmitting = false,
}: Omit<AddEditFaqModalProps, "isOpen">) {
  const [question, setQuestion] = useState(faq?.question || "");
  const [answer, setAnswer] = useState(faq?.answer || "");
  const [category, setCategory] = useState(faq?.category || "Payments");
  const [status, setStatus] = useState(faq?.status || "published");

  const isEditing = !!faq;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    onSubmit({
      question: question.trim(),
      answer: answer.trim(),
      category: category.trim(),
      status: status.toLowerCase(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
      {/* Question Field */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-[#1a1a2e]">Question *</label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. How does escrow work?"
          required
          autoFocus
          className="w-full bg-[#f8f8fa] border border-[#ececf2] rounded-xl px-4 py-3 text-xs text-[#1a1a2e] placeholder:text-[#9a99b0] focus:outline-none focus:border-brand-pink focus:bg-white transition-all"
        />
      </div>

      {/* Answer Field */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-[#1a1a2e]">Answer *</label>
        <textarea
          rows={4}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Provide a clear, helpful answer..."
          required
          className="w-full bg-[#f8f8fa] border border-[#ececf2] rounded-xl p-3.5 text-xs text-[#1a1a2e] placeholder:text-[#9a99b0] focus:outline-none focus:border-brand-pink focus:bg-white transition-all resize-none"
        />
      </div>

      {/* Category and Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[#1a1a2e]">Category *</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-[#f8f8fa] border border-[#ececf2] rounded-xl px-3.5 py-2.5 text-xs text-[#1a1a2e] focus:outline-none focus:border-brand-pink focus:bg-white transition-all cursor-pointer"
          >
            {CATEGORY_OPTIONS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[#1a1a2e]">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-[#f8f8fa] border border-[#ececf2] rounded-xl px-3.5 py-2.5 text-xs text-[#1a1a2e] focus:outline-none focus:border-brand-pink focus:bg-white transition-all cursor-pointer"
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-3 pt-3">
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
          disabled={isSubmitting || !question.trim() || !answer.trim()}
          className="rounded-xl bg-brand-pink hover:bg-brand-pink/90 text-white text-xs font-semibold px-6 py-2.5 disabled:opacity-50"
        >
          {isSubmitting
            ? "Saving..."
            : isEditing
              ? "Save Changes"
              : "+ Add FAQ"}
        </Button>
      </div>
    </form>
  );
}

export default function AddEditFaqModal({
  isOpen,
  faq,
  onClose,
  onSubmit,
  isSubmitting = false,
}: AddEditFaqModalProps) {
  const isEditing = !!faq;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg bg-white rounded-2xl p-6 border-0 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-[#1a1a2e]">
            {isEditing ? "Edit FAQ" : "Add New FAQ"}
          </DialogTitle>
        </DialogHeader>

        {isOpen && (
          <FaqFormInner
            key={faq?.id || "new"}
            faq={faq}
            onClose={onClose}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
