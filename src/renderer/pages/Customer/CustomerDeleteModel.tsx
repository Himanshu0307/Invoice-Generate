import React from "react";
import { useForm } from "react-hook-form";

import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function CustomerDeleteModel() {
    const { register, handleSubmit, reset } = useForm()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const queryClient = useQueryClient();


    const { data, isError, isLoading, } = useQuery<Array<{ name: string, id: number }>>({
        queryKey: ['@customerList'],
        queryFn: async () => {
            var res = await (window as any).electron.getCustomerName()
            return res.data;
        }
    })

    function onCloseModalAndReset() {
        onClose()
        reset()
    }

    const { mutate } = useMutation({
        mutationKey: ['@customerList']
        , mutationFn: async (id) => {
            console.log("delete id", id)
            return await (window as any).electron.deleteCustomer(id)
        }
        , onSuccess: (data) => {

            alert(data.message)
            queryClient.invalidateQueries({ queryKey: ["@customerList"] });

        }
    })


    function submitForm(formData) {

        onCloseModalAndReset()
        mutate(formData.customerId)


    }
    if (isLoading) {
        return "Loading..."
    }
    if (isError) {
        return "Error"
    }


    return <>
        {/* card */}

        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-3" onClick={onOpen} > Delete Customer</button>

        <Modal isOpen={isOpen} onClose={onCloseModalAndReset}>
            <form id="deleteCustomer" onSubmit={handleSubmit(submitForm)} >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Delete Customer</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <label htmlFor="customerId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select an option</label>
                        <select {...register("customerId")} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option selected key={-1}>Choose a Customer</option>
                            {data.map(x => {
                                return <option value={x.id} key={x.id}>{x.name}</option>

                            })}

                        </select>


                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onCloseModalAndReset}>
                            Close
                        </Button>
                        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-3" >Delete Customer</button>
                    </ModalFooter>
                </ModalContent>
            </form>
        </Modal>


    </>
}