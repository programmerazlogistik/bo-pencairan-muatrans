import TrxDetailContainer from "@/container/DetailPencairan/TrxDetailContainer";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function Page({ params }: PageProps) {
  const { id } = await params;
  return <TrxDetailContainer id={id} />;
}

export default Page;
