"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@muatmuat/ui/Button";
import { ConfirmationModal } from "@muatmuat/ui/Modal";

import { useCreateApprovalConfig } from "@/services/settingApproval/createApprovalConfig";

import PageTitle from "@/components/PageTitle/PageTitle";

import { sweetAlert } from "@/lib/sweetAlert";

import ApprovalField from "../components/ApprovalField";
import MenuSelect from "../components/MenuSelect";
import ModuleSelect from "../components/ModuleSelect";
import NamaMenuInput from "../components/NamaMenuInput";
import QueryDetailInput from "../components/QueryDetailInput";
import QueryInput from "../components/QueryInput";

export default function AddSettingApprovalContainer() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    module: "",
    menu: "",
    namaMenu: "",
    approvals: [],
    query: "",
    queryDetail: "",
  });

  const [approvalFields, setApprovalFields] = useState([
    { id: 1, value: "", logic: "" },
  ]);

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showEmptyFieldModal, setShowEmptyFieldModal] = useState(false);
  // const [showSelectQueryModal, setShowSelectQueryModal] = useState(false);
  const [showMenuDuplicateModal, setShowMenuDuplicateModal] = useState(false);
  const [showInvalidQueryModal, setShowInvalidQueryModal] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const { createApprovalConfig, isLoading } = useCreateApprovalConfig();

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

    // Check if any required fields are empty
    if (
      !formData.module ||
      !formData.menu ||
      !formData.namaMenu ||
      !formData.query ||
      !formData.queryDetail
    ) {
      // Show empty field modal
      setShowEmptyFieldModal(true);
      return;
    }

    // Check if approval fields are empty
    const hasApprovalData = approvalFields.some(
      (field) => field.value.trim() !== "" || field.logic.trim() !== ""
    );
    if (!hasApprovalData) {
      // Show empty field modal
      setShowEmptyFieldModal(true);
      return;
    }

    // Check if query starts with SELECT (case insensitive)
    // const trimmedQuery = formData.query.trim();
    // if (trimmedQuery && !trimmedQuery.toUpperCase().startsWith("SELECT")) {
    //   // Show SELECT query modal
    //   setShowSelectQueryModal(true);
    //   return;
    // }

    // Show confirmation modal instead of directly submitting
    setShowConfirmationModal(true);
  };

  return (
    <div>
      <PageTitle className="text-2xl">
        Tambah Setting Approval My Task
      </PageTitle>

      <div className="mt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            <ModuleSelect
              value={formData.module}
              onChange={(value) => handleInputChange("module", value)}
              isDisabled={isDisabled}
            />

            <MenuSelect
              value={formData.menu}
              onChange={(value) => handleInputChange("menu", value)}
              isDisabled={isDisabled}
              moduleId={formData.module} // Pass the selected module ID to filter menus
            />

            <NamaMenuInput
              value={formData.namaMenu}
              onChange={(value) => handleInputChange("namaMenu", value)}
              isDisabled={isDisabled}
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
                      isDisabled={isDisabled}
                    />
                  ))}
                </div>
              </div>
            </div>

            <QueryInput
              value={formData.query}
              onChange={(value) => handleInputChange("query", value)}
              isDisabled={isDisabled}
            />

            <QueryDetailInput
              value={formData.queryDetail}
              onChange={(value) => handleInputChange("queryDetail", value)}
              isDisabled={isDisabled}
            />
          </div>

          <div className="flex justify-center space-x-3 pt-4">
            <Button type="submit" variant="muatparts-primary" className="h-10">
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
            // Handle form submission
            try {
              // Parse query and queryDetail as JSON objects
              let parsedQueryList: { query: string };
              let parsedQueryDetails: { query: string };

              try {
                parsedQueryList = JSON.parse(formData.query);
              } catch {
                setShowConfirmationModal(false);
                setShowInvalidQueryModal(true);
                return;
              }

              try {
                parsedQueryDetails = JSON.parse(formData.queryDetail);
              } catch {
                setShowConfirmationModal(false);
                setShowInvalidQueryModal(true);
                return;
              }

              // Prepare the API payload
              const approvalConfigData = {
                moduleId: formData.module,
                menuId: formData.menu,
                name: formData.namaMenu,
                queryList: parsedQueryList,
                queryDetails: parsedQueryDetails,
                approvals: formData.approvals,
              };

              // Set loading state
              setIsDisabled(true);

              // Call the API
              const result = await createApprovalConfig(approvalConfigData);
              setShowConfirmationModal(false);
              sweetAlert(`Berhasil Menyimpan Data`, "OK");
              router.push("/setting-approval");
            } catch (error) {
              console.error("Error creating approval config:", error);

              setShowConfirmationModal(false);
            } finally {
              setIsDisabled(false);
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

      <ConfirmationModal
        variant="bo"
        isOpen={showEmptyFieldModal}
        setIsOpen={setShowEmptyFieldModal}
        title={{ text: "Warning" }}
        description={{ text: "Terdapat field yang kosong" }}
        confirm={{
          text: "OK",
          onClick: () => {
            setShowEmptyFieldModal(false);
          },
        }}
        withCancel={false}
      />

      {/* <ConfirmationModal
        variant="bo"
        isOpen={showSelectQueryModal}
        setIsOpen={setShowSelectQueryModal}
        title={{ text: "Warning" }}
        description={{ text: "Hanya query SELECT yang dapat ditambahkan" }}
        confirm={{
          text: "OK",
          onClick: () => {
            setShowSelectQueryModal(false);
          },
        }}
        withCancel={false}
      /> */}

      <ConfirmationModal
        variant="bo"
        isOpen={showMenuDuplicateModal}
        setIsOpen={setShowMenuDuplicateModal}
        title={{ text: "Warning" }}
        description={{ text: "Menu telah ditambahkan sebelumnya" }}
        confirm={{
          text: "OK",
          onClick: () => {
            setShowMenuDuplicateModal(false);
          },
        }}
        withCancel={false}
      />

      <ConfirmationModal
        variant="bo"
        isOpen={showInvalidQueryModal}
        setIsOpen={setShowInvalidQueryModal}
        title={{ text: "Warning" }}
        description={{ text: "Invalid Query" }}
        confirm={{
          text: "OK",
          onClick: () => {
            setShowInvalidQueryModal(false);
          },
        }}
        withCancel={false}
      />
    </div>
  );
}
