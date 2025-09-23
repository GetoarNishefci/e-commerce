"use client"

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Size } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams,useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";

interface SizeFromProps{
    initialData:Size | null;
}

const formSchema = z.object({
  name:z.string().min(1),
  value:z.string().min(1)
});
 
type SizeFromValues = z.infer<typeof formSchema>


const SizeFrom:React.FC<SizeFromProps> = ({
    initialData
}) =>{
    const params = useParams()
    const router = useRouter()
    const [open,setOpen] = useState(false)
    const [loading,setLoading] =useState(false)

    const title = initialData ? 'Edit Size' : "Create Size"
    const description = initialData ? 'Edit Size' : "Create Size"
    const toastMesage = initialData ? 'Size updated' : "Size Created."
    const action = initialData ? 'Save Changes' : "Create"

const form = useForm<SizeFromValues>({
    resolver:zodResolver(formSchema),
    defaultValues:initialData || {name:'',value:"",},
});

const onSubmit = async (data:SizeFromValues)=>{

    try{
        setLoading(true)
        if(initialData){
        await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`,data)
        }
        else{
            await axios.post(`/api/${params.storeId}/sizes`,data)

        }
        router.refresh()
        router.push(`/${params.storeId}/sizes`)
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
        await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`)
        router.refresh()
        router.push("/")
        toast.success("Size deleted.")     
    }catch{
        toast.error("Make sure you removed all categories using this size first.")
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
                    <Input disabled={loading} placeholder="Size Name" {...field}/>
                </FormControl>
                <FormMessage/>  
              </FormItem>  
            )} />
            </div>     
                <div className="grid grid-cols-3 gap-8">
            <FormField control={form.control} name="value" render={({field})=>(
              <FormItem>
                <FormLabel>Value</FormLabel>
                <FormControl>
                    <Input disabled={loading} placeholder="Size Value" {...field}/>
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

export default SizeFrom