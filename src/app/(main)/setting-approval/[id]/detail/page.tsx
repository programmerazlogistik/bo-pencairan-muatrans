"use client";

import { useParams } from "next/navigation";

import DetailSettingApprovalContainer from "@/container/SettingApproval/Detail/DetailSettingApproval";

export default function Page() {
  const params = useParams();
  const configId = params.id as string;

  return <DetailSettingApprovalContainer configId={configId} />;
}
