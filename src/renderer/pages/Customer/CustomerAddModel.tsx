import React from "react";
import { useForm } from "react-hook-form";

import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AddCustomer } from "../../model/AddCustomer";

export default function CustomerAddModel() {
    const { register, handleSubmit, reset,formState } = useForm<AddCustomer>({ resetOptions: { keepIsSubmitted: false,keepIsSubmitSuccessful:false,keepSubmitCount:false, },shouldUnregister:true,disabled:false })
    const { isOpen, onOpen, onClose } = useDisclosure()
    const queryClient = useQueryClient();

    const mutate = useMutation({
        mutationKey: ['@customerList']
        , mutationFn: async (data) => {
            return await (window as any).electron.addCustomers(data);

        }, onSuccess: async(data) => {
           
            if (data.success === true)
                alert("Customer Added Successfully")
            mutate.reset()
            reset();
           await queryClient.invalidateQueries({ queryKey: ["@customerList"] });
           

        }
    })

    function closeModelAndReset() {
        reset();
        onClose()

    }

    function onOpenAndPrint(){
        onOpen()
    }

    const submitForm=(formData)=>mutate.mutateAsync(formData)
    


    if(mutate.isPending) return <div>Loading</div>
    if(mutate.isError) return <div>Error</div>
    if(mutate.isSuccess) return <div>Success</div>



    return <>
        {/* card */}

        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-3" onClick={onOpenAndPrint} > Add Customer</button>

        <Modal isOpen={isOpen} onClose={closeModelAndReset} id="iiihi" >
                <ModalOverlay />
                <ModalContent>
            <form id="addCustomer" onSubmit={handleSubmit(submitForm)} >
                    <ModalHeader>Add Customer</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
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


                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={closeModelAndReset}>
                            Close
                        </Button>
                        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-3" >Add Customer</button>
                    </ModalFooter>
            </form>
                </ModalContent>
        </Modal>


    </>
}