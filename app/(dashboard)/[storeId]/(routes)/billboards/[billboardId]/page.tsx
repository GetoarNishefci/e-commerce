import prismadb from "@/lib/prismadb";
import BillboardForm from "./components/billboard-form";

interface Params {
  storeId: string;
  billboardId: string;
}

const BillboardsPage = async ({
  params,
}: {
  params: Promise<Params>;
}) => {
    
  const resolvedParams = await params;
  
  const billboard = await prismadb.billboard.findUnique({
    where: {
      id: resolvedParams.billboardId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  );
};

export default BillboardsPage;