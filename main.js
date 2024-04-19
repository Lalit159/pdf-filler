const { app, BrowserWindow } = require('electron')
const Renderer = require('electron/renderer')
const path = require('node:path')

const createWindow = () => {
    const win = new BrowserWindow({ // creating new browser window
      width: 800,
      height: 600,
    //   webPreferences:{ // attach preload script to renderer processes
    //     preload: path.join(__dirname, 'preload.js') // load and execute the preload.js script in the renderer process before loading any web page content. 
    //   }
    })
  
    win.loadFile('index.html') // load html file in the window
  }

  app.whenReady().then(() => { // create window after the app is ready
    createWindow()
  })