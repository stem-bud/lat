import Tools from "../Node_Tools(TS)/Tools";

import Game from "./Game";
import DesktopServer from "./serverIO/DesktopServer";
import WebSocketServer from "./serverIO/WebSocketServer";

class Manager
{
    static webSocketServer:WebSocketServer
    static desktopServer:DesktopServer
    static games:Game[];
    private static instance:Manager;
    constructor(desktopPort:number,webSocketPort:number)
    {
        if(Manager.instance)
        {
            throw "already assigned";
        }
        Manager.webSocketServer = new WebSocketServer(webSocketPort);
        Manager.desktopServer = new DesktopServer(desktopPort);
        Manager.games = [];
        Manager.instance = this;
    }

    static findFreeGame()
    {
        for(let i = 0; i < Manager.games.length; i++)
        {
            if(!Manager.games[i].inSession && !Manager.games[i].isSpecific)
            {
                return Manager.games[i];
            }
        }
        let name = Manager.uniqueName();
        Manager.games[Manager.games.length] = new Game(name);
        return Manager.games[Manager.games.length-1];
    }

    static uniqueName()
    {
        let name = Math.round(Tools.random(0,10000000000)).toString(36);
        for(;Manager.nameExist(name); name = Math.round(Tools.random(0,10000000000)).toString(36))
        {

        }
        return name;
    }

    static nameExist(name:string)
    {
        for(let i = 0; i < Manager.games.length; i++)
        {
            if(Manager.games[i].name == name)
            {
                return true;
            }
        }
        return false;
    }

    static addGame()
    {
        let name = Manager.uniqueName();
        Manager.games[Manager.games.length] = new Game(name);
        return Manager.games[Manager.games.length-1];
    }

    static findGameByName(name:string)
    {
        for(let i = 0; i < Manager.games.length; i++)
        {
            if(Manager.games[i].name == name)
            {
                return Manager.games[i];
            }
        }
        return Manager.findFreeGame();
    }
}



export default Manager;