import { forwardRef } from "react";

const TableComponent=forwardRef((props: any, ref) => {



    const { register, index, appendRow, remove ,getValues} = props.method

    const fuelamount=parseFloat(((getValues(`tableData.${index}.fuelper`)||0)*0.01*(getValues(`tableData.${index}.freight`)||0)).toFixed(2))
    const amount=parseFloat((fuelamount+getValues(`tableData.${index}.freight`)||0).toFixed(2))




    return <div className="grid" style={{ display: "grid", gridTemplateColumns: "10% 10% 7% 10% 9% 4% 5% 4% 7% 7% 6%  6% 7%", columnGap: "0.8%" }}>

        {/* <!-- Invoice Date --> */}
        <div>

            <input type="date" id="date" autoComplete="off" {...register(`tableData.${index}.date`)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Date" required />
        </div>

        <input placeholder="Consignment Note Number"  {...register(`tableData.${index}.consignmentNoteNumber`)} required
        />


        <input placeholder="Network"   {...register(`tableData.${index}.network`)} required ></input>



        <input placeholder="Consignee"  {...register(`tableData.${index}.consignee`)} required></input>


        <input placeholder="Destination" {...register(`tableData.${index}.destination`)} required></input>


        <input type="number" placeholder="Pcs." {...register(`tableData.${index}.pcs`, { valueAsNumber: true })} required></input>


        <input type="number" placeholder="Weight"  {...register(`tableData.${index}.weight`, { valueAsNumber: true })} step={0.001} required></input>


        <input placeholder="Fuel %" defaultValue={0} {...register(`tableData.${index}.fuelper`, { valueAsNumber: true })} required ></input>
        <input placeholder="Freight" defaultValue={0} {...register(`tableData.${index}.freight`, { valueAsNumber: true })}
            required></input>
        <input placeholder="Fuel Amount"  disabled={true} {...register(`tableData.${index}.fuelAmount`,{ valueAsNumber: true })} value={fuelamount} defaultValue={0}
            required></input>
        <input placeholder="Amount"  disabled={true} {...register(`tableData.${index}.amount`,{ valueAsNumber: true })} value={amount} defaultValue={0}
            required></input>

        <button onClick={(e) => {
            e.preventDefault()
            appendRow()
        }} type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Add</button>
        <button onClick={() => remove(index)} type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-1 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Delete</button>
    </div>;
})

export default TableComponent
