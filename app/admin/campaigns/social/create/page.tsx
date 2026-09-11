"use client";
/* eslint-disable @next/next/no-img-element */

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Trash2,
  Check,
  ArrowRight,
  Search,
  X,
  UploadCloud,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useAdminBrandsList } from "@/hooks/useAdminBrands";
import {
  useCreateSocialImpactCampaign,
  useUpdateSocialImpactCampaign,
  usePublishSocialImpactCampaign,
  useAdminSocialImpactDetails,
} from "@/hooks/useAdminSocialImpact";
import type {
  CreateSocialImpactCampaignDto,
  UpdateSocialImpactCampaignDto,
} from "@/types/adminSocialImpact";

interface BrandOption {
  id: string;
  name: string;
  rate: string;
  logoColor: string;
  logoText: string;
}

const MOCK_ADVERTISERS: BrandOption[] = [
  {
    id: "coca-cola",
    name: "Coca-Cola",
    rate: "15%",
    logoColor: "bg-[#e11d48]",
    logoText: "Coca",
  },
  {
    id: "apple",
    name: "Apple Inc.",
    rate: "12% (Custom)",
    logoColor: "bg-[#1f2937]",
    logoText: "Apple",
  },
  {
    id: "pepsico",
    name: "PepsiCo",
    rate: "15%",
    logoColor: "bg-[#1d4ed8]",
    logoText: "Pepsi",
  },
];

