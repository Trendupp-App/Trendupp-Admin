"use client";
/* eslint-disable @next/next/no-img-element */

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2, Check, ArrowRight, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 1 state
  const [preview, setPreview] = useState<string>(
    "/dashboard/tiktok_news_banner.png",
  );
  const [title, setTitle] = useState("Summer Style Collection");
  const [goal, setGoal] = useState("Create Content");
  const [tier, setTier] = useState("Micro (10K-200K), Nano (1K-10K)");
  const [selectedAdvertiser, setSelectedAdvertiser] =
    useState<string>("coca-cola");
  const [searchQuery, setSearchQuery] = useState("");

  // Step 2 state
  const [desc, setDesc] = useState(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  );
  const [deliverables, setDeliverables] = useState<string[]>([
    "1x Instagram Reel (30–60 seconds)",
    "1x Instagram Reel (30–60 seconds)",
  ]);
  const [directions, setDirections] = useState<string[]>([
    "Film in warm, golden-hour lighting",
  ]);
  const [dos, setDos] = useState<string[]>([
    "Use natural lighting throughout the video",
    "Use natural lighting throughout the video",
  ]);
  const [donts, setDonts] = useState<string[]>([
    "Do not feature or mention competitor produc",
  ]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const filteredAdvertisers = MOCK_ADVERTISERS.filter((adv) =>
    adv.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const activeAdvertiserObj = MOCK_ADVERTISERS.find(
    (a) => a.id === selectedAdvertiser,
  );

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

  const handleSaveAsDraft = () => {
    alert("Campaign saved as draft.");
    router.push("/admin/campaigns/social");
  };

  const handleContinue = () => {
    if (step < 3) {
      setStep((step + 1) as 1 | 2 | 3);
    } else {
      alert("Campaign successfully published.");
      router.push("/admin/campaigns/social");
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
          {/* Cover image (Always shows, matches mockup image) */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative h-48 bg-[#eff6ff] rounded-[24px] overflow-hidden flex items-center justify-center border border-[#e8e6f0]/40 group cursor-pointer"
          >
            <img
              src={preview}
              alt="Campaign Cover"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-black/20" />
            <button className="px-4 py-2 rounded-xl bg-white text-[10px] font-bold text-[#1a1a2e] hover:bg-white/95 transition-colors cursor-pointer shadow-sm relative z-10 select-none">
              Change photo
            </button>
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
                  <option value="Create Content">Create Content</option>
                  <option value="Brand Awareness">Brand Awareness</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#7a7a9a]">
                  Creator tier
                </label>
                <select
                  value={tier}
                  onChange={(e) => setTier(e.target.value)}
                  className="h-10 w-full bg-white border border-[#e8e6f0] rounded-xl px-4 text-xs focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-medium cursor-pointer"
                >
                  <option value="Micro (10K-200K), Nano (1K-10K)">
                    Micro (10K-200K), Nano (1K-10K)
                  </option>
                  <option value="Macro, Micro">Macro, Micro</option>
                </select>
              </div>

              {/* Select Advertiser Panel */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#7a7a9a]">
                  Select Advertiser
                </label>
                <div className="border border-[#e8e6f0] rounded-2xl p-4 flex flex-col gap-3.5 bg-white">
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
                      className="h-9.5 w-full bg-[#faf9fc] border border-[#e8e6f0] rounded-xl pl-9 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-brand-pink/20 font-medium placeholder:text-[#c4c2d4]"
                    />
                  </div>

                  {/* List */}
                  <div className="flex flex-col gap-1.5">
                    {filteredAdvertisers.map((adv) => {
                      const selected = selectedAdvertiser === adv.id;
                      return (
                        <div
                          key={adv.id}
                          onClick={() => setSelectedAdvertiser(adv.id)}
                          className={cn(
                            "flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl border transition-all cursor-pointer select-none",
                            selected
                              ? "bg-[#fff0f5] border-[#fbcfe8]"
                              : "bg-white border-transparent hover:bg-[#faf9fc]",
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={selected}
                            readOnly
                            className="accent-brand-pink shrink-0 cursor-pointer"
                          />
                          <div
                            className={cn(
                              "w-7 h-7 rounded-full flex items-center justify-center text-[8px] font-bold text-white uppercase shrink-0",
                              adv.logoColor,
                            )}
                          >
                            {adv.logoText}
                          </div>
                          <div className="flex flex-col text-left">
                            <span className="text-xs font-bold text-[#1a1a2e]">
                              {adv.name}
                            </span>
                            <span className="text-[10px] text-[#7a7a9a] font-semibold mt-0.5">
                              Current: {adv.rate}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    {filteredAdvertisers.length === 0 && (
                      <span className="text-xs text-[#7a7a9a] py-4 text-center">
                        No brands found.
                      </span>
                    )}
                  </div>
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
                  <div className="flex justify-between">
                    <span className="text-[#7a7a9a] uppercase tracking-wider text-[9px] font-bold">
                      Advertiser
                    </span>
                    <span className="font-bold">
                      {activeAdvertiserObj?.name || ""}
                    </span>
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
              className="h-10 px-5 bg-brand-pink text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all cursor-pointer flex items-center gap-1.5 select-none font-sans"
            >
              {step === 3 ? "Publish" : "Continue"} <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
