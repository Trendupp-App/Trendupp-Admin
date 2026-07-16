"use client";

import { useState } from "react";
import { X, Trash2, Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreateCampaignWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateCampaignWizard({
  isOpen,
  onClose,
}: CreateCampaignWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1 state
  const [title, setTitle] = useState("Summer Style Collection");
  const [goal, setGoal] = useState("Create Content");
  const [tokens, setTokens] = useState("700000");
  const [tier, setTier] = useState("Micro (10K-200K), Nano (1K-10K)");

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

  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Slide-over Drawer Container */}
      <div className="relative z-10 w-full max-w-[620px] h-full bg-white shadow-2xl flex flex-col overflow-y-auto text-left">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#e8e6f0]/40">
          <div className="flex flex-col">
            <h2 className="text-base font-bold text-[#1a1a2e]">
              Create Campaign
            </h2>
            <span className="text-[10px] text-[#9a99b0] font-semibold mt-0.5">
              Fill in each section — you can save as draft and return anytime.
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#f4f3f6] text-[#7a7a9a] transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Stepper Bar */}
        <div className="px-6 py-4 bg-[#faf9fc] border-b border-[#e8e6f0]/40 flex items-center gap-4 text-xs font-semibold text-[#9a99b0]">
          {/* Step 1 */}
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold",
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

          <div className="h-0.5 w-8 bg-[#e8e6f0]" />

          {/* Step 2 */}
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold",
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

          <div className="h-0.5 w-8 bg-[#e8e6f0]" />

          {/* Step 3 */}
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold",
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
        <div className="p-6 flex-1 flex flex-col gap-6">
          {/* Cover image (All steps show it) */}
          <div className="relative h-40 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl overflow-hidden flex items-center justify-center">
            <button className="px-4 py-1.5 rounded-xl bg-white text-[10px] font-bold text-[#1a1a2e] hover:bg-white/95 cursor-pointer shadow-sm relative z-10">
              Change photo
            </button>
          </div>

          {/* STEP 1: Details */}
          {step === 1 && (
            <div className="flex flex-col gap-4 text-xs font-semibold text-[#1a1a2e]">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#7a7a9a]">
                  Campaign title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-9.5 w-full bg-white border border-[#e8e6f0] rounded-xl px-4 text-xs focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-medium"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#7a7a9a]">
                  Campaign goal
                </label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="h-9.5 w-full bg-white border border-[#e8e6f0] rounded-xl px-4 text-xs focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-medium cursor-pointer"
                >
                  <option value="Create Content">Create Content</option>
                  <option value="Brand Awareness">Brand Awareness</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#7a7a9a]">
                  Token Reward per Participant
                </label>
                <input
                  type="text"
                  value={tokens}
                  onChange={(e) => setTokens(e.target.value)}
                  className="h-9.5 w-full bg-white border border-[#e8e6f0] rounded-xl px-4 text-xs focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-medium"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#7a7a9a]">
                  Creator tier
                </label>
                <select
                  value={tier}
                  onChange={(e) => setTier(e.target.value)}
                  className="h-9.5 w-full bg-white border border-[#e8e6f0] rounded-xl px-4 text-xs focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-medium cursor-pointer"
                >
                  <option value="Micro (10K-200K), Nano (1K-10K)">
                    Micro (10K-200K), Nano (1K-10K)
                  </option>
                  <option value="Macro, Micro">Macro, Micro</option>
                </select>
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
                  rows={3}
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
                      className="h-9.5 flex-1 bg-white border border-[#e8e6f0] rounded-xl px-4 text-xs focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-medium"
                    />
                    <button
                      onClick={() => handleRemoveDeliverable(index)}
                      className="p-2 rounded-xl border border-[#fee2e2] text-[#dc2626] hover:bg-[#fff5f5] cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={handleAddDeliverable}
                  className="text-brand-pink text-xs font-bold w-fit mt-0.5 hover:underline cursor-pointer"
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
                      className="h-9.5 flex-1 bg-white border border-[#e8e6f0] rounded-xl px-4 text-xs focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-medium"
                    />
                    <button
                      onClick={() => handleRemoveDirection(index)}
                      className="p-2 rounded-xl border border-[#fee2e2] text-[#dc2626] hover:bg-[#fff5f5] cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={handleAddDirection}
                  className="text-brand-pink text-xs font-bold w-fit mt-0.5 hover:underline cursor-pointer"
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
                      className="h-9.5 flex-1 bg-white border border-[#e8e6f0] rounded-xl px-4 text-xs focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-medium"
                    />
                    <button
                      onClick={() => handleRemoveDo(index)}
                      className="p-2 rounded-xl border border-[#fee2e2] text-[#dc2626] hover:bg-[#fff5f5] cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={handleAddDo}
                  className="text-brand-pink text-xs font-bold w-fit mt-0.5 hover:underline cursor-pointer"
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
                      className="h-9.5 flex-1 bg-white border border-[#e8e6f0] rounded-xl px-4 text-xs focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-medium"
                    />
                    <button
                      onClick={() => handleRemoveDont(index)}
                      className="p-2 rounded-xl border border-[#fee2e2] text-[#dc2626] hover:bg-[#fff5f5] cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={handleAddDont}
                  className="text-brand-pink text-xs font-bold w-fit mt-0.5 hover:underline cursor-pointer"
                >
                  + Add another
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Review */}
          {step === 3 && (
            <div className="flex flex-col gap-6 text-xs text-[#5a5a7a] font-medium leading-relaxed">
              {/* Details card */}
              <div className="border border-[#e8e6f0]/60 rounded-2xl p-4.5 flex flex-col gap-3.5 bg-[#faf9fc]">
                <div className="flex justify-between items-center border-b border-[#e8e6f0]/40 pb-2">
                  <h4 className="font-bold text-[#1a1a2e] uppercase tracking-wider text-[10px]">
                    Details
                  </h4>
                  <button
                    onClick={() => setStep(1)}
                    className="text-brand-pink text-[10px] font-bold hover:underline cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
                <div className="flex flex-col gap-2.5 text-xs text-[#1a1a2e]">
                  <div className="flex justify-between">
                    <span className="text-[#7a7a9a]">TITLE</span>
                    <span className="font-bold">{title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7a7a9a]">GOAL</span>
                    <span className="font-bold">{goal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7a7a9a]">
                      Token Reward per Participant
                    </span>
                    <span className="font-bold">800,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7a7a9a]">Content go live</span>
                    <span className="font-bold">10-10-2026</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7a7a9a]">TIER</span>
                    <span className="font-bold">Micro</span>
                  </div>
                </div>
              </div>

              {/* Brief card */}
              <div className="border border-[#e8e6f0]/60 rounded-2xl p-4.5 flex flex-col gap-2.5 bg-[#faf9fc]">
                <div className="flex justify-between items-center border-b border-[#e8e6f0]/40 pb-2">
                  <h4 className="font-bold text-[#1a1a2e] uppercase tracking-wider text-[10px]">
                    Campaign Brief
                  </h4>
                  <button
                    onClick={() => setStep(2)}
                    className="text-brand-pink text-[10px] font-bold hover:underline cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
                <p className="text-xs text-[#5a5a7a] leading-relaxed">{desc}</p>
              </div>

              {/* Deliverables card */}
              <div className="border border-[#e8e6f0]/60 rounded-2xl p-4.5 flex flex-col gap-2.5 bg-[#faf9fc]">
                <div className="flex justify-between items-center border-b border-[#e8e6f0]/40 pb-2">
                  <h4 className="font-bold text-[#1a1a2e] uppercase tracking-wider text-[10px]">
                    Deliverables
                  </h4>
                  <button
                    onClick={() => setStep(2)}
                    className="text-brand-pink text-[10px] font-bold hover:underline cursor-pointer"
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
              <div className="border border-[#e8e6f0]/60 rounded-2xl p-4.5 flex flex-col gap-2.5 bg-[#faf9fc]">
                <div className="flex justify-between items-center border-b border-[#e8e6f0]/40 pb-2">
                  <h4 className="font-bold text-[#1a1a2e] uppercase tracking-wider text-[10px]">
                    Content Direction
                  </h4>
                  <button
                    onClick={() => setStep(2)}
                    className="text-brand-pink text-[10px] font-bold hover:underline cursor-pointer"
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
              <div className="border border-[#e8e6f0]/60 rounded-2xl p-4.5 flex flex-col gap-2.5 bg-[#faf9fc]">
                <div className="flex justify-between items-center border-b border-[#e8e6f0]/40 pb-2">
                  <h4 className="font-bold text-[#1a1a2e] uppercase tracking-wider text-[10px]">
                    Content Guidelines
                  </h4>
                  <button
                    onClick={() => setStep(2)}
                    className="text-brand-pink text-[10px] font-bold hover:underline cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
                <div className="flex flex-col gap-3.5 text-xs text-[#5a5a7a]">
                  <div className="flex flex-col gap-2 text-xs">
                    {dos.map((d, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-[#5a5a7a]"
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
                        className="flex items-center gap-2 text-[#5a5a7a]"
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
            </div>
          )}
        </div>

        {/* Bottom controls bar */}
        <div className="px-6 py-4.5 border-t border-[#e8e6f0]/40 flex justify-between items-center gap-4 bg-[#faf9fc]">
          <button
            disabled={step === 1}
            onClick={() => setStep((step - 1) as 1 | 2 | 3)}
            className="h-9 px-4.5 border border-[#e8e6f0] text-xs font-bold text-[#5a5a7a] rounded-xl hover:bg-[#faf9fc] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Back
          </button>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                onClose();
                alert("Campaign saved as draft.");
              }}
              className="h-9 px-4.5 bg-[#f5f3ff] text-[#7c3aed] text-xs font-bold rounded-xl hover:bg-[#ede9fe] transition-colors cursor-pointer"
            >
              Save as draft
            </button>
            <button
              onClick={() => {
                if (step < 3) {
                  setStep((step + 1) as 1 | 2 | 3);
                } else {
                  onClose();
                  alert("Campaign successfully published.");
                }
              }}
              className="h-9 px-4.5 bg-brand-pink text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all cursor-pointer flex items-center gap-1.5"
            >
              {step === 3 ? "Publish" : "Continue"} <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
