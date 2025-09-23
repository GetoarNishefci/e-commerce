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
        const { name, price, categoryId, colorId, sizeId, images, isFeatured, isArchived } = body;

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

        const product = await prismadb.product.create({
            data: {
                name,
                price,
                isArchived,
                isFeatured,
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: {url: string}) => image)
                        ]
                    }
                },
                categoryId,
                colorId,
                sizeId,
                storeId: resolvedParams.storeId
            }
        });

        return NextResponse.json(product);
    } catch (error) {
        console.log("[PRODUCTS_POST]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function GET(
    req: Request, 
    {params}:{params: Promise<{storeId: string}>}
) {
    try {
        const resolvedParams = await params;
        const { searchParams } = new URL(req.url)
        const categoryId = searchParams.get("categoryId") || undefined
        const colorId = searchParams.get("colorId") || undefined
        const isFeatured = searchParams.get("isFeatured") || undefined
        const sizeId = searchParams.get("sizeId") || undefined

        if (!resolvedParams.storeId) {
            return new NextResponse("storeId required", { status: 400 });
        }

        const products = await prismadb.product.findMany({
            where: {
                storeId: resolvedParams.storeId,
                categoryId,
                colorId,
                sizeId,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false
            },
            include: {
                images: true,
                category: true,
                color: true,
                size: true,
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return NextResponse.json(products);
    } catch (error) {
        console.log("[PRODUCTS_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}