const path = require ('path');
const url = require ('url');
const {app, BrowserWindow} = require('electron');

let myWindow;
function createWindow() {
    myWindow = new BrowserWindow({
        width: 1150,
        height: 1000,
        webPreferences: {
            "nodeIntegration": true,
            "contextIsolation": false
        }
    });

    myWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes:true
    }));

    myWindow.webContents.openDevTools();

    myWindow.on('closed', () => {
        myWindow = null;
    });

}
app.on('ready', createWindow);

app.on('window-all-closed', () => {
    app.quit();
});
function some (str){
    console.log(str)
}
some('шалаш')