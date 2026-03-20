"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type BackButtonProps = {
  fallbackHref?: string;
  className?: string;
  label?: string;
  forceFallback?: boolean;
  reloadDocument?: boolean;
};

const BackButton = ({
  fallbackHref = "/",
  className = "",
  label = "Back",
  forceFallback = false,
  reloadDocument = false,
}: BackButtonProps) => {
  const router = useRouter();

  const navigateToFallback = () => {
    if (reloadDocument) {
      window.location.href = fallbackHref;
      return;
    }

    router.push(fallbackHref);
    router.refresh();
  };

  const handleBack = () => {
    if (!forceFallback && window.history.length > 1) {
      router.back();
      return;
    }

    navigateToFallback();
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 ${className}`}>
      <ArrowLeft className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
};

export default BackButton;
