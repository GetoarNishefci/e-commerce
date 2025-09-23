import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ categoryId: string }> }
) {
    try {
        const resolvedParams = await params;
        
        if (!resolvedParams.categoryId) {
            return new NextResponse("categoryId id required", { status: 400 })
        }

        const category = await prismadb.category.findUnique({
            where: {
                id: resolvedParams.categoryId,
            },
            include: {
                billboard: true
            }
        })

        return NextResponse.json(category)

    } catch (error) {
        console.log('[CATEGORY_GET]', error)
        return new NextResponse("Internal error", { status: 500 })
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ storeId: string, categoryId: string }> }
) {
    try {
        const { userId } = await auth()
        const body = await req.json()
        const { name, billboardId } = body;
        const resolvedParams = await params;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if (!name) {
            return new NextResponse("name is required", { status: 400 });
        }
        if (!billboardId) {
            return new NextResponse("billboardId is required", { status: 400 });
        }

        if (!resolvedParams.categoryId) {
            return new NextResponse("categoryId required", { status: 400 })
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

        const category = await prismadb.category.updateMany({
            where: {
                id: resolvedParams.categoryId,
            },
            data: {
                name,
                billboardId
            }
        })

        return NextResponse.json(category)

    } catch (error) {
        console.log('[CATEGORY_PATCH]', error)
        return new NextResponse("Internal error", { status: 500 })
    }
}

export async function DELETE(
    _req: Request,
    { params }: { params: Promise<{ storeId: string, categoryId: string }> }
) {
    try {
        const { userId } = await auth()
        const resolvedParams = await params;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if (!resolvedParams.categoryId) {
            return new NextResponse("categoryId id required", { status: 400 })
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

        const category = await prismadb.category.deleteMany({
            where: {
                id: resolvedParams.categoryId,
            },
        })

        return NextResponse.json(category)

    } catch (error) {
        console.log('[CATEGORY_DELETE]', error)
        return new NextResponse("Internal error", { status: 500 })
    }
}