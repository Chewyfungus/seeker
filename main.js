// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const save = path.join(__dirname, "/data/save.json");
const fs = require("fs");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

async function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width : 1200,
    height : 800,
    webPreferences: {
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

//ipcMain.on("toMain", (event, args) => {
//  fs.readFile((path + "/data/save.json"), (error, data) => {
//    // Do something with file contents
//    var testVar = path;
//    // Send result back to renderer process
//    win.webContents.send("fromMain", testVar);
//  });
//});

function testRead(save) {
  var returnData;
  fs.readFile(save, 'utf8' , (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("small wow " + JSON.parse(data));
    mainWindow.webContents.send('fromMain', JSON.stringify(data));
  })
}

ipcMain.on('toMain', (event, arg) => {
  console.log(arg); // prints "ping"
  console.log(save);
  testRead(save);
  console.log("wow " + testRead(save));
  // mainWindow.webContents.send('fromMain', testRead(save));
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
