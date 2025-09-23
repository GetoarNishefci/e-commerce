import prismadb from "@/lib/prismadb";
import SizeFrom from "./components/size-form";

const SizesPage = async({params}:{
params: Promise<{ storeId: string; sizeId: string }>}) =>{

    const resolvedParams = await params

    const Sizes = await prismadb.size.findUnique({
        where:{
            id:resolvedParams.sizeId
        }
    });

    return(
            <div className="flex-col">
                    <div className="flex-1 space-y-4 p-8 pt-6">
                    <SizeFrom initialData={Sizes}/>
                    </div>
            </div>
    );
}

export default SizesPage;