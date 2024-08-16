import { env } from "process";

var Database = require('better-sqlite3');
var path = require('path');


export type Customer = {
    id: number
    name: string
    gst: string
    address: string
    supply: string
    sac: number
}

export class ResponseModel<T> {
    success: boolean = true
    message: string
    data: T | null
    constructor(success, message, data) {
        this.success = success;
        this.message = message;
        this.data = data

    }
}

const fs = require('fs');
const util = require('util');

const logpath =
  process.env.NODE_ENV === 'production'
    ? path.join(process.resourcesPath, 'assets')
    : __dirname;
const fileLog = fs.createWriteStream(path.join(logpath, 'server.log'), {
  flags: 'w',
});
const ErrorLog = fs.createWriteStream(path.join(logpath, 'error.log'), {
  flags: 'w',
});
const logOutput = process.stdout;
// the flag 'a' will update the stream log at every launch
console.log  = (e) => {
fileLog.write(util.format(e) + '\n');
logOutput.write(util.format(e) + '\n');
};


console.error = (e) => {
ErrorLog.write(util.format(e) + '\n');
}

export function connectDb(): typeof Database {

  try{

    var db= process.env.NODE_ENV==='production'?Database(path.join(process.resourcesPath, 'assets','database.db')):Database(path.join(__dirname, '../../assets','database.db'));
     db.pragma("journal_mode = WAL")
    return db;
  }
    catch(e){
     console.error(e)
    }


}



// Add new Customer

export function addCustomer(userData: Customer): ResponseModel<Customer> {
    const dbFile = connectDb();
    let stmt = dbFile.prepare(`INSERT INTO customers (name,gst,address,supply,sac) VALUES(@name,@gst,@address,@supply,@sac)`);
    var no = stmt.run(userData);
    if (no.changes > 0) {
        return new ResponseModel<Customer>(true, "Saved Successfully", null)
    }
    return new ResponseModel<Customer>(false, "Failed to Save", null)
}

// fetch all customer name

export function getCustomerNames(): ResponseModel<Array<{ id:number,name: string }>> {
    try {

        const dbFile = connectDb();
        let stmt = dbFile.prepare("SELECT id,concat(name, '(' , gst,'-',sac, ')') as name FROM customers");

        var data = stmt.all() as Array<{ id:number,name: string }>;

        return new ResponseModel(true, "Data Found", data);
    } catch (e) {
        return new ResponseModel(false, "Error ", e);
    }


}

// fetch customer from id

export function getCustomerDetails(id: number): ResponseModel<Customer | undefined> {
    try {
        var dbFile = connectDb()
        let stmt = dbFile.prepare("Select * from  customers where id=@id")
        var data = stmt.get({ id })
        if (data === null) {

            return new ResponseModel(false, "No data found", null)
        }
        return new ResponseModel(true, "Data Found", data)


    } catch (error) {
        return new ResponseModel(false, "Failed to Get the Data", null)
    }
}

// delete
export function deleteCustomerDetails(id: number): ResponseModel<undefined> {
    try {
        var dbFile = connectDb()
        let stmt = dbFile.prepare("delete from  customers where id=@id")
        var no = stmt.run({ id })
        if (no.changes > 0) {

            return new ResponseModel(true, "Deleted successfully", null)
        }
        if (no.changes === 0) {

            return new ResponseModel(true, "No Customer Found", null)
        }

        return new ResponseModel(false, "Failed to delete", null)


    } catch (error) {
        return new ResponseModel(false, "Failed to Get the Data", null)
    }
}
