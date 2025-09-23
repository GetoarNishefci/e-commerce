import prismadb from "@/lib/prismadb";
import BillboardFrom from "./components/billboard-form";

interface BillboardPageProps{
    params:{
        storeId:string;
        billboardId:string;
    }
}

const BillboardsPage = async ({ params }: { params: BillboardPageProps["params"] }) => {

    const billboard = await prismadb.billboard.findUnique({
        where:{
            id:params.billboardId
        }
    });

    console.log(params.billboardId)

    return(
            <div className="flex-col">
                    <div className="flex-1 space-y-4 p-8 pt-6">
                    <BillboardFrom initialData={billboard}/>
                    </div>
            </div>
    );
}

export default BillboardsPage;