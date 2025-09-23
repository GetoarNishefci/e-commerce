import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
    req: Request, 
    {params}:{params: Promise<{storeId: string}>}
) {
    try {
        const resolvedParams = await params;
        const { userId } = await auth();
        const body = await req.json();
        const { name, value } = body;

        if (!userId) {
            return new NextResponse("unauthenticated", { status: 401 });
        }

        if (!name) {
            return new NextResponse("name required", { status: 400 });
        }
        if (!value) {
            return new NextResponse("value required", { status: 400 });
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
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const colors = await prismadb.color.create({
            data: {
                name,
                value,
                storeId: resolvedParams.storeId
            }
        });

        return NextResponse.json(colors);
    } catch (error) {
        console.log("[COLOR_POST]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function GET(
    req: Request, 
    {params}:{params: Promise<{storeId: string}>}
) {
    try {
        const resolvedParams = await params;
        
        if (!resolvedParams.storeId) {
            return new NextResponse("storeId required", { status: 400 });
        }
        
        const colors = await prismadb.color.findMany({
            where: {
                storeId: resolvedParams.storeId
            }
        });

        return NextResponse.json(colors);
    } catch (error) {
        console.log("[COLORS_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}