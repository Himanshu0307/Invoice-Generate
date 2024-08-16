import { BrowserWindow, ipcMain, app } from 'electron';
import path from 'path';
import {
  Customer,
  addCustomer,
  deleteCustomerDetails,
  getCustomerDetails,
  getCustomerNames,
} from './Database.service';
import { resolveHtmlPath } from './util';

let mainWindow: BrowserWindow | null = null;

// Handle operations of Database
function handleDboperation() {
  // handle database  operations in the main process
  // add
  ipcMain.handle('customer:addCustomer', (e, customer: Customer) => {
    var response = addCustomer(customer);
    return response;
  });

  // delete customer
  ipcMain.handle('customer:delete', (e, id: number) => {
    var response = deleteCustomerDetails(id);
    return response;
  });

  // get customer
  ipcMain.handle('customer:getCustomerDetails', (e, id: number) => {
    var response = getCustomerDetails(id);
    return response;
  });

  // get customer names
  ipcMain.handle('customer:getCustomerNames', (e) => {
    var response = getCustomerNames();
    return response;
  });
}

const createWindow = async () => {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      webSecurity: false,
      preload: process.env.NODE_ENV === 'production'
          ? path.join(process.resourcesPath, 'app/dist/', 'main', 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

app
  .whenReady()
  .then(() => {
    handleDboperation();
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch((err) => {
    console.log(err);
  });
