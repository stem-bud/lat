const {BrowserWindow,app,Menu} = require("electron");


function createWindow()
{
    let win = new BrowserWindow(
        {
            width:600,
            height:400,
            webPreferences:
            {
                nodeIntegration:true,
                contextIsolation:false
            }
        })
    win.loadFile("./index.html");
}


app.whenReady().then(createWindow);
//App