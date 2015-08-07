/* Requires */
var app = require('app');
var config = require('./config.json');
var BrowserWindow = require('browser-window');

require('crash-reporter').start();


/* Variables */
var mainWindow = null;


/* Callbacks */
app.on('window-all-closed', function() {
    if (process.platform != 'darwin')
        app.quit();
});

app.on('ready', function() {
    mainWindow = new BrowserWindow({
        show: false,
        width: 1400,
        height: 658,
        center: true,
        frame: false,
        transparent: true,
        resizeable: false,
        icon: 'public/img/logo.png'
    });

    mainWindow.loadUrl('file://' + __dirname + '/index.html');

    mainWindow.webContents.on('did-finish-load', function() {
        if(config.debug) {
            mainWindow.openDevTools();
        }
        
        mainWindow.show();
        mainWindow.focus();
    });

    mainWindow.on('closed', function() {
        mainWindow = null;
    });
});