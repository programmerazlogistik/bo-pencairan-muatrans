"use client";

import { useState } from "react";

import { cn } from "@muatmuat/lib/utils";
import { ConfirmationModal } from "@muatmuat/ui/Modal";

import PageTitle from "@/components/PageTitle/PageTitle";

import ExportedFilter from "./components/Exported/ExportedFilter";
import ExportedSummary from "./components/Exported/ExportedSummary";
import ExportedTable from "./components/Exported/ExportedTable";
import FinishedFilter from "./components/Finished/FinishedFilter";
import FinishedSummary from "./components/Finished/FinishedSummary";
import FinishedTable from "./components/Finished/FinishedTable";
import NotExportedFilter from "./components/NotExported/NotExportedFilter";
import NotExportedSummary from "./components/NotExported/NotExportedSummary";
import NotExportedTable from "./components/NotExported/NotExportedTable";
import PencairanExportSidebar from "./components/NotExported/PencairanExportSidebar";

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
  const [showBulkOverrideModal, setShowBulkOverrideModal] = useState(false);
  const [pendingBulkAction, setPendingBulkAction] = useState<string | null>(
    null
  );
  const [bulkAction, setBulkAction] = useState<string | null>(null);
  const [selectedCount, setSelectedCount] = useState(0);
  const [finishedDetailView, setFinishedDetailView] = useState(true);

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

  const handleBulkActionRequest = (action: string | null) => {
    if (action) {
      // If setting a new bulk action (not clearing), show warning
      setPendingBulkAction(action);
      setShowBulkOverrideModal(true);
    } else {
      // If clearing, just do it
      setBulkAction(null);
    }
  };

  const handleConfirmBulkAction = () => {
    setBulkAction(pendingBulkAction);
    setShowBulkOverrideModal(false);
    setPendingBulkAction(null);
  };

  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue);
    setShowFilter(false);
    setBulkAction(null);
    setSelectedCount(0);
    setShowExport(false);
  };

  return (
    <div className="flex flex-col gap-2.5">
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
              onClick={() => handleTabChange(tab.value)}
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

                !isFirst && !isActive && "border-l-0",
                !isFirst && isActive && "border-l-[#176CF7]" // Ensure active border shows
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Summary Section */}
      {activeTab === "Not Exported" && (
        <NotExportedSummary showExport={showExport} />
      )}
      {activeTab === "Exported" && (
        <ExportedSummary
          bulkAction={bulkAction}
          selectedCount={selectedCount}
        />
      )}
      {activeTab === "Finished" && <FinishedSummary />}

      {/* Filters Based of Tabs Active */}
      {activeTab === "Not Exported" && (
        <NotExportedFilter
          showFilter={showFilter}
          setShowFilter={setShowFilter}
          showExport={showExport}
          setShowExport={setShowExport}
        />
      )}
      {activeTab === "Exported" && (
        <ExportedFilter
          showFilter={showFilter}
          setShowFilter={setShowFilter}
          bulkAction={bulkAction}
          onBulkAction={handleBulkActionRequest}
          selectedCount={selectedCount}
        />
      )}
      {activeTab === "Finished" && (
        <FinishedFilter
          showFilter={showFilter}
          setShowFilter={setShowFilter}
          isDetailView={finishedDetailView}
        />
      )}

      {/* Tables */}
      <div className="flex w-full flex-row">
        <div className="flex-1 overflow-hidden">
          {activeTab === "Not Exported" && (
            <NotExportedTable showExport={showExport} />
          )}
          {activeTab === "Exported" && (
            <ExportedTable
              bulkAction={bulkAction}
              onSelectionChange={setSelectedCount}
            />
          )}
          {activeTab === "Finished" && (
            <FinishedTable
              isDetailView={finishedDetailView}
              setIsDetailView={setFinishedDetailView}
            />
          )}
        </div>

        <div
          className={cn(
            "grid transition-all duration-300 ease-in-out",
            showExport
              ? "grid-cols-[1fr] opacity-100"
              : "grid-cols-[0fr] opacity-0"
          )}
        >
          {activeTab === "Not Exported" && (
            <div className="overflow-hidden">
              <PencairanExportSidebar onExport={handleExport} />
            </div>
          )}
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
        isOpen={showBulkOverrideModal}
        setIsOpen={setShowBulkOverrideModal}
        variant="bo"
        title={{ text: "Pemberitahuan" }}
        description={{
          text: "Terdapat data yang telah diubah secara satuan, apabila anda melanjutkan, maka perubahan sebelumnya tidak diterapkan",
        }}
        confirm={{
          text: "Lanjut",
          onClick: handleConfirmBulkAction,
        }}
        cancel={{ text: "Batal" }}
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
