"use client";

import { useGetDetailApprovalConfig } from "@/services/settingApproval/getDetailApprovalConfig";

import PageTitle from "@/components/PageTitle/PageTitle";

import ApprovalField from "../components/ApprovalField";
import MenuSelect from "../components/MenuSelect";
import ModuleSelect from "../components/ModuleSelect";
import NamaMenuInput from "../components/NamaMenuInput";
import QueryDetailInput from "../components/QueryDetailInput";
import QueryInput from "../components/QueryInput";

interface DetailSettingApprovalContainerProps {
  configId?: string;
  initialData?: {
    module: string;
    menu: string;
    namaMenu: string;
    approval: string;
    query: string;
    queryDetail: string;
  };
  initialApprovalFields?: {
    id: number;
    value: string;
    label?: string;
    logic: string;
  }[];
}

export default function DetailSettingApprovalContainer({
  configId,
  initialData,
  initialApprovalFields,
}: DetailSettingApprovalContainerProps) {
  // Use API data if configId is provided, otherwise use initialData
  const { data, isLoading, error } = useGetDetailApprovalConfig(configId || "");

  // Transform the API response to match the container's expected format
  const transformedData = data
    ? {
        module: data.moduleId || "",
        menu: data.menuName || "",
        namaMenu: data.name || "",
        approval: "", // This might need to be derived from approvals array
        query: data.queryList ? JSON.stringify(data.queryList, null, 2) : "",
        queryDetail: data.queryDetails
          ? JSON.stringify(data.queryDetails, null, 2)
          : "",
      }
    : initialData || {
        module: "",
        menu: "",
        namaMenu: "",
        approval: "",
        query: "",
        queryDetail: "",
      };

  // Transform approvals to match expected format
  const transformedApprovalFields = data?.approvals
    ? data.approvals.map((approval, index) => ({
        id: index + 1,
        value: `${approval.type}-${approval.type === "user" ? approval.userId : approval.positionId}`,
        label:
          approval.type === "user"
            ? `User - ${approval.userName || ""}`
            : `Jabatan - ${approval.positionName || ""}`,
        logic: approval.operator || "",
      }))
    : initialApprovalFields || [{ id: 1, value: "", logic: "" }];

  if (configId && isLoading) {
    return <div>Loading...</div>;
  }

  if (configId && error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <PageTitle className="text-2xl">
        Detail Setting Approval My Task
      </PageTitle>

      <div className="mt-6">
        <div className="space-y-6">
          <ModuleSelect value={transformedData.module} isDisabled={true} />

          <MenuSelect
            value={transformedData.menu}
            isDisabled={true}
            moduleId={transformedData.module}
          />

          <NamaMenuInput value={transformedData.namaMenu} isDisabled={true} />

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="md:col-span-3">
              <div className="space-y-4 pt-2">
                {transformedApprovalFields.map((field, index) => (
                  <ApprovalField
                    key={field.id}
                    id={field.id}
                    index={index}
                    value={field.value}
                    label={field.label}
                    logic={field.logic}
                    totalFields={transformedApprovalFields.length}
                    isLast={index === transformedApprovalFields.length - 1}
                    isDisabled={true}
                  />
                ))}
              </div>
            </div>
          </div>

          <QueryInput value={transformedData.query} isDisabled={true} />

          <QueryDetailInput
            value={transformedData.queryDetail}
            isDisabled={true}
          />
        </div>
      </div>
    </div>
  );
}
