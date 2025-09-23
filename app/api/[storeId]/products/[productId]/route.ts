import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET(
    _req:Request,
    {params}:{params:Promise<{productId:string}>}
){
    try{
        const resolvedParams = await params;
        
         if(!resolvedParams.productId){
            return new NextResponse("productId id required", {status:400})
         }

         const product = await prismadb.product.findUnique({
            where:{
                id:resolvedParams.productId,
            },
            include:{
                images:true,
                category:true,
                size:true,
                color:true,
            }
         })

         return NextResponse.json(product)
          
    }catch(error){
         console.log('[PRODUCT_GET]',error)
         return new NextResponse("Internal error",{status:500})
    }
}

export async function PATCH(
    req:Request,
    {params}:{params:Promise<{storeId:string, productId:string}>}
){
    try{
        const resolvedParams = await params;
        const {userId} = await auth()
        const body = await req.json()

        const { name,price,categoryId,colorId,sizeId,images,isFeatured,isArchived } = body;

        if (!userId) {
            return new NextResponse("unauthenticated", { status: 401 });
        }

        if (!name) {
            return new NextResponse("name required", { status: 400 });
        }
        if (!price) {
            return new NextResponse("price required", { status: 400 });
        }
        if (!categoryId) {
            return new NextResponse("categoryId required", { status: 400 });
        }
        if (!colorId) {
            return new NextResponse("colorId required", { status: 400 });
        }
        if (!sizeId) {
            return new NextResponse("sizeId required", { status: 400 });
        }
        if (!images || !images.length) {
            return new NextResponse("images required", { status: 400 });
        }
     
         if(!resolvedParams.productId){
            return new NextResponse("billboard id required", {status:400})
         }

         const storeByUserId = await prismadb.store.findFirst({
            where:{
                id:resolvedParams.storeId,
                userId
            }
         })

         if(!storeByUserId){
            return new NextResponse("Unauthorized",{status:403})
         }

         await prismadb.product.update({
            where:{
                id:resolvedParams.productId,
            },
            data:{
               name,
               price,
               categoryId,
               colorId,
               sizeId,
               images:{
                deleteMany:{}
               },
               isArchived,
               isFeatured,
            }
         })

         const product = await prismadb.product.update({
            where:{
                id:resolvedParams.productId
            },
            data:{
                images:{
                    createMany:{
                        data: [ 
                            ...images.map((image:{url: string}) => image)
                        ]
                    }
                }
            }
         })

         return NextResponse.json(product)
          
    }catch(error){
         console.log('[PRODUCT_PATCH]',error)
         return new NextResponse("Internal error",{status:500})
    }
}

export async function DELETE(
    _req:Request,
    {params}:{params:Promise<{storeId:string ,productId:string}>}
){
    try{
        const resolvedParams = await params;
        const {userId} = await auth()

        if(!userId){
            return new NextResponse("Unauthenticated",{status:401})
        }

         if(!resolvedParams.productId){
            return new NextResponse("productId required", {status:400})
         }

    const storeByUserId = await prismadb.store.findFirst({
            where:{
                id:resolvedParams.storeId,
                userId
            }
         })

         if(!storeByUserId){
            return new NextResponse("Unauthorized",{status:403})
         }

         const product = await prismadb.product.deleteMany({
            where:{
                id:resolvedParams.productId,
            },
         })

         return NextResponse.json(product)
          
    }catch(error){
         console.log('[PRODUCT_DELETE]',error)
         return new NextResponse("Internal error",{status:500})
    }
}