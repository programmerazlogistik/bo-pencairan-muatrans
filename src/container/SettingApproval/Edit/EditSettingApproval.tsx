"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@muatmuat/ui/Button";
import { ConfirmationModal } from "@muatmuat/ui/Modal";

import { useGetDetailApprovalConfig } from "@/services/settingApproval/getDetailApprovalConfig";
import {
  UpdateApprovalConfigRequest,
  useUpdateApprovalConfig,
} from "@/services/settingApproval/updateApprovalConfig";

import PageTitle from "@/components/PageTitle/PageTitle";

import ApprovalField from "../components/ApprovalField";
import MenuSelect from "../components/MenuSelect";
import ModuleSelect from "../components/ModuleSelect";
import NamaMenuInput from "../components/NamaMenuInput";
import QueryDetailInput from "../components/QueryDetailInput";
import QueryInput from "../components/QueryInput";

interface EditSettingApprovalContainerProps {
  configId?: string;
  initialData?: {
    module: string;
    menu: string;
    namaMenu: string;
    query: string;
    queryDetail: string;
  };
  initialApprovalFields?: {
    id: number;
    value: string;
    logic: string;
  }[];
}

export default function EditSettingApprovalContainer({
  configId,
  initialData,
  initialApprovalFields,
}: EditSettingApprovalContainerProps) {
  const router = useRouter();

  // Use API data if configId is provided, otherwise use initialData
  const { data, isLoading, error } = useGetDetailApprovalConfig(configId || "");

  const {
    updateApprovalConfig,
    isLoading: isUpdating,
    error: updateError,
  } = useUpdateApprovalConfig();

  // Transform the API response to match the container's expected format
  const transformedData = data
    ? {
        module: data.moduleId || "",
        menu: data.menuId || "",
        namaMenu: data.name || "",
        query: data.queryList ? JSON.stringify(data.queryList, null, 2) : "",
        queryDetail: data.queryDetails
          ? JSON.stringify(data.queryDetails, null, 2)
          : "",
      }
    : initialData || {
        module: "",
        menu: "",
        namaMenu: "",
        query: "",
        queryDetail: "",
      };

  // Transform approvals to match expected format
  const transformedApprovalFields = data?.approvals
    ? data.approvals.map((approval, index) => ({
        id: index + 1,
        value: `${approval.type}-${approval.type === "user" ? approval.userId : approval.positionId}`,
        logic: approval.operator || "",
      }))
    : initialApprovalFields || [{ id: 1, value: "", logic: "" }];

  const [formData, setFormData] = useState({
    ...transformedData,
    approvals: [],
  });

  const [approvalFields, setApprovalFields] = useState(
    transformedApprovalFields
  );

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  // Update formData.approvals whenever approvalFields change
  useEffect(() => {
    const approvals = approvalFields
      .filter((field) => field.value.trim() !== "")
      .map((field) => {
        // Parse the type and ID from the selected value
        const separatorIndex = field.value.indexOf("-");
        const type =
          separatorIndex !== -1
            ? field.value.substring(0, separatorIndex)
            : field.value;
        const id =
          separatorIndex !== -1
            ? field.value.substring(separatorIndex + 1)
            : undefined;

        if (type === "user") {
          return {
            type: "user" as const,
            userId: id,
            operator: (field.logic as "AND" | "OR") || undefined,
          };
        } else if (type === "position") {
          return {
            type: "position" as const,
            positionId: id,
            operator: (field.logic as "AND" | "OR") || undefined,
          };
        }

        // Default case - should not happen if values are properly formatted
        return {
          type: "user" as const,
          userId: field.value,
          operator: (field.logic as "AND" | "OR") || undefined,
        };
      });

    setFormData((prev) => ({
      ...prev,
      approvals,
    }));
  }, [approvalFields]);

  // Update form data when API data changes
  useEffect(() => {
    if (data && configId) {
      const newApprovalFields = data.approvals?.map((approval, index) => ({
        id: index + 1,
        value: `${approval.type}-${approval.type === "user" ? approval.userId : approval.positionId}`,
        logic: approval.operator || "",
      })) || [{ id: 1, value: "", logic: "" }];

      const newFormData = {
        module: data.moduleId || "",
        menu: data.menuId || "",
        namaMenu: data.name || "",
        query: data.queryList ? JSON.stringify(data.queryList, null, 2) : "",
        queryDetail: data.queryDetails
          ? JSON.stringify(data.queryDetails, null, 2)
          : "",
        approvals: [], // This will be handled by the approvalFields state
      };

      setApprovalFields(newApprovalFields);
      setFormData(newFormData);
    }
  }, [data, configId]);

  if (configId && isLoading) {
    return <div>Loading...</div>;
  }

  if (configId && error) {
    return <div>Error: {error.message}</div>;
  }

  if (updateError) {
    console.error("Update error:", updateError);
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddApprovalField = () => {
    const newId = Date.now();
    setApprovalFields([...approvalFields, { id: newId, value: "", logic: "" }]);
  };

  const handleUpdateApprovalField = (
    id: number,
    field: "value" | "logic",
    newValue: string
  ) => {
    setApprovalFields(
      approvalFields.map((item) =>
        item.id === id ? { ...item, [field]: newValue } : item
      )
    );
  };

  const handleRemoveApprovalField = (id: number) => {
    if (approvalFields.length > 1) {
      setApprovalFields(approvalFields.filter((field) => field.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Show confirmation modal instead of directly submitting
    setShowConfirmationModal(true);
  };

  return (
    <div>
      <PageTitle className="text-2xl">Ubah Setting Approval My Task</PageTitle>

      <div className="mt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            <ModuleSelect
              value={formData.module}
              onChange={(value) => handleInputChange("module", value)}
            />

            <MenuSelect
              value={formData.menu}
              onChange={(value) => handleInputChange("menu", value)}
              moduleId={formData.module} // Pass the selected module ID to filter menus
            />

            <NamaMenuInput
              value={formData.namaMenu}
              onChange={(value) => handleInputChange("namaMenu", value)}
            />

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="md:col-span-3">
                <div className="space-y-4 pt-2">
                  {approvalFields.map((field, index) => (
                    <ApprovalField
                      key={field.id}
                      id={field.id}
                      index={index}
                      value={field.value}
                      logic={field.logic}
                      totalFields={approvalFields.length}
                      isLast={index === approvalFields.length - 1}
                      onValueChange={(value) =>
                        handleUpdateApprovalField(field.id, "value", value)
                      }
                      onLogicChange={(value) =>
                        handleUpdateApprovalField(field.id, "logic", value)
                      }
                      onRemove={() => handleRemoveApprovalField(field.id)}
                      onAdd={handleAddApprovalField}
                    />
                  ))}
                </div>
              </div>
            </div>

            <QueryInput
              value={formData.query}
              onChange={(value) => handleInputChange("query", value)}
            />

            <QueryDetailInput
              value={formData.queryDetail}
              onChange={(value) => handleInputChange("queryDetail", value)}
            />
          </div>

          <div className="flex justify-center space-x-3 pt-4">
            <Button
              type="submit"
              variant="muatparts-primary"
              className="h-10"
              disabled={isUpdating}
            >
              Simpan
            </Button>
          </div>
          {/* Debug: Display form data */}
          {/* <pre className="mb-4 overflow-auto rounded bg-gray-100 p-4 text-xs">
            {JSON.stringify(formData, null, 2)}
          </pre> */}
        </form>
      </div>
      <ConfirmationModal
        variant="bo"
        isOpen={showConfirmationModal}
        setIsOpen={setShowConfirmationModal}
        title={{ text: "Pemberitahuan" }}
        description={{ text: "Apakah anda yakin akan menyimpan data?" }}
        confirm={{
          text: "Simpan",
          onClick: async () => {
            if (!configId) return;

            // Parse JSON strings back to objects for API
            let parsedQueryList: { query: string };
            let parsedQueryDetails: { query: string };
            try {
              parsedQueryList = formData.query
                ? JSON.parse(formData.query)
                : { query: "" };
              parsedQueryDetails = formData.queryDetail
                ? JSON.parse(formData.queryDetail)
                : { query: "" };
            } catch (e) {
              console.error("Failed to parse query JSON:", e);
              return;
            }

            // Transform data for API
            const payload: UpdateApprovalConfigRequest = {
              moduleId: formData.module,
              menuId: formData.menu,
              name: formData.namaMenu,
              queryList: parsedQueryList,
              queryDetails: parsedQueryDetails,
              approvals: formData.approvals,
            };

            try {
              await updateApprovalConfig({
                configId,
                approvalConfig: payload,
              });
              // Handle successful submission
              setShowConfirmationModal(false);
              router.push("/setting-approval");
            } catch (err) {
              console.error("Failed to update approval config:", err);
              // Ideally show a toast or error message here
              setShowConfirmationModal(false);
            }
          },
        }}
        cancel={{
          text: "Batal",
          onClick: () => {
            setShowConfirmationModal(false);
          },
        }}
      />
    </div>
  );
}
