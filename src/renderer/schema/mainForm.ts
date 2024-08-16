import * as z from 'zod'
const TableData=z.object({
    date: z.coerce.string(),
    consignmentNoteNumber: z.string(),
    network:z.string(),
    consignee:z.string(),
    destination:z.string(),
    weight:z.number(),
    pcs:z.number(),
    fuelper:z.number(),
    freight:z.number(),
    fuelAmount:z.number(),
    amount:z.number(),
})
const MainForm=z.object({
    cusNames:z.number(),
    name:z.string(),
    gst:z.string(),
    supply:z.string(),
    sac:z.string(),
    address:z.string(),
    narration:z.string(),
    invoiceNumber:z.string(),
    invoiceDate:z.coerce.string(),
    cdc:z.number().default(0).transform(x=>parseFloat(x.toFixed(2))),
    oda:z.number().default(0).transform(x=>parseFloat(x.toFixed(2))),
    acc:z.number().default(0).transform(x=>parseFloat(x.toFixed(2))),
    ccc:z.number().default(0).transform(x=>parseFloat(x.toFixed(2))),
    otherc:z.number().default(0).transform(x=>parseFloat(x.toFixed(2))),
    cgst:z.number().min(0).max(100).default(0).transform(x=>parseFloat(x.toFixed(2))),
    igst:z.number().min(0).max(100).default(0).transform(x=>parseFloat(x.toFixed(2))),
    sgst:z.number().min(0).max(100).default(0).transform(x=>parseFloat(x.toFixed(2))),
    tableData:z.array(TableData),
    grandTotal:z.number().default(0).transform(x=>parseFloat(x.toFixed(2))),
    cgstCharges:z.number().default(0).transform(x=>parseFloat(x.toFixed(2))),
    sgstCharges:z.number().default(0).transform(x=>parseFloat(x.toFixed(2))),
    igstCharges:z.number().default(0).transform(x=>parseFloat(x.toFixed(2))),
    roundoff:z.number().default(0.0).transform(x=>parseFloat(x.toFixed(2))),
    finalTotal:z.number().default(0.0).transform(x=>parseFloat(x.toFixed(2))),
})


type  MainFormSchema=z.infer<typeof MainForm>;
export { MainForm,TableData};
export type {MainFormSchema}
