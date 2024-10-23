"use client";

import * as z from "zod";
import { useState } from "react";
import { Trash } from "lucide-react";
import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { Size } from "@prisma/client";
import toast from "react-hot-toast";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { AlertModal } from "@/components/modals/alert-modal";
import { Form, 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ImageUpload from "@/components/ui/image-upload";
    
const formSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(1),
})

type SizeFormValues = z.infer<typeof formSchema>;

interface SizeFormProps {
    initialData: Size | null ;
}

export const SizeForm: React.FC<SizeFormProps> = ({
    initialData
}) => {
    const [open, setOpen ] = useState(false);
    const [loading , setLoading] = useState(false);
    const params = useParams();
    const router = useRouter();

    const title = initialData ? "Edit Size" : "Create Size";
    const description = initialData ? "Edit a Size" : "Add a new Size";
    const toastMessage = initialData ? "Size Edited" : "Size Created";
    const action = initialData ? "Save Changes" : "Create";



    const form = useForm<SizeFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            value: ''
        }
    });

    const onSubmit = async (data: SizeFormValues ) => {
        try {
            setLoading(true)
            if(initialData){
                await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`, data);
            } else {
                await axios.post(`/api/${params.storeId}/sizes`, data);
            }
            router.refresh();
            router.push(`/${params.storeId}/sizes`)
            toast.success(toastMessage);
        } catch (error) {
            console.log("[PATCH/POST] " , error);
            toast.error("Something Went Wrong");
        } finally {
            setLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`)
            router.refresh();
            router.push(`/${params.storeId}/sizes`)
            toast.success("Size Deleted")
        } catch (error) {
            console.log("[DELETE] " , error);
            toast.error("Make Sure you removed all products using this size first")
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }

    return (
        <>
            <AlertModal 
                isOpen={open} 
                onClose={()=> setOpen(false)}
                onConfirm={onDelete}
                loading={loading} />
            <div className="flex items-center justify-between">
                <Heading
                    title={title}
                    description={description}
                    />
                {initialData && <Button 
                    disabled={loading}
                    variant="destructive" 
                    size="icon" 
                    onClick={() => setOpen(true)}>
                        <Trash className="h-4 w-4" />
                </Button>}
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="grid grid-cols-3 gap-8">
                        <FormField 
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Size Name" {...field}></Input>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                        <FormField 
                            control={form.control}
                            name="value"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Value</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Size Value" {...field}></Input>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                    </div>
                    <Button type="submit" disabled={loading} className="ml-auto" >
                        {action}
                    </Button>
                </form>
            </Form>
        </>
    )
}