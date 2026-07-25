"use client";

import { useState, useMemo } from "react";
import { Plus, Search } from "lucide-react";
import FaqAccordionItem from "./FaqAccordionItem";
import AddEditFaqModal from "./AddEditFaqModal";
import DeleteFaqModal from "./DeleteFaqModal";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useFaqs,
  useCreateFaq,
  useUpdateFaq,
  useDeleteFaq,
} from "@/hooks/useAdminFaqs";
import type {
  FaqItem,
  CreateFaqDto,
  FaqQueryParams,
} from "@/types/adminSettings";
import { cn } from "@/lib/utils";

const CORE_CATEGORIES = [
  "All",
  "Getting Started",
  "Payments",
  "Campaigns",
  "Creators",
  "Brands",
  "Social Impact",
];

const DEFAULT_SAMPLE_FAQS: FaqItem[] = [
  {
    id: "bfc98cfd-cfcb-492c-a06e-be36e0bb0f32",
    question: "How does escrow work on Trendupp?",
    answer:
      "Escrow on Trendupp means that campaign funds are held securely by the platform until the creator completes the agreed deliverables. Once both parties confirm completion, funds are released automatically.",
    category: "Payments",
    status: "published",
    sortOrder: 1,
  },
  {
    id: "faq-2",
    question: "How do I apply for a campaign?",
    answer:
      "Creators can browse active commercial and social impact campaigns on the platform and submit applications directly with their portfolio and pitch proposal.",
    category: "Campaigns",
    status: "published",
    sortOrder: 2,
  },
  {
    id: "faq-3",
    question: "When will I receive my payment?",
    answer:
      "Payments are processed immediately upon milestone approval by the advertiser or brand manager and released directly to your registered bank account.",
    category: "Payments",
    status: "published",
    sortOrder: 3,
  },
  {
    id: "faq-4",
    question: "What is a Social Impact campaign?",
    answer:
      "Social Impact campaigns are community-driven initiatives supported by Trendupp to promote social causes, civic awareness, and community empowerment.",
    category: "Social Impact",
    status: "published",
    sortOrder: 4,
  },
  {
    id: "faq-5",
    question: "How is my creator tier determined?",
    answer:
      "Creator tiers are calculated dynamically based on engagement rate, verified reach, total completed campaigns, and overall advertiser review ratings.",
    category: "Creators",
    status: "draft",
    sortOrder: 5,
  },
];

