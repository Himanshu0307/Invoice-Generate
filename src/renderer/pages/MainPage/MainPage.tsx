/* eslint-disable prettier/prettier */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {  useFieldArray, useForm, useWatch } from 'react-hook-form';
import { useReactToPrint } from 'react-to-print';
import { useQuery, useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { number } from 'zod';
import dateFormat from 'dateformat';
import { PrintComponent } from '../PrintCoponent/PrintComponent';
import CustomerAddModel from '../Customer/CustomerAddModel copy';
import CustomerDeleteModel from '../Customer/CustomerDeleteModel copy';
import BottomStickyBar from './BottomStickyBar';
import { MainForm, MainFormSchema } from '../../schema/mainForm';
import TableComponent from './_forms/TableComponent';

export default function MainPage() {
  const { register, handleSubmit, control, getValues, setValue, reset } =
    useForm<MainFormSchema>({ resolver: zodResolver(MainForm) });
  console.log("window",window)

  const { fields, append, remove } = useFieldArray({
    name: 'tableData',
    control,
    rules: { minLength: 1 },
  });
  const [printData, setPrintData] = useState(null);
  const componentRef = useRef();
  const handlePrint = useReactToPrint({ content: () => componentRef.current,documentTitle:"Invoice", });
  const tableData: Array<any> = useWatch({
    name: 'tableData',
    control,
  });
  const sgst: number = useWatch({ name: 'sgst', control });
  const igst: number = useWatch({ name: 'igst', control });
  const cgst: number = useWatch({ name: 'cgst', control });
  const cdc: number = useWatch({ name: 'cdc', control });
  const oda: number = useWatch({ name: 'oda', control });
  const acc: number = useWatch({ name: 'acc', control });
  const otherc: number = useWatch({ name: 'otherc', control });
  const ccc: number = useWatch({ name: 'ccc', control });
  const customerName: number = useWatch({ name: 'cusNames', control });

  const formReference = useRef();

  useEffect(() => {
    if (fields.length === 0) {
      appendRow();
    }
  });

  // calculate Table Data
  const calculatedGrandTotal: number = useMemo(() => {
    if (tableData === undefined) return 0;
    console.log(tableData, 'tableData');

    const sum = tableData.reduce((pre, curr) => {
      // setValue(`tableData.${index}.fuelAmount`,((parseFloat(curr.fuelper) || 0) * 0.01 * (parseFloat(curr.freight) || 0)))
      // setValue(`tableData.${index}.amount`,((parseFloat(curr.fuelAmount) || 0) + (parseFloat(curr.freight) || 0)))
      return (
        pre +
        (parseFloat(curr.fuelper) || 0) *
          0.01 *
          (parseFloat(curr.freight) || 0) +
        (parseFloat(curr.freight) || 0)
      );
    }, 0);

    return parseFloat(sum.toFixed(2));
  }, [tableData]);

  // calculate Custom Duty Charges
  const calculateCustomDutyCharges: number = useMemo(() => {
    console.log('calculating Custom Duty ', cdc, calculatedGrandTotal);
    return calculatedGrandTotal + (cdc || 0);
  }, [cdc, calculatedGrandTotal]);

  // calculate oda Charges
  const calculateodaCharges: number = useMemo(() => {
    console.log('calculating oda', oda, calculateCustomDutyCharges);
    return calculateCustomDutyCharges + (oda || 0);
  }, [oda, calculateCustomDutyCharges]);

  // calculate Address Correction Charges
  const calculateaccCharges: number = useMemo(() => {
    console.log('calculating Address Correction', acc, calculateodaCharges);
    return calculateodaCharges + (acc || 0);
  }, [acc, calculateodaCharges]);

  // calculate Handling Charges
  const calculateotherCharges: number = useMemo(() => {
    console.log('calculating other Charges', otherc, calculateaccCharges);
    return calculateaccCharges + (otherc || 0);
  }, [otherc, calculateaccCharges]);



  // calculate ccc Charges
  const calculateccc = useMemo(() => {
    console.log('calculating ccc', ccc, calculateotherCharges);
    return calculateotherCharges + (ccc || 0);
  }, [ccc, calculateotherCharges]);

  // calculate cgst Charges
  const calculatecgstCharges = useMemo(() => {
    console.log('calculating cgst');
    return parseFloat(((cgst || 0) * 0.01 * calculateccc).toFixed(2));
  }, [cgst, calculateccc]);

  // calculate sgst Charges
  const calculatesgstCharges = useMemo(() => {
    console.log('calculating sgst');
    return parseFloat(((sgst || 0) * 0.01 * calculateccc).toFixed(2));
  }, [sgst, calculateccc]);

  // calculate igst Charges
  const calculateigstCharges = useMemo(() => {
    console.log('calculating igst');
    return parseFloat(((igst || 0) * 0.01 * calculateccc).toFixed(2));
  }, [igst, calculateccc]);

  const tempTotal: number =
    calculateccc +
    calculatecgstCharges +
    calculateigstCharges +
    calculatesgstCharges;

  // calculate roundoff Charges
  const roundoff = useMemo(() => {
    return parseFloat((tempTotal - Math.floor(tempTotal)).toFixed(2));
  }, [tempTotal]);

  // calculate final total to be paid
  const finalTotal: number = parseFloat((tempTotal - roundoff).toFixed(2));

  const { mutate } = useMutation({
    mutationKey: ['@customer'],
    mutationFn: async (id: number) => {
      const data = await (window as any).electron.getCustomerDetail(id);
      return data;
    },
  });

  function appendRow() {
    append({
      date: '',
      consignee: '',
      consignmentNoteNumber: '',
      network: '',
      weight: 0,
      pcs: 0,
      destination: '',
      freight: 0,
      fuelper: 0,
      fuelAmount: 0,
      amount: 0,
    });
  }

  function convertToFixedNumber(value: any) {
    if (typeof value === typeof number) {
      return value.toFixed(2);
    }
    return value;
  }

  const { data, isError, isLoading,error } = useQuery<
    Array<{ name: string; id: number }>
  >({
    queryKey: ['@customerList'],
    queryFn: async () => {
      // fetch Customer
      const data = await (window as any).electron.getCustomerName();
      console.log('Customer fetched', data);
      return data.data;
    },
  });

  useEffect(() => {
    if (customerName) {
      console.log(customerName);

      mutate(customerName, {
        onSuccess: (data) => {
          if (data.success === true) {
            // console.log(data.data, 'fdsdfsdfsfs');
            setValue('name', data.data.name);
            setValue('gst', data.data.gst);
            setValue('supply', data.data.supply);
            setValue('sac', data.data.sac);
            setValue('address', data.data.address);
          }
        },
      });
    }
  }, [customerName]);

  function onSubmit(formData) {
    calculateData(formData);

    return handlePrint();
  }

  function onClear() {
    reset();
    fields.forEach((_, ind) => remove(ind));
    appendRow();
  }

  function calculateData(formData) {
    // // conversion
    // formData.tableData.forEach(x => {
    //     x.freight = Number(x.freight)
    //     x.fuelper = Number(x.fuelper)

    // });
    // formData.sgst = Number(formData.sgst)
    // formData.cgst = Number(formData.cgst)
    // formData.igst = Number(formData.igst)
    // formData.oda = Number(formData.oda)
    // formData.roundoff = Number(formData.roundoff)
    // formData.ccc = Number(formData.ccc)

    // calculate fuel Amount and Total Amount of that row
    formData.tableData.forEach((row) => {
      row.fuelAmount = parseFloat(
        (0.01 * row.fuelper * row.freight).toFixed(2),
      );
      row.amount = row.freight + row.fuelAmount;
    });
    // calculate grand total
    // formData.grandTotal = formData.tableData.reduce((prv, crnt) => { return prv + (crnt.amount) }, 0)

    // calculate Custom Duty Charges
    formData.cdcTotal = parseFloat(
      (formData.grandTotal + formData.cdc).toFixed(2),
    );

     // calculate ODA Charges
     formData.odaTotal = parseFloat(
      (formData.cdcTotal + formData.oda).toFixed(2),
    );

      // calculate Address Correction Charges
      formData.accTotal = parseFloat(
        (formData.odaTotal + formData.acc).toFixed(2),
      );

    // calculate other  charges
    formData.otherCharges = parseFloat(
      (formData.accTotal + formData.otherc).toFixed(2),
    );

    // calculate Custom Clearence charges
    formData.cccCharges = parseFloat(
      (formData.ccc + formData.otherCharges).toFixed(2),
    );

    // calculate IGST
    // formData.igstCharges = (0.01 * formData.igst * formData.cccCharges)

    // // calculate CGST
    // formData.cgstCharges = (0.01 * formData.cgst * formData.cccCharges)
    // // calculate SGST
    // formData.sgstCharges = (0.01 * formData.sgst * formData.cccCharges)

    // calculate total
    formData.total = parseFloat(
      (
        formData.sgstCharges +
        formData.cgstCharges +
        formData.igstCharges +
        formData.cccCharges
      ).toFixed(2),
    );

    // calculateRoundoff
    // formData.roundoff = parseFloat((formData.total - Math.floor(formData.total)).toFixed(2))

    // calculate final Total
    // formData.finalTotal = (formData.total - formData.roundoff)
    console.log(formData);
    formData.invoiceDate = dateFormat(formData.invoiceDate, 'dd.mm.yyyy');
    formData.tableData.forEach((x, index) => {
      x.date = dateFormat(x.date, 'dd.mm.yyyy');
    });
    setPrintData((x) => formData);
  }

  if (isLoading) return 'Loading....';
  if (isError) return (<div> Error :{error.message}</div>
  );

  return (
    <>
      <div className="my-10 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <CustomerAddModel />
        <CustomerDeleteModel />
      </div>

      <form
        id="basic"
        onSubmit={handleSubmit(onSubmit, (err) =>
          console.log(err, getValues(), calculatedGrandTotal),
        )}
        ref={formReference}
      >
        <div className="my-10 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <label>Choose a Customer:</label>
          <select
            {...register('cusNames', { valueAsNumber: true })}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-e-lg border-s-gray-100 dark:border-s-gray-700 border-s-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option key={-1} selected value={null}>
              Choose a Customer
            </option>
            {data.map((x) => (
              <option value={x.id} key={x.id}>
                {x.name}
              </option>
            ))}
          </select>
        </div>
        <div className=" p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <fieldset disabled>
            <div className="grid gap-6 mb-6 md:grid-cols-2">
              {/* <!-- full Name --> */}
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Full name
                </label>
                <input
                  type="text"
                  id="name"
                  autoComplete="off"
                  {...register('name')}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Full Name"
                  required
                />
              </div>

              {/* <!-- GST Number --> */}
              <div>
                <label
                  htmlFor="gst"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  GST Number
                </label>
                <input
                  id="gst"
                  autoComplete="off"
                  {...register('gst')}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="GST Number"
                  required
                />
              </div>

              {/* <!-- Place of Supply --> */}
              <div>
                <label
                  htmlFor="supply"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Place of Supply
                </label>
                <input
                  id="supply"
                  autoComplete="off"
                  {...register('supply')}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Place of Supply"
                  required
                />
              </div>

              {/* <!-- SAC --> */}
              <div>
                <label
                  htmlFor="sac"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  SAC
                </label>
                <input
                  id="sac"
                  autoComplete="off"
                  type="number"
                  {...register('sac')}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="SAC"
                  required
                />
              </div>
            </div>

            {/* <!-- Address --> */}

            <div>
              <label
                htmlFor="address"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Address
              </label>
              <textarea
                id="address"
                {...register('address')}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Address"
                required
              />
            </div>
          </fieldset>
        </div>
        <div className="my-10 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            {/* <!-- Invoice Number --> */}
            <div>
              <label
                htmlFor="invoiceNumber"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Invoice Number
              </label>
              <input
                id="invoiceNumber"
                autoComplete="off"
                {...register('invoiceNumber')}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Invoice Number"
                required
              />
            </div>

            {/* <!-- Invoice Date --> */}
            <div>
              <label
                htmlFor="invoiceDate"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Invoice Date
              </label>
              <input
                type="date"
                id="invoiceDate"
                autoComplete="off"
                {...register('invoiceDate')}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Enter Invoice Date"
                required
              />
            </div>

             {/* <!-- Custom Duty Charges --> */}
             <div>
              <label
                htmlFor="cdc"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Custom Duty Charges(in Amount)
              </label>
              <input
                id="cdc"
                autoComplete="off"
                {...register('cdc', { valueAsNumber: true })}
                defaultValue={0}
                type="number"
                step={0.01}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Custom Duty Charges"
                required
              />
            </div>

            {/* <!-- ODA --> */}
            <div>
              <label
                htmlFor="oda"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                ODA Total(in Amount)
              </label>
              <input
                id="oda"
                autoComplete="off"
                {...register('oda', { valueAsNumber: true })}
                defaultValue={0}
                type="number"
                step={0.01}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="ODA Total"
                required
              />
            </div>

              {/* <!--Address Correction Charges --> */}
              <div>
              <label
                htmlFor="acc"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Address Correction Charges(in Amount)
              </label>
              <input
                id="acc"
                autoComplete="off"
                {...register('acc', { valueAsNumber: true })}
                defaultValue={0.00}
                step={0.01}
                type="number"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Address Correction Charges"
                required
              />
            </div>

            {/* <!-- Custom Clearance --> */}
            <div>
              <label
                htmlFor="ccc"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Custom Clearence Charges
              </label>
              <input
                id="ccc"
                autoComplete="off"
                {...register('ccc', { valueAsNumber: true })}
                defaultValue={0.00}
                type="number"
                step={0.01}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Custom Clearence Charges"
                required
              />
            </div>

            {/* <!--Other Charges --> */}
            <div>
              <label
                htmlFor="otherc"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Other Charges
              </label>
              <input
                id="otherc"
                autoComplete="off"
                {...register('otherc', { valueAsNumber: true })}
                defaultValue={0}
                type="number"
                step={0.01}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Other Charges"
                required
              />
            </div>

            {/* <!-- CGST// --> */}
            <div>
              <label
                htmlFor="cgst"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                CGST(in percentage)
              </label>
              <input
                id="cgst"
                min={0}
                autoComplete="off"
                {...register('cgst', { valueAsNumber: true })}
                max={100}
                defaultValue={0}
                type="number"
                step={0.01}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="CGST"
                required
              />
            </div>

            {/* <!-- SGST --> */}
            <div>
              <label
                htmlFor="sgst"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                SGST(in percentage)
              </label>
              <input
                id="sgst"
                min="0"
                autoComplete="off"
                {...register('sgst', { valueAsNumber: true })}
                max={100}
                defaultValue={0}
                type="number"
                step={0.01}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="SGST"
                required
              />
            </div>

            {/* <!-- IGST --> */}
            <div>
              <label
                htmlFor="igst"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                IGST(in percentage)
              </label>
              <input
                id="igst"
                autoComplete="off"
                {...register('igst', { valueAsNumber: true })}
                type="number"
                max={100}
                defaultValue={0}
                step={0.01}
                min="0"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="IGST"
                required
              />
            </div>

             {/* <!-- Narration --> */}

             <div style={{gridColumn: "1 / span 2",whiteSpace:"normal"}}>
              <label
                htmlFor="narration"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Narration
              </label>
              <textarea
                id="narration"
                {...register('narration')}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Narration"

              />
            </div>
          </div>
        </div>

        {/* <!-- Table  --> */}
        <div className="my-10 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <div
            className="grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '10% 10% 7% 10% 9% 4% 5% 4% 7% 7% 6%  6% 7%',
              columnGap: '0.8%',
            }}
          >
            <b>Date</b>
            <b>Consignment Note Number</b>
            <b>Network</b>
            <b>Consignee</b>
            <b>Destination</b>
            <b>Pcs.</b>
            <b>Weight</b>
            <b>Fuel %</b>
            <b>Freight</b>
            <b>Fuel Amount</b>
            <b>Amount</b>
          </div>
          {fields.map((item, index) => (
            <TableComponent
              key={item.id}
              method={{
                register,
                index,
                appendRow,
                remove,
                getValues,
                setValue,
              }}
            />
          ))}
        </div>
        <div style={{ margin: '100px' }} />

        <div>
          <BottomStickyBar
            register={register}
            setValue={setValue}
            onClear={onClear}
            formData={{
              calculatesgstCharges,
              calculatecgstCharges,
              calculatedGrandTotal,
              calculateigstCharges,
              finalTotal,
              roundoff,
            }}
          />
        </div>
      </form>

      {/* print Component */}
      <div style={{ display: 'none' }}>
        <PrintComponent printData={printData} ref={componentRef} />
      </div>
    </>
  );
}
