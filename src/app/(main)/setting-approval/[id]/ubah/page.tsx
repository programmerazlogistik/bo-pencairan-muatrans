"use client";

import { useParams } from "next/navigation";

import EditSettingApprovalContainer from "@/container/SettingApproval/Edit/EditSettingApproval";

export default function Page() {
  const params = useParams();
  const configId = params.id as string;

  return <EditSettingApprovalContainer configId={configId} />;
}
