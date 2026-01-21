"use client";

import { useState } from "react";

import { cn } from "@muatmuat/lib/utils";
import { ConfirmationModal } from "@muatmuat/ui/Modal";

import { useNotExportedList } from "@/services/Pencairan/useNotExported";

import PageTitle from "@/components/PageTitle/PageTitle";

import { useNotExportedStore } from "@/store/Pencairan/useNotExportedStore";

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
  const [pendingExportCallback, setPendingExportCallback] = useState<
    (() => Promise<void>) | null
  >(null);

  // Store state
  const {
    filters,
    pagination,
    sorting,
    selectedIds,
    adminFees,
    reset: resetStore,
  } = useNotExportedStore();

  const {
    data: notExportedData,
    isLoading: isNotExportedLoading,
    mutate,
  } = useNotExportedList({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    ...filters,
    sortBy: sorting.length > 0 ? sorting[0].id : undefined,
    sortDir:
      sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : undefined,
  });

  // Derived state for summary
  const totalCount = notExportedData?.Pagination?.totalItems || 0;
  const totalNominal = notExportedData?.Summary?.totalValue || 0;

  const handleExportRequest = (callback: () => Promise<void>) => {
    setPendingExportCallback(() => callback);
    setShowConfirmationModal(true);
  };

  const handleConfirmExport = async () => {
    setShowConfirmationModal(false);
    if (pendingExportCallback) {
      await pendingExportCallback();
      setPendingExportCallback(null);
    }
  };

  const handleExportSuccess = (exportId: string) => {
    setShowExport(false);
    setShowSuccessModal(true);
    // Reset store after successful export
    resetStore();
    // Refresh the list
    notExportedData && mutate();
  };

  const handleExportError = (error: Error) => {
    console.error("Export failed:", error);
    // You can show an error toast here
    alert(`Export gagal: ${error.message}`);
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
    if (tabValue === "Not Exported") {
      // Optional: Reset NotExported store when entering tab?
      // Or keep state? Usually keep state unless requested.
    }
  };

  const handleFinishedViewChange = (isDetail: boolean) => {
    setFinishedDetailView(isDetail);
    setShowFilter(false);
  };

  return (
    <div className="flex flex-col gap-2.5">
      <PageTitle
        className="!mb-[0px] text-2xl"
        appearance={{ iconClassName: "text-black " }}
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
        <NotExportedSummary
          showExport={showExport}
          totalCount={totalCount}
          totalNominal={totalNominal}
          summaryData={notExportedData?.Summary}
          dataList={notExportedData?.Data}
        />
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
            <NotExportedTable
              showExport={showExport}
              data={notExportedData?.Data || []}
              paginationData={notExportedData?.Pagination}
              loading={isNotExportedLoading}
            />
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
              setIsDetailView={handleFinishedViewChange}
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
              <PencairanExportSidebar
                onExportRequest={handleExportRequest}
                onExportSuccess={handleExportSuccess}
                onExportError={handleExportError}
                dataList={notExportedData?.Data}
              />
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
