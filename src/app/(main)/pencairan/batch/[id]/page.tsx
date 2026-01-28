import BatchDetailContainer from "@/container/DetailPencairan/BatchDetailContainer";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function Page({ params }: PageProps) {
  const { id } = await params;
  return <BatchDetailContainer id={id} />;
}

export default Page;
