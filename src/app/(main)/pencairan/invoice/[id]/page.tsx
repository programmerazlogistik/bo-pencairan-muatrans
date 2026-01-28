import InvoiceDetailContainer from "@/container/DetailPencairan/InvoiceDetailContainer";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function Page({ params }: PageProps) {
  const { id } = await params;
  return <InvoiceDetailContainer id={id} />;
}

export default Page;