export default function CreateCampaignPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const draftIdParam = searchParams.get("draftId");

  const [editingDraftId, setEditingDraftId] = useState<string | null>(
    draftIdParam,
  );
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: brandsData } = useAdminBrandsList({ limit: 50 });
  const { data: existingDraft } = useAdminSocialImpactDetails(
    editingDraftId || "",
    Boolean(editingDraftId),
  );

  const createCampaignMutation = useCreateSocialImpactCampaign();
  const updateCampaignMutation = useUpdateSocialImpactCampaign();
  const publishCampaignMutation = usePublishSocialImpactCampaign();

  // Step 1 state
  const [preview, setPreview] = useState<string>("");
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);

  // preview is a local blob: URL while a new file is staged (never sent to
  // the server — only the File itself is); release it when replaced/unmounted.
  useEffect(() => {
    return () => {
      if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const [title, setTitle] = useState("");
  const [goal, setGoal] = useState("Amplify Content");
  const [contentLink, setContentLink] = useState("");
  const [selectedTiers, setSelectedTiers] = useState<string[]>([
    "Nano",
    "Micro",
  ]);
  const tier = selectedTiers.join(", ");

  const handleToggleTier = (t: string) => {
    setSelectedTiers((prev) => {
      if (prev.includes(t)) {
        if (prev.length === 1) return prev;
        return prev.filter((item) => item !== t);
      }
      return [...prev, t];
    });
  };
  const [selectedAdvertisers, setSelectedAdvertisers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdvertiserDropdownOpen, setIsAdvertiserDropdownOpen] =
    useState(false);
  const advertiserDropdownRef = useRef<HTMLDivElement>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    "Instagram",
  ]);
  const platform = selectedPlatforms.join(", ");
  const [isPlatformDropdownOpen, setIsPlatformDropdownOpen] = useState(false);
  const platformDropdownRef = useRef<HTMLDivElement>(null);
  const [isTierDropdownOpen, setIsTierDropdownOpen] = useState(false);
  const tierDropdownRef = useRef<HTMLDivElement>(null);

  const handleTogglePlatform = (p: string) => {
    setSelectedPlatforms((prev) => {
      if (prev.includes(p)) {
        if (prev.length === 1) return prev;
        return prev.filter((item) => item !== p);
      }
      return [...prev, p];
    });
  };

  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        advertiserDropdownRef.current &&
        !advertiserDropdownRef.current.contains(e.target as Node)
      ) {
        setIsAdvertiserDropdownOpen(false);
      }
      if (
        platformDropdownRef.current &&
        !platformDropdownRef.current.contains(e.target as Node)
      ) {
        setIsPlatformDropdownOpen(false);
      }
      if (
        tierDropdownRef.current &&
        !tierDropdownRef.current.contains(e.target as Node)
      ) {
        setIsTierDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Step 2 state
  const [desc, setDesc] = useState("");
  const [deliverables, setDeliverables] = useState<string[]>([""]);
  const [directions, setDirections] = useState<string[]>([""]);
  const [dos, setDos] = useState<string[]>([""]);
  const [donts, setDonts] = useState<string[]>([""]);

  const liveBrands: BrandOption[] =
    brandsData?.data && Array.isArray(brandsData.data)
      ? brandsData.data.map((b) => {
          const name = b.brandName || b.advertiser?.brandName || "Brand";
          return {
            id: b.id,
            name,
            rate: b.industry || "General",
            logoColor: "bg-brand-pink",
            logoText: name.slice(0, 4),
          };
        })
      : MOCK_ADVERTISERS;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    // /admin/social-impact now accepts multipart/form-data, so the actual
    // File is sent as coverImage and the server returns a real hosted URL.
    // The blob: URL here is only a local preview and is never submitted.
    setCoverImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const filteredAdvertisers = liveBrands.filter((adv) =>
    adv.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const selectedBrandObjs = liveBrands.filter((a) =>
    selectedAdvertisers.includes(a.id),
  );
  const activeAdvertiserNames =
    selectedBrandObjs.length > 0
      ? selectedBrandObjs.map((b) => b.name).join(", ")
      : liveBrands[0]?.name || "All Advertisers";

  const handleAddDeliverable = () => setDeliverables([...deliverables, ""]);
  const handleRemoveDeliverable = (index: number) =>
    setDeliverables(deliverables.filter((_, i) => i !== index));

  const handleAddDirection = () => setDirections([...directions, ""]);
  const handleRemoveDirection = (index: number) =>
    setDirections(directions.filter((_, i) => i !== index));

  const handleAddDo = () => setDos([...dos, ""]);
  const handleRemoveDo = (index: number) =>
    setDos(dos.filter((_, i) => i !== index));

  const handleAddDont = () => setDonts([...donts, ""]);
  const handleRemoveDont = (index: number) =>
    setDonts(donts.filter((_, i) => i !== index));

  const handleBack = () => {
    if (step === 1) {
      router.push("/admin/campaigns/social");
    } else {
      setStep((step - 1) as 1 | 2 | 3);
    }
  };

  const [isRestored, setIsRestored] = useState(false);

  // Local draft cache helper to guarantee 100% data retention even for non-DTO fields
  const saveLocalDraftCache = (targetId: string) => {
    try {
      const cacheObj = {
        title,
        goal,
        selectedAdvertisers,
        tier,
        // blob: URLs only resolve in this tab's memory — don't cache a dead
        // reference that would render broken after a reload.
        preview: preview.startsWith("http") ? preview : "",
        desc,
        deliverables,
        directions,
        dos,
        donts,
        contentLink,
        platform,
        endDate,
        step,
      };
      localStorage.setItem(
        `trendupp_draft_${targetId}`,
        JSON.stringify(cacheObj),
      );
    } catch {
      // LocalStorage access ignore
    }
  };

  // Continuous Auto-Sync effect to preserve working selections in localStorage
  // Only syncs AFTER initial restoration is complete to prevent overwriting saved data on mount
  useEffect(() => {
    if (!isRestored) return;
    const key = `trendupp_draft_${editingDraftId || "new"}`;
    try {
      const cacheObj = {
        title,
        goal,
        selectedAdvertisers,
        tier,
        // blob: URLs only resolve in this tab's memory — don't cache a dead
        // reference that would render broken after a reload.
        preview: preview.startsWith("http") ? preview : "",
        desc,
        deliverables,
        directions,
        dos,
        donts,
        contentLink,
        platform,
        endDate,
        step,
      };
      localStorage.setItem(key, JSON.stringify(cacheObj));
    } catch {
      // Ignore quota errors
    }
  }, [
    isRestored,
    editingDraftId,
    title,
    goal,
    selectedAdvertisers,
    tier,
    preview,
    desc,
    deliverables,
    directions,
    dos,
    donts,
    contentLink,
    platform,
    endDate,
    step,
  ]);

  useEffect(() => {
    queueMicrotask(() => {
      let restoredLocalBrands = false;
      const draftKey = `trendupp_draft_${editingDraftId || "new"}`;
      try {
        const cachedRaw = localStorage.getItem(draftKey);
        if (cachedRaw) {
          const cached = JSON.parse(cachedRaw);
          if (cached.title) setTitle(cached.title);
          if (cached.goal) setGoal(cached.goal);
          if (
            Array.isArray(cached.selectedAdvertisers) &&
            cached.selectedAdvertisers.length > 0
          ) {
            setSelectedAdvertisers(cached.selectedAdvertisers);
            restoredLocalBrands = true;
          } else if (cached.selectedAdvertiser) {
            setSelectedAdvertisers([cached.selectedAdvertiser]);
            restoredLocalBrands = true;
          }
          if (
            Array.isArray(cached.selectedTiers) &&
            cached.selectedTiers.length > 0
          ) {
            setSelectedTiers(cached.selectedTiers);
          } else if (cached.tier) {
            const parsed = String(cached.tier)
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);
            if (parsed.length > 0) setSelectedTiers(parsed);
          }
          if (cached.preview) setPreview(cached.preview);
          if (cached.desc) setDesc(cached.desc);
          if (cached.deliverables) setDeliverables(cached.deliverables);
          if (cached.directions) setDirections(cached.directions);
          if (cached.dos) setDos(cached.dos);
          if (cached.donts) setDonts(cached.donts);
          if (cached.contentLink) setContentLink(cached.contentLink);
          if (
            Array.isArray(cached.selectedPlatforms) &&
            cached.selectedPlatforms.length > 0
          ) {
            setSelectedPlatforms(cached.selectedPlatforms);
          } else if (cached.platform) {
            const parsed = String(cached.platform)
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);
            if (parsed.length > 0) setSelectedPlatforms(parsed);
          }
          if (cached.endDate) setEndDate(cached.endDate);
          if (cached.step) setStep(cached.step);
        }
      } catch {
        // Ignore parse errors
      }

      // Merge/override with server payload if existingDraft returns
      if (existingDraft) {
        const anyDraft = existingDraft as unknown as {
          id?: string;
          title?: string;
          goal?: string;
          brandId?: string;
          brandName?: string;
          brandIds?: string[];
          brands?: Array<{ id?: string; name?: string; brandName?: string }>;
          brand?: { id?: string; name?: string; brandName?: string };
          creatorTiers?: string[];
          // GET /admin/social-impact/{id} nests these under `info`, unlike the
          // flat shape the PATCH payload uses.
          info?: {
            goal?: string;
            niche?: string;
            creatorTiers?: string[];
            preferredPlatforms?: string[];
            endDate?: string;
          };
          coverImageUrl?: string;
          coverImage?: string;
          image?: string;
          campaignBrief?: string;
          brief?: string;
          deliverables?: string[];
          contentDirection?: string[];
          dos?: string[];
          donts?: string[];
          guidelines?: { dos?: string[]; donts?: string[] };
          contentLink?: string;
          link?: string;
          platforms?: string | string[];
          platform?: string;
          preferredPlatforms?: string[];
          deadline?: string;
          endDate?: string;
          currentStep?: number;
        };

        if (anyDraft.title) setTitle(anyDraft.title);
        const goalVal = anyDraft.goal || anyDraft.info?.goal;
        if (goalVal) setGoal(goalVal);

        // Extract server brand IDs
        const serverBrandIds =
          anyDraft.brandIds ||
          (Array.isArray(anyDraft.brands)
            ? anyDraft.brands.map((b) => b.id || "").filter(Boolean)
            : []);
        const bId = anyDraft.brandId || anyDraft.brand?.id;

        if (!restoredLocalBrands) {
          if (serverBrandIds.length > 0) {
            setSelectedAdvertisers(serverBrandIds);
          } else if (bId) {
            setSelectedAdvertisers([bId]);
          }
        }

        const tiersVal = anyDraft.creatorTiers?.length
          ? anyDraft.creatorTiers
          : anyDraft.info?.creatorTiers;
        if (tiersVal && tiersVal.length > 0) {
          setSelectedTiers(tiersVal);
        }

        const img =
          anyDraft.coverImageUrl || anyDraft.coverImage || anyDraft.image;
        if (img) setPreview(img);

        const linkVal = anyDraft.contentLink || anyDraft.link;
        if (linkVal) setContentLink(linkVal);

        const platformVal =
          anyDraft.info?.preferredPlatforms ||
          anyDraft.preferredPlatforms ||
          anyDraft.platforms ||
          anyDraft.platform;
        if (platformVal) {
          const parsed = (
            Array.isArray(platformVal)
              ? platformVal
              : String(platformVal).split(",")
          )
            .map((s) => String(s).trim())
            .filter(Boolean);
          if (parsed.length > 0) setSelectedPlatforms(parsed);
        }

        const dateVal =
          anyDraft.deadline || anyDraft.endDate || anyDraft.info?.endDate;
        // <input type="date"> only accepts YYYY-MM-DD; an ISO timestamp
        // renders as an empty field.
        if (dateVal) setEndDate(String(dateVal).slice(0, 10));

        const briefVal = anyDraft.campaignBrief || anyDraft.brief;
        if (briefVal) setDesc(briefVal);

        if (anyDraft.deliverables && anyDraft.deliverables.length > 0) {
          setDeliverables(anyDraft.deliverables);
        }
        if (anyDraft.contentDirection && anyDraft.contentDirection.length > 0) {
          setDirections(anyDraft.contentDirection);
        }

        const extractedDos = anyDraft.dos || anyDraft.guidelines?.dos || [];
        const extractedDonts =
          anyDraft.donts || anyDraft.guidelines?.donts || [];

        if (extractedDos.length > 0) setDos(extractedDos);
        if (extractedDonts.length > 0) setDonts(extractedDonts);

        if (anyDraft.currentStep) {
          setStep(Math.min(Math.max(anyDraft.currentStep, 1), 3) as 1 | 2 | 3);
        }
      }

      setIsRestored(true);
    });
  }, [editingDraftId, existingDraft]);

  // Clean POST payload (omits contentLink, platforms, deadline per NestJS DTO whitelist)
  const firstRealBrandId =
    brandsData?.data &&
    Array.isArray(brandsData.data) &&
    brandsData.data.length > 0
      ? brandsData.data[0].id
      : "";

  const activeBrandId =
    selectedAdvertisers.find((id) => id && id.length > 20) || firstRealBrandId;

  const buildPayload = (isDraft: boolean): CreateSocialImpactCampaignDto => {
    return {
      title: title || "Untitled Campaign Draft",
      goal: goal || "Amplify Content",
      brandId: activeBrandId || "2be03919-825f-430f-8e30-aa4cea473c7d",
      creatorTiers: tier
        ? tier
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : ["Micro", "Nano"],
      coverImage: coverImageFile || undefined,
      coverImageUrl:
        !coverImageFile && preview.startsWith("http") ? preview : undefined,
      campaignBrief: desc || undefined,
      deliverables: deliverables.filter(Boolean),
      contentDirection: directions.filter(Boolean),
      dos: dos.filter(Boolean),
      donts: donts.filter(Boolean),
      currentStep: step,
      isDraft,
    };
  };

  // Clean PATCH payload (omits isDraft, contentLink, platforms, deadline per NestJS DTO whitelist)
  const buildUpdatePayload = (): UpdateSocialImpactCampaignDto => {
    return {
      title: title || "Untitled Campaign Draft",
      goal: goal || "Amplify Content",
      brandId: activeBrandId || undefined,
      creatorTiers: tier
        ? tier
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : ["Micro", "Nano"],
      coverImage: coverImageFile || undefined,
      coverImageUrl:
        !coverImageFile && preview.startsWith("http") ? preview : undefined,
      campaignBrief: desc || undefined,
      deliverables: deliverables.filter(Boolean),
      contentDirection: directions.filter(Boolean),
      dos: dos.filter(Boolean),
      donts: donts.filter(Boolean),
      currentStep: step,
    };
  };

  const handleSaveAsDraft = async () => {
    try {
      if (editingDraftId) {
        // Repeated draft saving on existing draft (PATCH)
        await updateCampaignMutation.mutateAsync({
          id: editingDraftId,
          payload: buildUpdatePayload(),
        });
        saveLocalDraftCache(editingDraftId);
      } else {
        // Initial draft creation (POST)
        const res = await createCampaignMutation.mutateAsync(
          buildPayload(true),
        );
        const newDraftId = res.data?.id;
        if (newDraftId) {
          setEditingDraftId(newDraftId);
          saveLocalDraftCache(newDraftId);
          window.history.replaceState(null, "", `?draftId=${newDraftId}`);
        }
      }
    } catch {
      // Toast handled by mutation
    }
  };

  const handleContinue = async () => {
    if (step < 3) {
      setStep((step + 1) as 1 | 2 | 3);
    } else {
      try {
        let finalCampaignId = editingDraftId;
        if (editingDraftId) {
          await updateCampaignMutation.mutateAsync({
            id: editingDraftId,
            payload: buildUpdatePayload(),
          });
        } else {
          const res = await createCampaignMutation.mutateAsync(
            buildPayload(false),
          );
          finalCampaignId = res.data?.id || null;
        }

        if (finalCampaignId) {
          await publishCampaignMutation.mutateAsync(finalCampaignId);
        }
        // Clear localStorage draft cache so re-opening /create starts fresh
        try {
          if (finalCampaignId)
            localStorage.removeItem(`trendupp_draft_${finalCampaignId}`);
          localStorage.removeItem(`trendupp_draft_new`);
        } catch {
          /* ignore */
        }
        router.push("/admin/campaigns/social");
      } catch {
        // Toast handled by mutation
      }
    }
  };

  return (
    <div className="min-h-full bg-[#faf9fc] p-6 md:p-8 flex flex-col items-center gap-6">
      {/* Top Back Action */}
      <div className="w-full max-w-[720px] flex justify-start">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-xs font-bold text-[#5a5a7a] hover:text-[#1a1a2e] transition-colors cursor-pointer select-none"
        >
          <ArrowLeft size={14} /> Back
        </button>
      </div>

      {/* Main Container Card */}
      <div className="w-full max-w-[720px] flex flex-col text-left">
        {/* Header */}
        <div className="py-4 flex flex-col gap-1">
          <h2 className="text-xl font-bold text-[#1a1a2e]">Create Campaign</h2>
          <p className="text-xs text-[#7a7a9a] font-medium">
            Fill in each section — you can save as draft and return anytime.
          </p>
        </div>

        {/* Stepper Bar */}
        <div className="py-4 flex items-center gap-4 text-xs font-semibold text-[#9a99b0]">
          {/* Step 1 */}
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all",
                step > 1
                  ? "bg-[#16a34a] text-white"
                  : step === 1
                    ? "bg-brand-pink text-white"
                    : "bg-[#e8e6f0] text-[#7a7a9a]",
              )}
            >
              {step > 1 ? <Check size={10} className="stroke-[3]" /> : "1"}
            </span>
            <span
              className={cn(
                step === 1
                  ? "text-brand-pink font-bold"
                  : step > 1
                    ? "text-[#1a1a2e]"
                    : "",
              )}
            >
              Details
            </span>
          </div>

          <div className="h-0.5 w-12 bg-[#e8e6f0]" />

          {/* Step 2 */}
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all",
                step > 2
                  ? "bg-[#16a34a] text-white"
                  : step === 2
                    ? "bg-brand-pink text-white"
                    : "bg-[#e8e6f0] text-[#7a7a9a]",
              )}
            >
              {step > 2 ? <Check size={10} className="stroke-[3]" /> : "2"}
            </span>
            <span
              className={cn(
                step === 2
                  ? "text-brand-pink font-bold"
                  : step > 2
                    ? "text-[#1a1a2e]"
                    : "",
              )}
            >
              Campaign brief
            </span>
          </div>

          <div className="h-0.5 w-12 bg-[#e8e6f0]" />

          {/* Step 3 */}
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all",
                step === 3
                  ? "bg-brand-pink text-white"
                  : "bg-[#e8e6f0] text-[#7a7a9a]",
              )}
            >
              3
            </span>
            <span className={cn(step === 3 ? "text-brand-pink font-bold" : "")}>
              Review
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="py-6 flex flex-col gap-6">
          {/* Cover image container */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative h-48 bg-[#f4f3f6] border-2 border-dashed border-[#e8e6f0] hover:border-brand-pink/50 rounded-[24px] overflow-hidden flex flex-col items-center justify-center gap-2 group cursor-pointer transition-colors"
          >
            {preview ? (
              <>
                <img
                  src={preview}
                  alt="Campaign Cover"
                  onError={() => setPreview("")}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-black/20" />
                <button className="px-4 py-2 rounded-xl bg-white text-[10px] font-bold text-[#1a1a2e] hover:bg-white/95 transition-colors cursor-pointer shadow-sm relative z-10 select-none">
                  Change photo
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 text-[#7a7a9a]">
                <div className="w-10 h-10 rounded-full bg-white border border-[#e8e6f0] flex items-center justify-center text-[#5a5a7a] shadow-xs group-hover:scale-105 transition-transform">
                  <UploadCloud size={18} className="text-brand-pink" />
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-xs font-bold text-[#1a1a2e]">
                    Upload cover photo
                  </span>
                  <span className="text-[10px] text-[#9a99b0] font-medium">
                    PNG or JPG (recommended 1200x400)
                  </span>
                </div>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg"
            className="hidden"
            onChange={handleImageChange}
          />

          {/* STEP 1: Details */}
          {step === 1 && (
            <div className="flex flex-col gap-5 text-xs font-semibold text-[#1a1a2e]">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#7a7a9a]">
                  Campaign title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-10 w-full bg-white border border-[#e8e6f0] rounded-xl px-4 text-xs focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-medium"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#7a7a9a]">
                  Campaign goal
                </label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="h-10 w-full bg-white border border-[#e8e6f0] rounded-xl px-4 text-xs focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-medium cursor-pointer"
                >
                  <option value="Amplify Content">Amplify Content</option>
                  <option value="Create Content">Create Content</option>
                  <option value="Brand Awareness">Brand Awareness</option>
                </select>
              </div>

              {/* Content Link Input - Only shown for Amplify Content */}
              {goal === "Amplify Content" && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#7a7a9a]">
                    Content Link
                  </label>
                  <input
                    type="text"
                    placeholder="enter the content link"
                    value={contentLink}
                    onChange={(e) => setContentLink(e.target.value)}
                    className="h-10 w-full bg-white border border-[#e8e6f0] rounded-xl px-4 text-xs focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-medium placeholder:text-[#c4c2d4]"
                  />
                </div>
              )}

              {/* Creator Tier — Custom Dropdown */}
              <div
                className="flex flex-col gap-1.5 relative"
                ref={tierDropdownRef}
              >
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#7a7a9a]">
                    Creator tier <span className="text-brand-pink">*</span>
                  </label>
                  {selectedTiers.length > 0 && (
                    <span className="text-[10px] text-brand-pink font-bold">
                      {selectedTiers.length} selected
                    </span>
                  )}
                </div>

                {/* Trigger */}
                <button
                  type="button"
                  aria-haspopup="listbox"
                  aria-expanded={isTierDropdownOpen}
                  aria-controls="creator-tier-options"
                  onClick={() => setIsTierDropdownOpen((p) => !p)}
                  className="h-10 w-full bg-white border border-[#e8e6f0] rounded-xl px-4 text-xs font-medium text-[#1a1a2e] flex items-center justify-between focus:outline-none focus:ring-1 focus:ring-brand-pink/30 cursor-pointer select-none"
                >
                  <span
                    className={cn(
                      selectedTiers.length === 0
                        ? "text-[#c4c2d4]"
                        : "font-bold text-[#1a1a2e]",
                    )}
                  >
                    {selectedTiers.length === 0
                      ? "Select tier"
                      : selectedTiers.join(", ")}
                  </span>
                  <ChevronDown
                    size={16}
                    className={cn(
                      "text-[#7a7a9a] transition-transform duration-200",
                      isTierDropdownOpen && "rotate-180 text-brand-pink",
                    )}
                  />
                </button>

                {/* Dropdown Panel */}
                {isTierDropdownOpen && (
                  <div
                    id="creator-tier-options"
                    role="listbox"
                    className="absolute top-full left-0 right-0 z-30 mt-1 bg-white border border-[#e8e6f0] rounded-2xl overflow-hidden shadow-xl"
                  >
                    {(
                      [
                        { t: "Nano", range: "1K-10K", min: "Minimum $50" },
                        { t: "Micro", range: "10K-200K", min: "Minimum $150" },
                        { t: "Macro", range: "200K-1M", min: "Minimum $400" },
                        { t: "Mega", range: "1M+", min: "Minimum $2,000" },
                      ] as { t: string; range: string; min: string }[]
                    ).map(({ t, range, min }) => {
                      const isSelected = selectedTiers.includes(t);
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => handleToggleTier(t)}
                          className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-[#faf9fc] transition-colors text-left border-b border-[#f4f3f6] last:border-0 cursor-pointer"
                        >
                          {/* Checkbox */}
                          <span
                            className={cn(
                              "w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all",
                              isSelected
                                ? "border-brand-pink bg-brand-pink"
                                : "border-[#c4c2d4] bg-white",
                            )}
                          >
                            {isSelected && (
                              <Check
                                size={10}
                                className="text-white stroke-[3]"
                              />
                            )}
                          </span>
                          {/* Tier name + follower range */}
                          <span className="flex-1 flex items-center gap-1.5">
                            <span className="text-xs font-bold text-[#1a1a2e]">
                              {t}
                            </span>
                            <span className="text-[11px] font-medium text-[#9a99b0]">
                              {range}
                            </span>
                          </span>
                          {/* Minimum budget */}
                          <span className="text-[11px] font-medium text-[#9a99b0] whitespace-nowrap">
                            {min}
                          </span>
                          <ChevronRight
                            size={14}
                            className="text-[#c4c2d4] shrink-0"
                          />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Select Advertiser Dropdown */}
              <div
                className="flex flex-col gap-1.5 relative"
                ref={advertiserDropdownRef}
              >
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#7a7a9a]">
                    Select Advertiser
                  </label>
                  {selectedAdvertisers.length > 0 && (
                    <span className="text-[10px] text-brand-pink font-bold">
                      {selectedAdvertisers.length} selected
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setIsAdvertiserDropdownOpen((prev) => !prev)}
                  className="h-10 w-full bg-white border border-[#e8e6f0] rounded-xl px-4 text-xs font-medium text-[#1a1a2e] flex items-center justify-between focus:outline-none focus:ring-1 focus:ring-brand-pink/30 cursor-pointer select-none"
                >
                  <span
                    className={cn(
                      selectedAdvertisers.length === 0
                        ? "text-[#c4c2d4]"
                        : "font-bold text-[#1a1a2e]",
                    )}
                  >
                    {selectedAdvertisers.length === 0
                      ? "Select Advertiser..."
                      : selectedBrandObjs.length === 1
                        ? selectedBrandObjs[0].name
                        : `${selectedBrandObjs[0]?.name || "Advertiser"} (+${selectedBrandObjs.length - 1} more)`}
                  </span>
                  <ChevronDown
                    size={16}
                    className={cn(
                      "text-[#7a7a9a] transition-transform duration-200",
                      isAdvertiserDropdownOpen && "rotate-180 text-brand-pink",
                    )}
                  />
                </button>

                {isAdvertiserDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-white border border-[#e8e6f0] rounded-2xl p-3 shadow-xl flex flex-col gap-2.5">
                    {/* Search input */}
                    <div className="relative">
                      <Search
                        size={14}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a99b0]"
                      />
                      <input
                        type="text"
                        placeholder="Search Brands..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-9 w-full bg-[#faf9fc] border border-[#e8e6f0] rounded-xl pl-9 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-brand-pink/20 font-medium placeholder:text-[#c4c2d4]"
                      />
                    </div>

                    {/* Select All Row */}
                    {filteredAdvertisers.length > 0 && (
                      <div className="flex items-center justify-between px-3 py-1.5 bg-[#faf9fc] border border-[#e8e6f0] rounded-xl text-xs font-bold text-[#1a1a2e]">
                        <label className="flex items-center gap-2 cursor-pointer select-none text-[11px]">
                          <input
                            type="checkbox"
                            checked={
                              filteredAdvertisers.length > 0 &&
                              filteredAdvertisers.every((adv) =>
                                selectedAdvertisers.includes(adv.id),
                              )
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                const allIds = Array.from(
                                  new Set([
                                    ...selectedAdvertisers,
                                    ...filteredAdvertisers.map((adv) => adv.id),
                                  ]),
                                );
                                setSelectedAdvertisers(allIds);
                              } else {
                                const filteredIds = new Set(
                                  filteredAdvertisers.map((adv) => adv.id),
                                );
                                setSelectedAdvertisers(
                                  selectedAdvertisers.filter(
                                    (id) => !filteredIds.has(id),
                                  ),
                                );
                              }
                            }}
                            className="accent-brand-pink shrink-0 cursor-pointer"
                          />
                          <span>Select All ({filteredAdvertisers.length})</span>
                        </label>
                        {selectedAdvertisers.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setSelectedAdvertisers([])}
                            className="text-[10px] font-bold text-[#7a7a9a] hover:text-brand-pink transition-colors cursor-pointer"
                          >
                            Clear Selection
                          </button>
                        )}
                      </div>
                    )}

                    {/* List */}
                    <div className="flex flex-col gap-1 max-h-[220px] overflow-y-auto pr-0.5">
                      {filteredAdvertisers.map((adv) => {
                        const selected = selectedAdvertisers.includes(adv.id);
                        const toggleSelect = () => {
                          if (selected) {
                            setSelectedAdvertisers(
                              selectedAdvertisers.filter((id) => id !== adv.id),
                            );
                          } else {
                            setSelectedAdvertisers([
                              ...selectedAdvertisers,
                              adv.id,
                            ]);
                          }
                        };
                        return (
                          <div
                            key={adv.id}
                            onClick={toggleSelect}
                            className={cn(
                              "flex items-center gap-3 px-3 py-2 rounded-xl border transition-all cursor-pointer select-none text-xs",
                              selected
                                ? "bg-[#fff0f5] border-[#fbcfe8]"
                                : "bg-white border-transparent hover:bg-[#faf9fc]",
                            )}
                          >
                            <input
                              type="checkbox"
                              checked={selected}
                              onChange={() => {}}
                              className="accent-brand-pink shrink-0 cursor-pointer"
                            />
                            <div
                              className={cn(
                                "w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold text-white uppercase shrink-0",
                                adv.logoColor,
                              )}
                            >
                              {adv.logoText}
                            </div>
                            <div className="flex flex-col text-left">
                              <span className="text-xs font-bold text-[#1a1a2e]">
                                {adv.name}
                              </span>
                              <span className="text-[10px] text-[#7a7a9a]">
                                Current: {adv.rate}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                      {filteredAdvertisers.length === 0 && (
                        <span className="text-xs text-[#7a7a9a] py-3 text-center">
                          No brands found.
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Posting Platforms Dropdown (Multi-select) */}
              <div
                className="flex flex-col gap-1.5 relative"
                ref={platformDropdownRef}
              >
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#7a7a9a]">
                    Posting Platforms
                  </label>
                  {selectedPlatforms.length > 0 && (
                    <span className="text-[10px] text-brand-pink font-bold">
                      {selectedPlatforms.length} selected
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setIsPlatformDropdownOpen((prev) => !prev)}
                  className="h-10 w-full bg-white border border-[#e8e6f0] rounded-xl px-4 text-xs font-medium text-[#1a1a2e] flex items-center justify-between focus:outline-none focus:ring-1 focus:ring-brand-pink/30 cursor-pointer select-none"
                >
                  <span
                    className={cn(
                      selectedPlatforms.length === 0
                        ? "text-[#c4c2d4]"
                        : "font-bold text-[#1a1a2e]",
                    )}
                  >
                    {selectedPlatforms.length === 0
                      ? "Select Platforms..."
                      : selectedPlatforms.length === 1
                        ? selectedPlatforms[0]
                        : `${selectedPlatforms[0]} (+${selectedPlatforms.length - 1} more)`}
                  </span>
                  <ChevronDown
                    size={16}
                    className={cn(
                      "text-[#7a7a9a] transition-transform duration-200",
                      isPlatformDropdownOpen && "rotate-180 text-brand-pink",
                    )}
                  />
                </button>

                {isPlatformDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-white border border-[#e8e6f0] rounded-2xl p-2.5 shadow-xl flex flex-col gap-1">
                    {[
                      "Instagram",
                      "TikTok",
                      "YouTube",
                      "X (Twitter)",
                      "Facebook",
                    ].map((plat) => {
                      const isSelected = selectedPlatforms.includes(plat);
                      return (
                        <div
                          key={plat}
                          onClick={() => handleTogglePlatform(plat)}
                          className={cn(
                            "flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all cursor-pointer select-none text-xs",
                            isSelected
                              ? "bg-[#fff0f5] border-[#fbcfe8] text-[#1a1a2e] font-bold"
                              : "bg-white border-transparent text-[#5a5a7a] hover:bg-[#faf9fc]",
                          )}
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="accent-brand-pink shrink-0 cursor-pointer"
                            />
                            <span>{plat}</span>
                          </div>
                          {isSelected && (
                            <span className="text-[10px] text-brand-pink font-extrabold">
                              Selected
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* End Date */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#7a7a9a]">
                  End Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="h-10 w-full bg-white border border-[#e8e6f0] rounded-xl px-4 text-xs focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-medium text-[#1a1a2e]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Campaign Brief */}
          {step === 2 && (
            <div className="flex flex-col gap-5 text-xs font-semibold text-[#1a1a2e]">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#7a7a9a]">
                  Campaign Description
                </label>
                <textarea
                  rows={4}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full bg-white border border-[#e8e6f0] rounded-xl p-3.5 text-xs focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-medium resize-none leading-relaxed"
                />
              </div>

              {/* Dynamic Deliverables */}
              <div className="flex flex-col gap-2.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#7a7a9a]">
                  Deliverables
                </label>
                {deliverables.map((del, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={del}
                      onChange={(e) => {
                        const next = [...deliverables];
                        next[index] = e.target.value;
                        setDeliverables(next);
                      }}
                      className="h-10 flex-1 bg-white border border-[#e8e6f0] rounded-xl px-4 text-xs focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-medium"
                    />
                    <button
                      onClick={() => handleRemoveDeliverable(index)}
                      className="p-2.5 rounded-xl border border-[#fee2e2] text-[#dc2626] hover:bg-[#fff5f5] transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={handleAddDeliverable}
                  className="text-brand-pink text-xs font-bold w-fit mt-0.5 hover:underline cursor-pointer select-none"
                >
                  + Add another
                </button>
              </div>

              {/* Dynamic Content direction */}
              <div className="flex flex-col gap-2.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#7a7a9a]">
                  Content direction
                </label>
                {directions.map((dir, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={dir}
                      onChange={(e) => {
                        const next = [...directions];
                        next[index] = e.target.value;
                        setDirections(next);
                      }}
                      className="h-10 flex-1 bg-white border border-[#e8e6f0] rounded-xl px-4 text-xs focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-medium"
                    />
                    <button
                      onClick={() => handleRemoveDirection(index)}
                      className="p-2.5 rounded-xl border border-[#fee2e2] text-[#dc2626] hover:bg-[#fff5f5] transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={handleAddDirection}
                  className="text-brand-pink text-xs font-bold w-fit mt-0.5 hover:underline cursor-pointer select-none"
                >
                  + Add another
                </button>
              </div>

              {/* Do's and Don'ts */}
              <div className="flex flex-col gap-2.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#7a7a9a]">
                  Content guidelines - Do&apos;s
                </label>
                {dos.map((d, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={d}
                      onChange={(e) => {
                        const next = [...dos];
                        next[index] = e.target.value;
                        setDos(next);
                      }}
                      className="h-10 flex-1 bg-white border border-[#e8e6f0] rounded-xl px-4 text-xs focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-medium"
                    />
                    <button
                      onClick={() => handleRemoveDo(index)}
                      className="p-2.5 rounded-xl border border-[#fee2e2] text-[#dc2626] hover:bg-[#fff5f5] transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={handleAddDo}
                  className="text-brand-pink text-xs font-bold w-fit mt-0.5 hover:underline cursor-pointer select-none"
                >
                  + Add another
                </button>
              </div>

              <div className="flex flex-col gap-2.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#7a7a9a]">
                  Content guidelines - Don&apos;ts
                </label>
                {donts.map((d, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={d}
                      onChange={(e) => {
                        const next = [...donts];
                        next[index] = e.target.value;
                        setDonts(next);
                      }}
                      className="h-10 flex-1 bg-white border border-[#e8e6f0] rounded-xl px-4 text-xs focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-medium"
                    />
                    <button
                      onClick={() => handleRemoveDont(index)}
                      className="p-2.5 rounded-xl border border-[#fee2e2] text-[#dc2626] hover:bg-[#fff5f5] transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={handleAddDont}
                  className="text-brand-pink text-xs font-bold w-fit mt-0.5 hover:underline cursor-pointer select-none"
                >
                  + Add another
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Review */}
          {step === 3 && (
            <div className="flex flex-col gap-6 text-xs text-[#5a5a7a] font-medium leading-relaxed">
              <div className="text-left py-1 text-xs">
                <span>
                  Fill in each section — you can save as draft and return
                  anytime.{" "}
                </span>
                <span className="text-brand-pink font-bold underline cursor-pointer hover:opacity-80">
                  See campaign brief sample here
                </span>
              </div>

              {/* Details card */}
              <div className="border border-[#e8e6f0]/60 rounded-[20px] p-5 flex flex-col gap-3.5 bg-[#faf9fc]">
                <div className="flex justify-between items-center border-b border-[#e8e6f0]/40 pb-2">
                  <h4 className="font-bold text-[#1a1a2e] uppercase tracking-wider text-[10px]">
                    Details
                  </h4>
                  <button
                    onClick={() => setStep(1)}
                    className="text-brand-pink text-[10px] font-bold hover:underline cursor-pointer select-none"
                  >
                    Edit
                  </button>
                </div>
                <div className="flex flex-col gap-2.5 text-xs text-[#1a1a2e]">
                  <div className="flex justify-between">
                    <span className="text-[#7a7a9a] uppercase tracking-wider text-[9px] font-bold">
                      Title
                    </span>
                    <span className="font-bold">{title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7a7a9a] uppercase tracking-wider text-[9px] font-bold">
                      Goal
                    </span>
                    <span className="font-bold">{goal}</span>
                  </div>
                  {goal === "Amplify Content" && contentLink && (
                    <div className="flex justify-between">
                      <span className="text-[#7a7a9a] uppercase tracking-wider text-[9px] font-bold">
                        Content Link
                      </span>
                      <span className="font-bold truncate max-w-[200px]">
                        {contentLink}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-[#7a7a9a] uppercase tracking-wider text-[9px] font-bold">
                      Advertiser
                    </span>
                    <span className="font-bold">{activeAdvertiserNames}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7a7a9a] uppercase tracking-wider text-[9px] font-bold">
                      Tier
                    </span>
                    <span className="font-bold">{tier}</span>
                  </div>
                </div>
              </div>

              {/* Brief card */}
              <div className="border border-[#e8e6f0]/60 rounded-[20px] p-5 flex flex-col gap-2.5 bg-[#faf9fc]">
                <div className="flex justify-between items-center border-b border-[#e8e6f0]/40 pb-2">
                  <h4 className="font-bold text-[#1a1a2e] uppercase tracking-wider text-[10px]">
                    Campaign Description
                  </h4>
                  <button
                    onClick={() => setStep(2)}
                    className="text-brand-pink text-[10px] font-bold hover:underline cursor-pointer select-none"
                  >
                    Edit
                  </button>
                </div>
                <p className="text-xs text-[#5a5a7a] leading-relaxed">{desc}</p>
              </div>

              {/* Deliverables card */}
              <div className="border border-[#e8e6f0]/60 rounded-[20px] p-5 flex flex-col gap-2.5 bg-[#faf9fc]">
                <div className="flex justify-between items-center border-b border-[#e8e6f0]/40 pb-2">
                  <h4 className="font-bold text-[#1a1a2e] uppercase tracking-wider text-[10px]">
                    Deliverables
                  </h4>
                  <button
                    onClick={() => setStep(2)}
                    className="text-brand-pink text-[10px] font-bold hover:underline cursor-pointer select-none"
                  >
                    Edit
                  </button>
                </div>
                <div className="flex flex-col gap-2 text-xs">
                  {deliverables.map((del, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-xs text-[#5a5a7a]"
                    >
                      <span className="text-brand-pink font-bold shrink-0">
                        {i + 1}.
                      </span>
                      <span>{del}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content Direction card */}
              <div className="border border-[#e8e6f0]/60 rounded-[20px] p-5 flex flex-col gap-2.5 bg-[#faf9fc]">
                <div className="flex justify-between items-center border-b border-[#e8e6f0]/40 pb-2">
                  <h4 className="font-bold text-[#1a1a2e] uppercase tracking-wider text-[10px]">
                    Content Direction
                  </h4>
                  <button
                    onClick={() => setStep(2)}
                    className="text-brand-pink text-[10px] font-bold hover:underline cursor-pointer select-none"
                  >
                    Edit
                  </button>
                </div>
                <div className="flex flex-col gap-2 text-xs">
                  {directions.map((dir, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-xs text-[#5a5a7a]"
                    >
                      <span className="text-brand-pink font-bold shrink-0">
                        {i + 1}.
                      </span>
                      <span>{dir}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content Guidelines card */}
              <div className="border border-[#e8e6f0]/60 rounded-[20px] p-5 flex flex-col gap-2.5 bg-[#faf9fc]">
                <div className="flex justify-between items-center border-b border-[#e8e6f0]/40 pb-2">
                  <h4 className="font-bold text-[#1a1a2e] uppercase tracking-wider text-[10px]">
                    Content Guidelines
                  </h4>
                  <button
                    onClick={() => setStep(2)}
                    className="text-brand-pink text-[10px] font-bold hover:underline cursor-pointer select-none"
                  >
                    Edit
                  </button>
                </div>
                <div className="flex flex-col gap-2.5 text-xs">
                  {dos.map((d, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 text-[#5a5a7a]"
                    >
                      <div className="w-4 h-4 rounded-full bg-[#f0fdf4] text-[#16a34a] flex items-center justify-center shrink-0 border border-[#dcfce7]">
                        <Check size={9} className="stroke-[3]" />
                      </div>
                      <span>{d}</span>
                    </div>
                  ))}
                  {donts.map((d, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 text-[#5a5a7a]"
                    >
                      <div className="w-4 h-4 rounded-full bg-[#fef2f2] text-[#dc2626] flex items-center justify-center shrink-0 border border-[#fee2e2]">
                        <X size={9} className="stroke-[3]" />
                      </div>
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom controls bar */}
        <div className="py-6 flex justify-between items-center gap-4 mt-2">
          <button
            onClick={handleBack}
            className="h-10 px-5 border border-[#e8e6f0] text-xs font-bold text-[#5a5a7a] rounded-xl hover:bg-[#faf9fc] transition-colors cursor-pointer select-none"
          >
            Back
          </button>
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleSaveAsDraft}
              className="h-10 px-5 bg-[#faf9fc] border border-[#e8e6f0] text-[#5a5a7a] hover:bg-[#f4f3f6] text-xs font-bold rounded-xl transition-all cursor-pointer select-none"
            >
              Save as draft
            </button>
            <button
              onClick={handleContinue}
              className="h-10 px-5 bg-brand-pink text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all cursor-pointer flex items-center gap-1.5 select-none"
            >
              {step === 3 ? "Publish" : "Continue"} <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
