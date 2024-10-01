import Manager from "./Manager";
import * as http from "http"
import * as fs from "fs"

const manager = new Manager(3600,5000);


let fileCorrespondants:any =
{
    "/":"/index.html",
    "/layout":"/layout.css",
    "/action": "/action.js",
    "/icon":"/icon.png",
    "/favicon.ico":"/favicon.ico",
    "/player":"/player.js",
    "/vector":"/Node_Tools/vector.js",
    "/setup":"/Node_Tools/setup.js",
    "/visuals": "/Node_Tools/visuals.js",
    "/tools": "/Node_Tools/tools.js",
    "/canvas":"/Node_Tools/canvas.js",
    "/camera":"/Node_Tools/camera.js",
    "/images":"/Node_Tools/images.js",
    "/movement":"/movement.js"
}

let headerCorrespondants:any = 
{
    "html":"text/html",
    "js":"text/javascript",
    "png":"image/png",
    "css":"text/css",
    "ico":"image/x-icon"
}


function getFile(url:any)
{
    console.log(url);
    let resolveFunc:(value:unknown)=>void;
    let rejectFunc:(value:unknown)=>void;
    let promise = new Promise((resolve,reject)=>
    {
        resolveFunc = resolve;
        rejectFunc = reject;
    })
    let fileName:string = fileCorrespondants[url];

    let fileEnd:string;

    try
    {
        fileEnd = headerCorrespondants[fileName.split(".")[1]];

        fs.readFile(`./LLC${fileName}`,(err,data)=>
        {
            if(err)
            {
                rejectFunc(err);
                return;
            }
            //console.log(fileEnd);
            resolveFunc((fileEnd == "image/png" || fileEnd == "image/x-icon")?data:data.toString());
        })
    }catch(err)
    {
        setTimeout(()=>
        {
            rejectFunc(err);
        },1)
    }
    return {promise:promise,header:fileEnd!};
}

const server = http.createServer((req,res)=>
{
    let headerAndPromise = getFile(req.url)

    headerAndPromise.promise.then((e)=>
    {
        res.statusCode = 202;
        res.setHeader("Content-Type",headerAndPromise.header);
        res.setHeader("Access-Control-Allow-Origin",/*"http://latronesonline.com"*/"*");
        res.end(e);
    }).catch((e)=>
    {
        console.log(e);
    })
})


server.listen(80,()=>
{
    console.log("listening on port 80")
})



/*const sServer = http.createServer((req,res)=>
{
    console.log("https request");
    console.log(req);
})


sServer.listen(443,()=>
{
    console.log("listening on port 443");
})*/