"use client"

import { AlertModal } from "@/components/modals/alert-modal";
import { ApiAlert } from "@/components/ui/api-alert";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useOrigin } from "@/hooks/use-origin";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams,useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";

interface   CategoryFromProps{
    initialData:Category | null;
}

const formSchema = z.object({
  name:z.string().min(1),
  billboardId:z.string().min(1)
});
 
type CategoryFromValues = z.infer<typeof formSchema>


const CategoryFrom:React.FC<CategoryFromProps> = ({
    initialData
}) =>{
    const params = useParams()
    const router = useRouter()
    const [open,setOpen] = useState(false)
    const [loading,setLoading] =useState(false)
    const origin = useOrigin()

    const title = initialData ? 'Edit Category' : "Create Category"
    const description = initialData ? 'Edit Category' : "Create Category"
    const toastMesage = initialData ? 'Category updated' : "Category Created."
    const action = initialData ? 'Save Changes' : "Create"

const form = useForm<CategoryFromValues>({
    resolver:zodResolver(formSchema),
    defaultValues:initialData || {name:'',billboardId:"",},
});

const onSubmit = async (data:CategoryFromValues)=>{

    try{
        setLoading(true)
        if(initialData){
        await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`,data)
        }
        else{
            await axios.post(`/api/${params.storeId}/billboards`,data)

        }
        router.refresh()
        router.push(`/${params.storeId}/billboards`)
        toast.success(toastMesage)
    }catch{
            toast.error('Something went wrong.')
    }finally{
        setLoading(false)
    }

}

const onDelete = async () =>{
    try{
        setLoading(true)
        await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`)
        router.refresh()
        router.push("/")
        toast.success("Billboard deleted.")     
    }catch{
        toast.error("Make sure you removed all categories using this billboard first.")
    }
    finally{
        setLoading(false)
        setOpen(false)
    }
}

 return (
    <>
    <AlertModal isOpen={open} onClose={()=>setOpen(false)} onConfirm={onDelete} loading={loading}/>
    <div className="flex items-center justify-between">
<Heading title={title} description={description}/>
{initialData && (
<Button disabled={loading} variant="destructive" size="sm" onClick={()=>{setOpen(true)}}>
<Trash className="h-4 w-4"/>
</Button>
    )}
    </div>

    <Separator/>

    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        
        <div className="grid grid-cols-3 gap-8">
            <FormField control={form.control} name="name" render={({field})=>(
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                    <Input disabled={loading} placeholder="Cateogry Name" {...field}/>
                </FormControl>
                <FormMessage/>  
              </FormItem>  
            )} />
            </div>     
            <Button disabled={loading} className="ml-auto" typeof="submit">{action}</Button>      
        </form>
            <Separator/>
    </Form>
    </>
 )   
}

export default CategoryFrom