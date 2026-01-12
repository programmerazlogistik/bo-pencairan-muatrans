import FinishedDetailContainer from "@/container/DetailPencairan/DetailContainer";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function Page({ params }: PageProps) {
  const { id } = await params;
  return <FinishedDetailContainer id={id} />;
}

export default Page;
