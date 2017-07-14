const electron = require('electron')
const MenuTemplates = require('./menu_templates.js')
//module to control application life
const app = electron.app
//module to create native browser window
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

//global reference to the window object otherwise window will close
//on gc
let mainWindow


const menu = electron.Menu.buildFromTemplate(MenuTemplates.debug_template);
electron.Menu.setApplicationMenu(menu);

function createWindow() {
  mainWindow = new BrowserWindow({width: 1050, height: 980})

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))


  //emitted when the window is closed
  mainWindow.on('closed', function () {
  //if you have multiple windows you would store them in an array
  mainWindow = null;
  })
}
//method called when electron has finished initializtion and is ready to create
//browser windows. some apis can only be used after this event occurs
app.on('ready', createWindow)

//an osx thing
app.on('window-all-closed', function() {
  if(process.platform !== 'darwin') {
    app.quit()
  }
})

//another osx thing
app.on('activate', function() {
  if(mainWindow == null) {
    createWindow();
  }
})
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
