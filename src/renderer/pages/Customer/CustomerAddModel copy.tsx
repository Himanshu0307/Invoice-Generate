import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AddCustomer } from "../../model/AddCustomer";
import { useToasts } from "react-toast-notifications";

export default function CustomerAddModel() {
    const { register, handleSubmit, reset, formState } = useForm<AddCustomer>({ resetOptions: { keepIsSubmitted: false, keepIsSubmitSuccessful: false, keepSubmitCount: false, }, shouldUnregister: true, disabled: false })
    const [showModal, setShowModal] = useState(false);
    const queryClient=useQueryClient()
    const {addToast}=useToasts();
    

    const mutate = useMutation({
        mutationKey: ['@customerList']
        , mutationFn: async (data) => {
            return await (window as any).electron.addCustomers(data);

        }, 
        onSuccess:(data)=>{
            mutate.reset();

            queryClient.invalidateQueries({queryKey:['@customerList']})

            if (data.success === true)
                addToast("Added Successfully",{autoDismiss:true,appearance:"success"})
            else
                addToast(data.message,{autoDismiss:true,appearance:"success"})
            //             alert("Customer Added Successfully") 
        }
        // ,onSuccess:async (data) => {

        //     if (data.success === true)
        //         alert("Customer Added Successfully")
        //     reset();
        //     await  queryClient.invalidateQueries({ queryKey: ["@customerList"] });


        // }
    })

    // function closeModelAndReset() {
    //     reset({ name: "", address: "", gst: "", sac: "", supply: "" });
    //     onClose()

    // }

    // function onOpenAndPrint(){
    //     console.log(formState)
    //     onOpen()
    // }

   async function submitForm(formData) {

        console.log(formData)
        mutate.mutate(formData)
        setShowModal(false)





    }


    if (mutate.isError) return "error";
    else if (mutate.isPending && !mutate.isSuccess) return <div> Loading... </div>;
    else if (mutate.isSuccess) return (
        <>Success</>)



    return (
        <span>
           <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-3" onClick={()=>setShowModal(true)} > Add Customer</button>


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
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                    />
                                </svg>
                                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                    <form id="addCustomer" onSubmit={handleSubmit(submitForm)} >
                                        
                                            {/* full Name */}
                                            <div>
                                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Full
                                                    name</label>
                                                <input type="text" id="name" autoComplete="off" {...register('name')}
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                    placeholder="Full Name" required />
                                            </div>

                                            {/* <!-- GST Number --> */}
                                            <div>
                                                <label htmlFor="gst" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">GST
                                                    Number</label>
                                                <input id="gst" autoComplete="off"  {...register('gst')}
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                    placeholder="GST Number" required />
                                            </div>

                                            {/* <!-- Place of Supply --> */}
                                            <div>
                                                <label htmlFor="supply" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Place of
                                                    Supply</label>
                                                <input id="supply" autoComplete="off" {...register('supply')}
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                    placeholder="Place of Supply" required />
                                            </div>


                                            {/* <!-- SAC --> */}
                                            <div>
                                                <label htmlFor="sac" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">SAC</label>
                                                <input id="sac" autoComplete="off"   {...register('sac')}
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                    placeholder="SAC" required />
                                            </div>

                                            {/* <!-- Address --> */}

                                            <div>
                                                <label htmlFor="address"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Address</label>
                                                <textarea id="address"  {...register('address')}
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                    placeholder="Address" required></textarea>
                                            </div>



                                            {/* <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-3" >Add Customer</button> */}

                                    </form>
                                </h3>
                                <button form="addCustomer"
                                    //   onClick={handleDelete}
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-3"
                                >
                                   Add Customer
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
