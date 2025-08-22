import prismadb from "@/lib/prismadb";
import CategoryFrom from "./components/category-form";

const CategoryPage = async({params}:{
    params:{categoryId:string}
}) =>{

    const categories = await prismadb.category.findUnique({
        where:{
            id:params.categoryId
        }
    });

    return(
            <div className="flex-col">
                    <div className="flex-1 space-y-4 p-8 pt-6">
                    <CategoryFrom initialData={categories}/>
                    </div>
            </div>
    );
}

export default CategoryPage;