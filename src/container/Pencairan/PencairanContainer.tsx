"use client";

import { useState } from "react";

import { cn } from "@muatmuat/lib/utils";
import { ConfirmationModal } from "@muatmuat/ui/Modal";

import PageTitle from "@/components/PageTitle/PageTitle";

import PencairanExportSidebar from "./components/PencairanExportSidebar";
import PencairanFilter from "./components/PencairanFilter";
import PencairanSummary from "./components/PencairanSummary";
import PencairanTableBO from "./components/PencairanTableBO";

interface TabItem {
  label: string;
  value: string;
}

const TABS: TabItem[] = [
  { label: "Not Exported", value: "Not Exported" },
  { label: "Exported", value: "Exported" },
  { label: "Finished", value: "Finished" },
];

const PencairanContainer = () => {
  const [activeTab, setActiveTab] = useState<string>("Not Exported");
  const [showFilter, setShowFilter] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleExport = () => {
    setShowConfirmationModal(true);
  };

  const handleConfirmExport = () => {
    // Implement actual export logic here
    console.log("Export confirmed");
    setShowConfirmationModal(false);
    setTimeout(() => {
      setShowSuccessModal(true);
    }, 300);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageTitle
        className="text-2xl"
        appearance={{ iconClassName: "text-black" }}
      >
        Pencairan
      </PageTitle>
      <div className="mx-auto flex h-[33px] w-[600px] flex-row items-center">
        {TABS.map((tab, index) => {
          const isActive = activeTab === tab.value;
          const isFirst = index === 0;
          const isLast = index === TABS.length - 1;

          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                "flex h-[33px] w-[200px] items-center justify-center px-[10px] py-[8px]",
                "text-center text-[14px] font-semibold leading-[17px]",
                "cursor-pointer border transition-colors",
                // Border Radius
                isFirst && "rounded-l-[4px]",
                isLast && "rounded-r-[4px]",
                // Active State
                isActive
                  ? "z-10 border-[#176CF7] bg-[#176CF7] text-white"
                  : "border-[#868686] bg-white text-[#868686]",
                // Prevent double borders visually if needed, though user CSS didn't explicitly handle overlap logic besides order.
                // Simply mapping them is fine.
                // Adjust border logic if they overlap, but usually with flex they just sit next to each other.
                // If using 'border-l-0' for subsequent items it prevents double border thickness.
                !isFirst && !isActive && "border-l-0",
                !isFirst && isActive && "border-l-[#176CF7]" // Ensure active border shows
              )}
              style={
                {
                  // React might complain about specific border handling with Tailwind classes if not careful,
                  // but standard border classes should work.
                  // User CSS specified exact borders.
                  // border: 1px solid...
                }
              }
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <PencairanSummary />

      <PencairanFilter
        showFilter={showFilter}
        setShowFilter={setShowFilter}
        showExport={showExport}
        setShowExport={setShowExport}
      />

      <div className="flex w-full flex-row gap-5">
        <div className="flex-1 overflow-hidden">
          <PencairanTableBO showExport={showExport} />
        </div>

        <div
          className={cn(
            "grid transition-all duration-300 ease-in-out",
            showExport
              ? "grid-cols-[1fr] opacity-100"
              : "grid-cols-[0fr] opacity-0"
          )}
        >
          <div className="overflow-hidden">
            <PencairanExportSidebar onExport={handleExport} />
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showConfirmationModal}
        setIsOpen={setShowConfirmationModal}
        variant="bo"
        title={{ text: "Pemberitahuan" }}
        description={{
          text: "Apakah anda yakin akan mengekspor data pencairan?",
        }}
        confirm={{ text: "Ya", onClick: handleConfirmExport }}
        cancel={{ text: "Tidak" }}
      />

      <ConfirmationModal
        isOpen={showSuccessModal}
        setIsOpen={setShowSuccessModal}
        variant="bo"
        withCancel={false}
        title={{ text: "Pemberitahuan" }}
        description={{ text: "Data berhasil diekspor." }}
        confirm={{ text: "Tutup", onClick: () => setShowSuccessModal(false) }}
      />
    </div>
  );
};

export default PencairanContainer;
