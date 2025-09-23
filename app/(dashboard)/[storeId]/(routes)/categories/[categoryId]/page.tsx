import prismadb from "@/lib/prismadb";
import CategoryFrom from "./components/category-form";

const CategoryPage = async({params}:{
   params: Promise<{ storeId: string; categoryId: string }>
}) =>{
    const resolvedParams = await params;

    const categories = await prismadb.category.findUnique({
        where:{
            id: resolvedParams.categoryId
        }
    });

    const billboards = await prismadb.billboard.findMany({
        where:{
            storeId: resolvedParams.storeId
        }
    })

    return(
            <div className="flex-col">
                    <div className="flex-1 space-y-4 p-8 pt-6">
                    <CategoryFrom initialData={categories} billboards={billboards}/>
                    </div>
            </div>
    );
}

export default CategoryPage;