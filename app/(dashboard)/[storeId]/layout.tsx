import Navbar from "@/components/navbar";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
    params
}:{
    children:React.ReactNode;
    params:Promise<{storeId:string}>;
}){

    const resolvedParams= await params;
    const {userId} = await auth();

    if(!userId){
        redirect('/sign-in');
    }

         if (process.env.NODE_ENV === 'development') {
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    const store = await prismadb.store.findFirst({
        where:{
            id:resolvedParams.storeId,
            userId,
        }
    })

    if(!store){
        redirect('/')
    }

    return (
        <>
        <Navbar />
        {children}
        </>
    )
}