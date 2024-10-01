import Manager from "../Manager";
import Player from "../Player";
//import DesktopServer from "./DesktopServer";
//import ServerIO from "./ServerIO";
//import WebSocketServer from "./WebSocketServer";


function write(client:Player,message:{message:string,param:object})
{
    if(client.isDesktop())
    {
        Manager.desktopServer.write(client,message);
        return;
    }
    Manager.webSocketServer.write(client,message);
}

export default write;