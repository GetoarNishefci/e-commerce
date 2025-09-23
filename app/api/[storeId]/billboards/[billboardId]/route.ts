import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET(
    _req:Request,
    {params}:{params:Promise<{billboardId:string}>}
){

    const resolvedParams = await params;
    try{
         if(!resolvedParams.billboardId){
            return new NextResponse("billboard id required", {status:400})
         }

         const billboard = await prismadb.billboard.findUnique({
            where:{
                id:resolvedParams.billboardId,
            },
         })

         return NextResponse.json(billboard)
          
    }catch(error){
         console.log('[BILLBOARD_GET]',error)
         return new NextResponse("Internal error",{status:500})
    }
}

export async function PATCH(
    req:Request,
    {params}:{params:Promise<{storeId:string, billboardId:string}>}
){

    const resolvedParams = await params;
    try{
        const {userId} = await auth()
const body = await req.json()

const {label,imageUrl} = body;

        if(!userId){
            return new NextResponse("Unauthenticated",{status:401})
        }

        if(!label){
            return new NextResponse("label is required",{status:400});
        }
           if(!imageUrl){
            return new NextResponse("imageUrl is required",{status:400});
        }

         if(!resolvedParams.billboardId){
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

         const billboard = await prismadb.billboard.updateMany({
            where:{
                id:resolvedParams.billboardId,
            },
            data:{
                label,
                imageUrl
            }
         })

         return NextResponse.json(billboard)
          
    }catch(error){
         console.log('[BILLBOARD_PATCH]',error)
         return new NextResponse("Internal error",{status:500})
    }
}

export async function DELETE(
    _req:Request,
    {params}:{params:Promise<{storeId:string ,billboardId:string}>}
){

    const resolvedParams = await params;
    try{
        const {userId} = await auth()

        if(!userId){
            return new NextResponse("Unauthenticated",{status:401})
        }

         if(!resolvedParams.billboardId){
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

         const billboard = await prismadb.billboard.deleteMany({
            where:{
                id:resolvedParams.billboardId,
            },
         })

         return NextResponse.json(billboard)
          
    }catch(error){
         console.log('[BILLBOARD_DELETE]',error)
         return new NextResponse("Internal error",{status:500})
    }
}