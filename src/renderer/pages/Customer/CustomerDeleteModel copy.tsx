import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AddCustomer } from "../../model/AddCustomer";
import { useQuery } from "@tanstack/react-query";
import { useToasts } from "react-toast-notifications";

export default function CustomerAddModel() {
    const { register, handleSubmit, reset, formState } = useForm({ resetOptions: { keepIsSubmitted: false, keepIsSubmitSuccessful: false, keepSubmitCount: false, }, shouldUnregister: true, disabled: false })
    const [showModal, setShowModal] = useState(false);
    const queryClient=useQueryClient()
    const {addToast}=useToasts();

    const { data, isError, isLoading, } = useQuery<Array<{ name: string, id: number }>>({
        queryKey: ['@customerList'],
        queryFn: async () => {
            var res = await (window as any).electron.getCustomerName()
            return res.data;
        }
    })
    

    const mutate = useMutation({
        mutationKey: ['@customerList']
        , mutationFn: async (id) => {
            return await (window as any).electron.deleteCustomer(id)

        }, 
        onSuccess:(data)=>{
            mutate.reset();
            queryClient.invalidateQueries({queryKey:['@customerList']})
            if(data.success===true)
                addToast('Delete Success', { appearance: 'success',autoDismiss:true });
            else
                addToast('Delete Failed', { appearance: 'error',autoDismiss:true });
        }
       
    })

    

   async function submitForm(formData) {

        mutate.mutate(formData.customerId)
        setShowModal(false)





    }


    if (mutate.isError) return "error";
    else if (mutate.isPending && !mutate.isSuccess) return <div> Loading... </div>;
    else if (mutate.isSuccess) return (
        <>Success</>)



    return (
        <span>
           <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-3" onClick={()=>setShowModal(true)} > Delete Customer</button>


            {showModal && (
                <div
                    id="popup-modal"
                    className="fixed inset-0 flex items-center justify-center z-50"
                >
                    <div className="relative p-4 w-full max-w-md">
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            <button
                                onClick={() => setShowModal(false)}
                                type="button"
                                className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                                <svg
                                    className="w-3 h-3"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 14 14"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        stroke-width="2"
                                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                    />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                            <div className="p-4 md:p-5 text-center">
                                <svg
                                    className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                    />
                                </svg>
                                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                <form id="deleteCustomer" onSubmit={handleSubmit(submitForm)} >
                                        
                                <label htmlFor="customerId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select an option</label>
                        <select {...register("customerId")} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option selected key={-1}>Choose a Customer</option>
                            {data.map(x => {
                                return <option value={x.id} key={x.id}>{x.name}</option>

                            })}

                        </select>
                                    </form>
                                </h3>
                                <button form="deleteCustomer"
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-3"
                                >
                                   Delete Customer
                                </button>
                                <button
                                      onClick={() =>{ setShowModal(false)
                                        reset()
                                      }}
                                    type="button"
                                    className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </span>
    );
};
