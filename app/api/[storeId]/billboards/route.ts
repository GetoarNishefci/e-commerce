import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request, {params}: {params: Promise<{storeId: string}>}) {
    try {
        const { userId } = await auth();
        const body = await req.json();
        const { label, imageUrl } = body;
        const resolvedParams = await params;

        if (!userId) {
            return new NextResponse("unauthenticated", { status: 401 });
        }

        if (!label) {
            return new NextResponse("label required", { status: 400 });
        }
        if (!imageUrl) {
            return new NextResponse("imageUrl required", { status: 400 });
        }
        if (!resolvedParams.storeId) {
            return new NextResponse("storeId required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: resolvedParams.storeId,
                userId
            }
        })

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 })
        }

        const billboard = await prismadb.billboard.create({
            data: {
                label,
                imageUrl,
                storeId: resolvedParams.storeId
            }
        });

        return NextResponse.json(billboard);
    } catch (error) {
        console.log("[Billboards_POST]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function GET(req: Request, {params}: {params: Promise<{storeId: string}>}) {
    try {
        const resolvedParams = await params;
        
        if (!resolvedParams.storeId) {
            return new NextResponse("storeId required", { status: 400 });
        }
        
        const billboards = await prismadb.billboard.findMany({
            where: {
                storeId: resolvedParams.storeId
            }
        });

        return NextResponse.json(billboards);
    } catch (error) {
        console.log("[Billboards_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}