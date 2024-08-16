import React from "react";
import "./Print.css"
import  logo from "../../assets/logo.jpg"
export class PrintComponent extends React.Component {
    headers = ["DATE", "CONSIGNMENT NOTE NUMBER", "NETWORK", "CONSIGNEE", "DESTINATION", "PCS.", "WEIGHT", "FREIGHT", "FUEL", "AMOUNT"]


    render() {
        // console.log("rendered",this.props.printData)
        var printData = this.props.printData;

        // return null
        if (printData == null)
            return <></>

        var tableData = printData.tableData.map((x,index) => {
            let arraytd = []
            // date
            arraytd.push(<td>{x.date}</td>)

            // consignment note number
            arraytd.push(<td>{x.consignmentNoteNumber}</td>)



            // network
            arraytd.push(<td>{x.network}</td>)

            // consignee
            arraytd.push(<td>{x.consignee}</td>)


            // destination
            arraytd.push(<td>{x.destination}</td>)

            // pcs
            arraytd.push(<td>{x.pcs}</td>)

            // weight
            arraytd.push(<td>{x.weight.toFixed(3)}</td>)

            // Freight
            arraytd.push(<td>{x.freight.toFixed(2)}</td>)

            // Fuel
            arraytd.push(<td>{x.fuelAmount.toFixed(2)}</td>)

            // amount
            arraytd.push(<td>{x.amount.toFixed(2)}</td>)

            return <tr key={index}>{arraytd}</tr>


        })


        if (printData == null)
            return <></>


        return <table  id="main">
          <thead >
            <tr>


              <div className="GST text-left" style={{marginTop:"5px"}}>
                  <b>GSTIN: 08AEAPJ1835J1ZM</b>
              </div>
              <div className="Title" style={{ textAlign: "center" }}>

                  <span><img alt="logo" src={logo} style={{marginLeft:"auto",marginRight:"auto"}} /></span>
              </div>
              <div className="address" style={{ textAlign: "center" }}>
                  <div>(International Logistic Solutions from your door to the worldwide)</div>
                  <div>We deal in: International Courier/ Air Freight/ Sea Freight (Export & Import Services)</div>

              </div>
              <hr style={{backgroundColor:"#686892",height:"3px",margin:"7px 0px"}} />

            </tr>
          </thead>
          <tbody  >
                  <div className="tax" style={{ textAlign: "center" }}>
                      Tax Invoice
                  </div>


                  {/* Data About Customer */}
                  <div>
                      <span className="left" style={{ float: "left" }}>
                          <b>To:</b>
                          <div>{printData.name}</div>
                          <div><i>{printData.address}</i> </div>
                          <div> <b>GST: {printData.gst}</b></div>
                          <div> <b>Place of Supply: {printData.supply}</b></div>
                          <div>
                              <b>SAC:{printData.sac}</b>
                          </div>
                      </span>
                      <span className="right" style={{ float: "right" }}>
                          <div style={{display:"grid", gridTemplateColumns:"auto auto"}}>
                              <b style={{marginRight:"15px"}}>Invoice No:</b>
                              {printData.invoiceNumber}
                              <b style={{marginRight:"15px"}}>Invoice Date:</b>
                              {printData.invoiceDate}
                          </div>

                      </span>
                  </div>


                  {/* Table Data and calculations  */}
                  <div style={{ clear: "both" ,"paddingTop":"10px"}}>

                            {/* Table Data */}
                            <div style={{ clear: "both" }}>
                                <table id="billTable" style={{ fontSize: "0.8em", fontFamily: "'Times New Roman', Times, serif", }}>
                                  <thead>
                                    <tr>
                                        {this.headers.map(x => { return <th style={{ textAlign: "start" }}>{x}</th> })}
                                    </tr>
                                  </thead>
                                  <tbody>

                                    {tableData}
                                  </tbody>

                                </table>
                            </div>

                            {/* Calculation bottom */}
                            <div style={{ margin:"10px",clear: "left", float: "right",fontSize:"0.8em" }}>
                                {/* grand total */}
                                <div id="downCal" style={{ display: "grid", gridTemplateColumns: "auto auto", columnGap: "20px" }}>
                                  <div>Total:</div>
                                  <div>{printData.grandTotal.toFixed(2)}</div>


                                    {/* Custom Duty Charges */}
                                   {printData.cdc!==0 && <><div>Add: Custom Duty Charges:</div>
                                    <div>{printData.cdc.toFixed(2)}</div>
                                    <hr style={{ gridColumnStart: "1", gridColumnEnd: "3" }} />
                                    <div style={{ gridColumnStart: "2", }}>{printData.cdcTotal.toFixed(2)}</div></>}



                                    {/* ODA */}
                                    {printData.oda!==0 && <><div>Add: ODA Charges(#):</div>
                                    <div>{printData.oda.toFixed(2)}</div>
                                    <hr style={{ gridColumnStart: "1", gridColumnEnd: "3" }} />
                                    <div style={{ gridColumnStart: "2", }}>{printData.odaTotal.toFixed(2)}</div></>}


                                    {/* Address Correction Charges */}
                                   {printData.acc!==0 && <> <div>Add: Address Correction Charges(@):</div>
                                    <div>{printData.acc.toFixed(2)}</div>
                                    <hr style={{ gridColumnStart: "1", gridColumnEnd: "3" }} />
                                    <div style={{ gridColumnStart: "2", }}>{printData.accTotal.toFixed(2)}</div></>}


                                    {/* Other Charges */}
                                   {printData.otherc!==0 && <><div>Add: Other Charges($):</div>
                                    <div>{printData.otherc.toFixed(2)}</div>
                                    <hr style={{ gridColumnStart: "1", gridColumnEnd: "3" }} />
                                    <div style={{ gridColumnStart: "2", }}>{printData.otherCharges.toFixed(2)}</div></>}

                                    {/* Clearence */}
                                  {printData.ccc!==0  && <> <div>Add: Custom Clearance Charge(*):</div>
                                    <div>{printData.ccc.toFixed(2)}</div>
                                    <hr style={{ gridColumnStart: "1", gridColumnEnd: "3" }} />
                                    <div style={{ gridColumnStart: "2", }}>{printData.cccCharges.toFixed(2)}</div></>}


                                    {/* cgst */}
                                    <div>CGST @ {printData.cgst}%</div>
                                    <div>{printData.cgstCharges.toFixed(2)}</div>

                                    {/* sgst */}
                                    <div>SGST @ {printData.sgst}%</div>
                                    <div>{printData.sgstCharges.toFixed(2)}</div>

                                    {/* igst */}
                                    <div>IGST @ {printData.igst}%</div>
                                    <div>{printData.igstCharges.toFixed(2)}</div>
                                    <hr style={{ gridColumnStart: "1", gridColumnEnd: "3" }} />
                                    <div style={{ gridColumnStart: "2", }}>{printData.total.toFixed(2)}</div>

                                    {/* roundoff */}
                                    <div>Subtract: Round off</div>
                                    <div>{printData.roundoff.toFixed(2)}</div>
                                    <hr style={{ gridColumnStart: "1", gridColumnEnd: "3" }} />
                                    <div style={{textAlign:"left"}} >Total</div>
                                    <div >{printData.finalTotal.toFixed(2)}</div>

                                </div>



                  </div>


                  </div>

                  {/* below line */}
                  <div style={{ textAlign: "center", clear: "both",fontSize:"0.6em" }}>
                    <hr style={{ marginBottom: "0" }} />
                    ANY DISCREPANCIES SHOULD BE NOTIFIED WITHIN SEVEN DAYS OF RECEIPT OF THIS INVOICE.
                    <hr style={{ marginTop: "0" }} />
                  </div>

                  {/* note */}
                  {printData.narration && <div>
                    <b className="text-xs">Note</b>
                    <div className="text-xs whitespace-pre" >{printData.narration}</div>
                  </div>}
          </tbody>
          <tfoot style={{paddingBottom:"100px"}} >
               <tr >
                  <div>
                      <b>
                          OUR GSTIN: 08AEAPJ1835J1ZM & STATE CODE 08
                      </b>
                      <ul style={{ listStyleType: "none", fontSize: "0.7em" }}>
                          <li>PAYMENT TERMS: STRICTLY WITHIN 45 DAYS, LATE PAYMENT WILL BE SUBJECTED TO AN INTEREST CHARGE OF 2%
                              PER MONTH</li>
                          <li>PLEASE PAY BY ACCOUNT PAYEE CHEQUE IN FAVOUR OF <b>"R.S BUSINESS SOLUTIONS"</b></li>
                          <li>BANK DETAILS-HDFC BANK, ALUDA HOUSE,CHAURA RASTA, JPR (CURRENT A/C NO.: 14372000000943)(IFSC CODE:HDFC0001437)</li>
                          <li>ALL DISPUTES SUBJECT TO JAIPUR JURISDICTION</li>
                          <li>THIS IS A COMPUTER GENERATED INVOICE, HENCE NO SIGNATURE REQUIRED </li>
                      </ul>

                  </div>
                </tr>
          </tfoot>
        </table>;
    }
}
