"use client";

import { useEffect, useState, ReactNode } from "react";

interface AdminSecurityGuardProps {
  children: ReactNode;
  enabled?: boolean;
}

export default function AdminSecurityGuard({
  children,
  enabled = false,
}: AdminSecurityGuardProps) {
  const [isBlurred, setIsBlurred] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    // 1. Prevent Right-Click Context Menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // 2. Prevent Copy, Cut, and Selection Dragging
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
    };

    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault();
    };

    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    // 3. Intercept DevTools, Printing, and Screenshot Shortcuts (Mac & Windows)
    const handleKeyDown = (e: KeyboardEvent) => {
const platform =
  typeof navigator !== "undefined" ? navigator.platform ?? "" : "";
const isMac = platform.toUpperCase().includes("MAC");
      const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;
      const key = e.key.toLowerCase();
      const code = e.code;

      // F12 key
      if (e.keyCode === 123 || key === "f12") {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // DevTools: Ctrl+Shift+I or Cmd+Opt+I / J / C
      if (
        ctrlOrCmd &&
        (e.shiftKey || e.altKey) &&
        (key === "i" || key === "j" || key === "c")
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // View Source: Ctrl+U or Cmd+U
      if (ctrlOrCmd && key === "u") {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Save Page: Ctrl+S or Cmd+S
      if (ctrlOrCmd && key === "s") {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Print Page: Ctrl+P or Cmd+P
      if (ctrlOrCmd && key === "p") {
        setIsBlurred(true);
        e.preventDefault();
        e.stopPropagation();
        setTimeout(() => setIsBlurred(false), 3000);
        return false;
      }

      // PrintScreen / Screenshot key (Windows PrtScn / SysRq)
      if (
        key === "printscreen" ||
        key === "prtscn" ||
        e.keyCode === 44 ||
        code === "PrintScreen"
      ) {
        setIsBlurred(true);
        e.preventDefault();
        e.stopPropagation();
        setTimeout(() => setIsBlurred(false), 3500);
        return false;
      }

      // macOS Screenshot Shortcuts: Cmd + Shift + 3, 4, 5, 6
      if (
        e.metaKey &&
        e.shiftKey &&
        (key === "3" ||
          key === "4" ||
          key === "5" ||
          key === "6" ||
          code.startsWith("Digit"))
      ) {
        setIsBlurred(true);
        e.preventDefault();
        e.stopPropagation();
        setTimeout(() => setIsBlurred(false), 3500);
        return false;
      }

      // Windows Snipping Tool: Win + Shift + S or Ctrl + Shift + S
      if (
        (e.metaKey || e.ctrlKey) &&
        e.shiftKey &&
        (key === "s" || code === "KeyS")
      ) {
        setIsBlurred(true);
        e.preventDefault();
        e.stopPropagation();
        setTimeout(() => setIsBlurred(false), 3500);
        return false;
      }
    };

    // 4. Blur Shield on Tab Switch / Window Blur / Mouse Leave
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsBlurred(true);
      } else {
        setIsBlurred(false);
      }
    };

    const handleWindowBlur = () => {
      setIsBlurred(true);
    };

    const handleWindowFocus = () => {
      setIsBlurred(false);
    };

    // 5. Block Screen Capture / Display Media Recording API
    if (
      typeof navigator !== "undefined" &&
      navigator.mediaDevices &&
      navigator.mediaDevices.getDisplayMedia
    ) {
      try {
navigator.mediaDevices.getDisplayMedia = async function () {
  setIsBlurred(true);
  setTimeout(() => setIsBlurred(false), 3500);
  throw new Error("Screen recording disabled for privacy and security.");
};
      } catch {
        // Ignored if read-only property in certain browsers
      }
    }

    // Attach Event Listeners
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("cut", handleCut);
    document.addEventListener("dragstart", handleDragStart);
    document.addEventListener("keydown", handleKeyDown, true);
    document.addEventListener("keyup", handleKeyDown, true);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);

    // 6. Anti-Debugging Interval Loop in Production
    let debugInterval: NodeJS.Timeout | null = null;
    if (process.env.NODE_ENV === "production") {
      debugInterval = setInterval(() => {
        const startTime = Date.now();
        const check = new Function("debugger");
        check();
        const endTime = Date.now();
        if (endTime - startTime > 100) {
          setIsBlurred(true);
        }
      }, 1000);
    }

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("cut", handleCut);
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("keyup", handleKeyDown, true);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
      if (debugInterval) clearInterval(debugInterval);
    };
  }, [enabled]);

  return (
    <div className="relative min-h-screen select-none">
      {/* Privacy Shield: 100% Solid Opaque Pitch Black Screen when Window loses Focus, Screenshot key pressed, or Tab Switched */}
      {isBlurred && (
        <div className="fixed inset-0 z-[999999] bg-slate-950 flex flex-col items-center justify-center text-white select-none transition-none">
          <div className="p-8 bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl flex flex-col items-center gap-4 text-center max-w-md mx-4">
            <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-2xl border border-rose-500/30">
              🔒
            </div>
            <h3 className="text-lg font-bold text-slate-100">
              Protected Dashboard Content
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Screen content is completely hidden for security and data
              protection. Return focus to the dashboard to resume viewing.
            </p>
          </div>
        </div>
      )}

      {/* Children content is hidden completely (opacity-0 & blur) when screen shield is active */}
      <div
        className={
          isBlurred
            ? "opacity-0 pointer-events-none filter blur-3xl transition-none"
            : "transition-opacity duration-150"
        }
      >
        {children}
      </div>
    </div>
  );
}
