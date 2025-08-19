import prismadb from "@/lib/prismadb";
import BillboardFrom from "./components/billboard-form";

const BillboardsPage = async({params}:{
    params:{billboardId:string}
}) =>{

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