export default function FaqManagementView() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(
    "bfc98cfd-cfcb-492c-a06e-be36e0bb0f32",
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [deletingFaq, setDeletingFaq] = useState<FaqItem | null>(null);

  const queryParams = useMemo(() => {
    const params: FaqQueryParams = {};
    if (activeCategory !== "All") params.category = activeCategory;
    if (statusFilter !== "all") params.status = statusFilter;
    if (searchQuery.trim()) params.search = searchQuery.trim();
    return Object.keys(params).length > 0 ? params : undefined;
  }, [activeCategory, statusFilter, searchQuery]);

  const { data: faqs = [], isLoading } = useFaqs(queryParams);
  const createMutation = useCreateFaq();
  const updateMutation = useUpdateFaq();
  const deleteMutation = useDeleteFaq();

  const displayFaqs = useMemo(() => {
    if (process.env.NODE_ENV === "development" && faqs.length === 0) {
      return DEFAULT_SAMPLE_FAQS;
    }
    return faqs;
  }, [faqs]);

  // Extract all categories dynamically from displayFaqs + core default categories
  const categoriesList = useMemo(() => {
    const customCategories = displayFaqs
      .map((f) => f.category?.trim())
      .filter((cat): cat is string => Boolean(cat));

    const combined = Array.from(
      new Set([...CORE_CATEGORIES, ...customCategories]),
    );
    return combined;
  }, [displayFaqs]);

  // Compute item count for each category filter
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: displayFaqs.length };
    displayFaqs.forEach((faq) => {
      const cat = faq.category?.trim();
      if (!cat) return;
      const matchedKey =
        categoriesList.find((c) => c.toLowerCase() === cat.toLowerCase()) ||
        cat;
      counts[matchedKey] = (counts[matchedKey] || 0) + 1;
    });
    return counts;
  }, [displayFaqs, categoriesList]);

  const filteredFaqs = useMemo(() => {
    return displayFaqs.filter((f) => {
      const matchCategory =
        activeCategory === "All" ||
        f.category.toLowerCase() === activeCategory.toLowerCase();
      const matchStatus =
        statusFilter === "all" ||
        (f.status || "published").toLowerCase() === statusFilter.toLowerCase();
      const term = searchQuery.toLowerCase().trim();
      const matchSearch =
        !term ||
        f.question.toLowerCase().includes(term) ||
        f.answer.toLowerCase().includes(term);

      return matchCategory && matchStatus && matchSearch;
    });
  }, [displayFaqs, activeCategory, statusFilter, searchQuery]);

  const handleToggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleOpenAddModal = () => {
    setEditingFaq(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (faq: FaqItem) => {
    setEditingFaq(faq);
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingFaq(null);
  };

  const handleFormSubmit = (formData: CreateFaqDto) => {
    if (editingFaq) {
      updateMutation.mutate(
        { id: editingFaq.id, data: formData },
        {
          onSuccess: () => {
            handleCloseModal();
          },
        },
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => {
          handleCloseModal();
        },
      });
    }
  };

  const handleConfirmDelete = (faqId: string) => {
    deleteMutation.mutate(faqId, {
      onSuccess: () => {
        setDeletingFaq(null);
      },
    });
  };

  return (
    <div className="flex-1 flex flex-col gap-6">
      {/* Top Header & Add Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#1a1a2e]">FAQ Management</h1>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-pink hover:bg-brand-pink/90 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
        >
          <Plus size={16} />
          Add FAQ
        </button>
      </div>

      {/* Category Pills Bar & Status / Search Filter Row */}
      <div className="flex flex-col gap-4">
        {/* Category Pills with Dynamic Counts */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-hide">
          {categoriesList.map((category) => {
            const isActive =
              activeCategory.toLowerCase() === category.toLowerCase();
            const count = categoryCounts[category] ?? 0;
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "px-3.5 py-2 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-2",
                  isActive
                    ? "bg-brand-pink text-white shadow-xs"
                    : "bg-white border border-[#e8e8f0] text-[#6b6b80] hover:bg-[#f8f8fa] hover:text-[#1a1a2e]",
                )}
              >
                <span>{category}</span>
                <span
                  className={cn(
                    "text-[10px] font-extrabold px-1.5 py-0.5 rounded-full transition-colors",
                    isActive
                      ? "bg-white/25 text-white"
                      : "bg-[#f0f0f5] text-[#7a7a9a]",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Status Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a99b0]"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search FAQs (e.g. escrow)..."
              className="w-full bg-white border border-[#e6e6ec] rounded-xl pl-9 pr-3.5 py-2 text-xs text-[#1a1a2e] placeholder:text-[#9a99b0] focus:outline-none focus:border-brand-pink shadow-xs transition-all"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-[#e6e6ec] rounded-xl px-3.5 py-2 text-xs text-[#1a1a2e] focus:outline-none focus:border-brand-pink shadow-xs transition-all cursor-pointer shrink-0"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* FAQ Accordion List */}
      <div className="flex flex-col gap-3.5">
        {isLoading ? (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="bg-white border border-[#f0f0f5] rounded-2xl p-10 text-center text-xs text-[#7a7a9a]">
            No FAQs found matching your criteria.
          </div>
        ) : (
          filteredFaqs.map((faq) => (
            <FaqAccordionItem
              key={faq.id}
              faq={faq}
              isExpanded={expandedId === faq.id}
              onToggleExpand={() => handleToggleExpand(faq.id)}
              onEdit={handleOpenEditModal}
              onDelete={(f) => setDeletingFaq(f)}
            />
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      <AddEditFaqModal
        isOpen={isAddModalOpen}
        faq={editingFaq}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Modal */}
      <DeleteFaqModal
        isOpen={!!deletingFaq}
        faq={deletingFaq}
        onClose={() => setDeletingFaq(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
