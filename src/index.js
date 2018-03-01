const electron = require('electron')

const app = electron.app
ipcMain = electron.ipcMain
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let workspaceWindow

function createWindow () {
  workspaceWindow = new BrowserWindow({width: 800, height: 200, frame: false})
  workspaceWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'workspace.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  //workspaceWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  workspaceWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    workspaceWindow = null
  })
}


let gitcloneWindow

function gitcloneWindowOpen(pathName) {
  gitcloneWindow = new BrowserWindow({width: 800, height: 200, frame: false})
  gitcloneWindow.argPathName = pathName
  gitcloneWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'gitclonewindow.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  //gitcloneWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  gitcloneWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.

    gitcloneWindow = null
  })  
}


let mainWindowGUI

function mainGUIWindowOpen () {
  mainWindowGUI = new BrowserWindow({width: 800, height: 600, frame: true})
  mainWindowGUI.loadURL(url.format({
    pathname: path.join(__dirname, 'maingui.html'),
    protocol: 'file:',
    slashes: true
  }))
  // Open the DevTools.
  //mainWindowGUI.webContents.openDevTools()

  // Emitted when the window is closed.
  //mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    //mainWindow = null
  //})
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.on('navigate', function(event, arg) {
  const nextWindow = arg.navigate;
  const pathName = arg.path[0];
  console.log(pathName)
  //console.log(arg);
  if (nextWindow == "gitclone") {
    gitcloneWindowOpen(pathName);
  }
  
})

ipcMain.on('gitclonerepo', function(event, arg) {
  console.log(arg);

  const fs = require('fs');
  const axios = require('axios');

  axios.request({
  responseType: 'arraybuffer',
  url: 'https://github.com/mohankumargupta/raspberrypi-ansible/archive/master.zip',
  method: 'get',
  headers: {
    'Content-Type': 'application/zip',
  },
}).then((result) => {
  const outputFilename = arg + path.sep + "master.zip";
  //console.log(outputFilename);
  fs.writeFileSync(outputFilename, result.data);
  unzip = require('node-unzip-2');
  console.log(arg);
  console.log(outputFilename);
  fs.createReadStream(outputFilename).pipe(unzip.Extract({ path: arg }));
  
  event.sender.send('downloadcomplete');
  mainGUIWindowOpen();
});


});


app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (workspaceWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
