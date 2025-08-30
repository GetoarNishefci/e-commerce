"use client"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { columns, OrderColumn } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"

interface OrderClientProps {
    data: OrderColumn[]
}

export const OrderClient: React.FC<OrderClientProps> = ({
    data
})=>{

    return(
        <>
    <div className="flex items-center justify-between">
        <Heading title={`Orders (${data.length})`} description="Managed orders for your store"/>
    </div>
    <Separator/>
    <DataTable columns={columns} data={data} searchKey="products"/>  
    </>
    )
}