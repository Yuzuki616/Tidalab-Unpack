const { app, BrowserWindow, Tray, dialog, ipcMain, Menu } = require('electron')
const path = require('path')
const express = require('express')
const exec = require('child_process').spawn
const killPort = require('kill-port')

let win

function init () {
  // BrowserWindow
  const width = 400
  const height = 510
  win = new BrowserWindow({
    width,
    height,
    show: false,
    resizable: false,
    frame: false,
    maximizable: false,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      devTools: !app.isPackaged,
      nodeIntegration: true,
      webSecurity: false,
      enableRemoteModule: true
    }
  })

  // run uniproxy
  let uniproxyName = "darwin" === process.platform ? "singproxy" : "uniproxy.exe"
  killPort(33212)
  let uniproxy = exec(path.join(process.resourcesPath, "libs/", process.platform + "-" + process.arch, uniproxyName), [
    "-host",
    "127.0.0.1",
    "-port",
    "33212",
    "-conf",
    path.join(process.resourcesPath, "libs/", process.platform + "-" + process.arch, "config.json")
  ], {
    cwd: path.join(process.resourcesPath, "libs/", process.platform + "-" + process.arch)
  }, (err, stdout, stderr) => {
    if (err) {
      console.error(err)
      return
    }
    console.log(stderr)
    console.error(stdout)
  });

  if (app.isPackaged) {
    const server = express()
    server.use('/', express.static(__dirname))
    const srv = server.listen(0, '127.0.0.1', () => {
      if (srv.address().port) {
        win.loadURL(`http://127.0.0.1:${srv.address().port}/dist/index.html`)
      } else {
        win.loadFile('./dist/index.html')
      }
    })
  } else {
    win.loadURL('http://127.0.0.1:9000')
    win.webContents.openDevTools()
  }

  win.once('ready-to-show', () => {
    win.show()
  })

  win.on('close', (e) => {
    if(!global.isQuit) {
      e.preventDefault()
      if (typeof app.hide === 'function') app.hide()
    }
  })

  global.win = win
  global.isQuit = false
  // Tray
  const tray = new Tray(path.join(__dirname, process.platform === 'darwin' ? 'assets/iconOff@2x.png' : 'assets/iconOff.ico'))
  global.tray = tray
  // IPC
  ipcMain.on('show', () => {
    win.show()
  })
  ipcMain.on('quit', () => {
    uniproxy.kill()
    global.isQuit = true
    app.quit()
  })
}

if (process.platform === 'darwin') {
  app.dock.hide()
}

app.on('window-all-closed', (e) => {
  e.preventDefault()
  app.quit()
})

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (!win) return
    win.show()
  })

  app.on('ready', () => {
    init()
  })
}
