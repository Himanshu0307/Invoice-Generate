import { forwardRef, useEffect ,useRef} from "react"


 function BottomStickyBars(prop,ref) {
     useEffect(()=>{
         
        prop.setValue("grandTotal",prop.formData.calculatedGrandTotal)
        prop.setValue("cgstCharges",prop.formData.calculatecgstCharges)
        prop.setValue("igstCharges",prop.formData.calculateigstCharges)
        prop.setValue("sgstCharges",prop.formData.calculatesgstCharges)
        prop.setValue("roundoff",prop.formData.roundoff)
        prop.setValue("finalTotal",prop.formData.finalTotal)
     },[prop.formData])
    
    return <div  className="p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700" style={{ position: "fixed", bottom: "0", width: "100%" }}>
                <div className=" flex flex-row justify-evenly">



                    {/* Table Total */}
                    <div>
                        <label htmlFor="grandTotal" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Table Total</label>
                        <input type="number" autoComplete="off"  {...prop.register('grandTotal', { valueAsNumber: true, })}  disabled={true}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Table Total" required />
                    </div>
                    {/* Total CGST Charges */}
                    <div>
                        <label htmlFor="cgstCharges" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Total CGST Charges</label>
                        <input type="number"  autoComplete="off" {...prop.register('cgstCharges', { valueAsNumber: true })}  disabled={true}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Total CGST Charges" required />
                    </div>

                    {/* Total IGST Charges*/}
                    <div>
                        <label htmlFor="igstCharges" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Total IGST Charges</label>
                        <input type="number" autoComplete="off" {...prop.register('igstCharges', { valueAsNumber: true })}  disabled={true}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Total IGST Charges" required />
                    </div>
                    {/* Total SGST Charges*/}
                    <div>
                        <label htmlFor="sgstCharges" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Total SGST Charges</label>
                        <input type="number"  autoComplete="off" {...prop.register('sgstCharges', { valueAsNumber: true})}  disabled={true}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Total SGST Charges" required />
                    </div>

                    {/* RoundOff */}
                    <div>
                        <label htmlFor="roundoff" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Round Off</label>
                        <input type="number"  autoComplete="off" {...prop.register('roundoff', { valueAsNumber: true, })}  disabled={true}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Round Off" required />
                    </div>


                    {/* Total */}
                    <div>
                        <label htmlFor="finalTotal" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Total</label>
                        <input type="number"  autoComplete="off" {...prop.register('finalTotal', { valueAsNumber: true})}  disabled={true}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Final Total" required />
                    </div>


                    <input type="submit"  value={"Generate Invoice"} 
                        className=" mx-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"></input>


                    <input type="reset" value="Clear"   onClick ={prop.onClear}
                        className=" text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" />
                </div>
        </div>
    
}



const BottomStickyBar=forwardRef(BottomStickyBars) 

export default BottomStickyBar;
