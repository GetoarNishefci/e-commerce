"use client"

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import ImageUpload from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useOrigin } from "@/hooks/use-origin";
import { zodResolver } from "@hookform/resolvers/zod";
import {  Image, Product } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams,useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";


interface ProductFormProps{
    initialData:Product & {
        images:Image[]
    } | null;
}

const formSchema = z.object({
  name:z.string().min(1),
  images:z.object({url:z.string()}).array(),
  price: z.coerce.number().min(1),
categoryId:z.string().min(1),
colorId:z.string().min(1),
sizeId:z.string().min(1),
isFeatured:z.boolean().default(false).optional(),
isArchived:z.boolean().default(false).optional()
});
 

type ProductFormValues = z.infer<typeof formSchema>


const ProductForm:React.FC<ProductFormProps> = ({
    initialData
}) =>{
    const params = useParams()
    const router = useRouter()
    const [open,setOpen] = useState(false)
    const [loading,setLoading] =useState(false)

    const title = initialData ? 'Edit Product' : "Create Product"
    const description = initialData ? 'Edit Product' : "Create Product"
    const toastMesage = initialData ? 'Product updated' : "Product Created."
    const action = initialData ? 'Save Changes' : "Create"

    
const form = useForm<ProductFormValues>({
    resolver:zodResolver(formSchema) as any,
    defaultValues:initialData ? {...initialData,price:parseFloat(String(initialData?.price))} : {name:'',images:[],price:0,categoryId:'',colorId:'',sizeId:'',isFeatured:false,isArchived:false},
});

const onSubmit = async (data:ProductFormValues)=>{

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
console.log("tesd",form)
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
              <FormField control={form.control} name="images" render={({field})=>(
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                    <ImageUpload     value={field.value.map((images) => images.url)} disabled={loading}
                          onChange={(url)=>{ field.onChange([...field.value,{url}])}}  
                          onRemove={(url)=>{field.onChange([...field.value.filter((current)=>current.url !== url)])}}                 
                    />
                </FormControl>
                <FormMessage/>  
              </FormItem>  
            )} />
        <div className="grid grid-cols-3 gap-8">
            <FormField control={form.control} name="name" render={({field})=>(
              <FormItem>
                <FormLabel>Label</FormLabel>
                <FormControl>
                    <Input disabled={loading} placeholder="Billboard Label" {...field}/>
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

export default ProductForm