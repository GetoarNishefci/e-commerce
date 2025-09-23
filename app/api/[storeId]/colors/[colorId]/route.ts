import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET(
    _req:Request,
    {params}:{params:Promise<{colorId:string}>}
){
    try{
        const resolvedParams = await params;
        
         if(!resolvedParams.colorId){
            return new NextResponse("colorId required", {status:400})
         }

         const colors = await prismadb.color.findUnique({
            where:{
                id:resolvedParams.colorId,
            },
         })

         return NextResponse.json(colors)
          
    }catch(error){
         console.log('[COLORS_GET]',error)
         return new NextResponse("Internal error",{status:500})
    }
}

export async function PATCH(
    req:Request,
    {params}:{params:Promise<{storeId:string, colorId:string}>}
){
    try{
        const resolvedParams = await params;
        const {userId} = await auth()
        const body = await req.json()

        const {name,value} = body;

        if(!userId){
            return new NextResponse("Unauthenticated",{status:401})
        }

        if(!name){
            return new NextResponse("name is required",{status:400});
        }
           if(!value){
            return new NextResponse("value is required",{status:400});
        }

         if(!resolvedParams.colorId){
            return new NextResponse("colorId required", {status:400})
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

         const color = await prismadb.color.updateMany({
            where:{
                id:resolvedParams.colorId,
            },
            data:{
                name,
                value
            }
         })

         return NextResponse.json(color)
          
    }catch(error){
         console.log('[COLORS_PATCH]',error)
         return new NextResponse("Internal error",{status:500})
    }
}

export async function DELETE(
    _req:Request,
    {params}:{params:Promise<{storeId:string ,colorId:string}>}
){
    try{
        const resolvedParams = await params;
        const {userId} = await auth()

        if(!userId){
            return new NextResponse("Unauthenticated",{status:401})
        }

         if(!resolvedParams.colorId){
            return new NextResponse("colorId required", {status:400})
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

         const colors = await prismadb.color.deleteMany({
            where:{
                id:resolvedParams.colorId,
            },
         })

         return NextResponse.json(colors)
          
    }catch(error){
         console.log('[COLORS_DELETE]',error)
         return new NextResponse("Internal error",{status:500})
    }
}