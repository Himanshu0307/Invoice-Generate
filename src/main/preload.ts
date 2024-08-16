
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { addCustomer, Customer, getCustomerNames, } from './service/Database.service';

export type Channels = 'mediator';

const electronHandler = {
    testFun:"Hello",
    ipcRenderer: {
        sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
        },
        on(channel: Channels, func: (...args: unknown[]) => void) {
            const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
                func(...args);
            ipcRenderer.on(channel, subscription);

            return () => {
                ipcRenderer.removeListener(channel, subscription);
            };
        },
        once(channel: Channels, func: (...args: unknown[]) => void) {
            ipcRenderer.once(channel, (_event, ...args) => func(...args));
        },
    },


    // insert Customer
    addCustomers: (customer: Customer) => ipcRenderer.invoke("customer:addCustomer", customer),
    // get customer details from id
    getCustomerDetail: (id: number) => ipcRenderer.invoke("customer:getCustomerDetails", id),
    // delete customer  by id
    deleteCustomer:(id:number)=>ipcRenderer.invoke("customer:delete",id),
    // get all customer names
    getCustomerName:()=>ipcRenderer.invoke("customer:getCustomerNames"),


};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
