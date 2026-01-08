"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Button } from "@muatmuat/ui/Button";
import { ConfirmationModal } from "@muatmuat/ui/Modal";
import { DataTableBO } from "@muatmuat/ui/Table";
import { ColumnDef, SortingState } from "@tanstack/react-table";

import { useDeleteApprovalConfig } from "@/services/settingApproval/deleteApprovalConfig";
import { useGetAllApprovalConfigs } from "@/services/settingApproval/getAllApprovalConfigs";

import { ActionDropdown } from "@/components/Dropdown/ActionDropdown";
import PageTitle from "@/components/PageTitle/PageTitle";

export default function SettingApprovalContainer() {
  const router = useRouter();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    configId: null as string | null,
  });

  // Delete service
  const {
    deleteApprovalConfig,
    isLoading: isDeleting,
    error: deleteError,
  } = useDeleteApprovalConfig();

  // Convert to API params format
  const apiParams = useMemo(() => {
    let sortBy:
      | "newest"
      | "oldest"
      | "menu_asc"
      | "menu_desc"
      | "module_asc"
      | "module_desc"
      | undefined;

    if (sorting.length > 0) {
      const sort = sorting[0];
      if (sort.id === "menu") {
        sortBy = sort.desc ? "menu_desc" : "menu_asc";
      } else if (sort.id === "modul") {
        sortBy = sort.desc ? "module_desc" : "module_asc";
      }
    }

    return {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      search: searchTerm,
      sortBy,
    };
  }, [pagination.pageIndex, pagination.pageSize, searchTerm, sorting]);

  const {
    data: apiData,
    error,
    isLoading,
    mutate,
  } = useGetAllApprovalConfigs(apiParams);

  // Map API response to UI format
  const data = useMemo(() => {
    if (!apiData?.items) return [];

    return apiData.items.map((item) => ({
      id: item.id || 0,
      action: "Edit",
      modul: item.moduleName || "",
      menu: item.menuName || "",
      approval: item.approvals || [],
    }));
  }, [apiData]);

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "action",
        header: "Action",
        enableSorting: false,
        cell: ({ row }) => {
          const approvalSetting = row.original;

          const actions = [
            {
              title: "Ubah",
              onClick: () =>
                router.push(`/setting-approval/${approvalSetting.id}/ubah`),
            },
            {
              title: "Detail",
              onClick: () =>
                router.push(`/setting-approval/${approvalSetting.id}/detail`),
            },
            {
              title: "Hapus",
              onClick: () => {
                // Get the original item to get the actual ID
                const originalItem = apiData?.items?.find(
                  (item) => parseInt(item.id) === approvalSetting.id
                );

                if (originalItem) {
                  setDeleteModal({
                    isOpen: true,
                    configId: originalItem.id,
                  });
                }
              },
              className: "text-red-500",
            },
          ];

          return (
            <div className="relative">
              <ActionDropdown.Root>
                <ActionDropdown.Trigger>Atur</ActionDropdown.Trigger>
                <ActionDropdown.Content>
                  {actions.map((item) => (
                    <ActionDropdown.Item
                      key={item.title}
                      onClick={item.onClick}
                      className={item.className}
                    >
                      {item.title}
                    </ActionDropdown.Item>
                  ))}
                </ActionDropdown.Content>
              </ActionDropdown.Root>
            </div>
          );
        },
      },
      {
        accessorKey: "modul",
        header: "Modul",
        enableSorting: true,
      },
      {
        accessorKey: "menu",
        header: "Menu",
        enableSorting: true,
      },
      {
        accessorKey: "approval",
        header: "Approval",
        enableSorting: true,
        cell: ({ row }) => (
          <div>
            {row.original.approval.map((item, index) => (
              <div key={index}>{item}</div>
            ))}
          </div>
        ),
      },
    ],
    [router, apiData?.items, deleteApprovalConfig, mutate]
  );

  const paginationData = {
    currentPage: apiData?.pagination?.currentPage || 1,
    itemsPerPage: apiData?.pagination?.perPage || 10,
    totalItems: apiData?.pagination?.totalItems || 0,
    totalPages: apiData?.pagination?.totalPages || 1,
  };

  const AddButton = ({ onClick }) => (
    <Button
      variant="muatparts-primary-secondary"
      className="h-8 rounded-[20px] text-sm font-semibold"
      onClick={onClick}
    >
      + Tambah
    </Button>
  );

  return (
    <div>
      <PageTitle className="text-2xl">Setting Approval My Task</PageTitle>
      <div className="flex w-full justify-end">
        <AddButton
          onClick={() => {
            router.push("/setting-approval/add");
          }}
        />
      </div>

      <div className="mt-6">
        <DataTableBO.Root
          data={data}
          columns={columns}
          pagination={pagination}
          onPaginationChange={setPagination}
          sorting={sorting}
          onSortingChange={setSorting}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          paginationData={paginationData}
        >
          <DataTableBO.Content />
          <DataTableBO.Pagination />
        </DataTableBO.Root>
      </div>

      {/* Confirmation Modal for Delete Action */}
      <ConfirmationModal
        variant="bo"
        isOpen={deleteModal.isOpen}
        setIsOpen={(open) => setDeleteModal({ ...deleteModal, isOpen: open })}
        title={{ text: "Hapus Setting Approval" }}
        description={{
          text: "Apakah Anda yakin ingin menghapus setting approval ini?",
        }}
        cancel={{
          text: "Batal",
          onClick: () => setDeleteModal({ isOpen: false, configId: null }),
        }}
        confirm={{
          text: "Hapus",
          onClick: async () => {
            if (deleteModal.configId) {
              try {
                await deleteApprovalConfig({ configId: deleteModal.configId });
                await mutate();
                setDeleteModal({ isOpen: false, configId: null });
              } catch (error) {
                console.error("Error deleting approval config:", error);
              }
            }
          },
        }}
      />
    </div>
  );
}
