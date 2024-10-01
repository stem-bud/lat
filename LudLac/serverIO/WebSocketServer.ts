//import * as WebSocket from "ws";
import * as WebSocket from "ws"
import Player from "../Player";
//import serverIO from "./ServerIO";
import Game from "../Game";
import Manager from "../Manager";

class WebSocketServer
{

    server:WebSocket.Server
    constructor(port:number)
    {
        this.server = new WebSocket.Server({port:port});
        console.log(`listening on ${port}`)
        this.server.on("connection",(client:any)=>
        {
            client.on("error",(e:string)=>
            {
                //console.log(e);
            })

            let Game:Game;
            let isPlayerOne:boolean;
            let inGame:boolean = false;

            client.on("message",(data:string)=>
            {
                if(!inGame)
                {
                    let joinGameString:string = data.toString();
                    if(joinGameString == "noCode")
                    {
                        Game = Manager.findFreeGame();
                        console.log(Game.name);
                        isPlayerOne = Game.setPlayer(client,false);
                        inGame = true;
                        return;
                    }

                    if(joinGameString == "specific")
                    {
                        Game = Manager.addGame();
                        Game.isSpecific = true;
                        console.log(Game.name);
                        isPlayerOne = Game.setPlayer(client,false);
                        Game.player1!.write({message:"gameCode",param:{gameCode:Game.name}});
                        inGame = true;
                        return
                    }

                    Game = Manager.findGameByName(joinGameString);
                    isPlayerOne = Game.setPlayer(client,false);
                    inGame = true
                    console.log("connected");
                    return;
                }
                
                if(Game.inSession)
                {
                    Game.analyze(isPlayerOne,data.toString());
                }
            })
        })
    }

    write(client: Player, message: { message: string; param: object; })
    {
        let strungMessage = JSON.stringify(message)+"|";
        client.player.send(strungMessage);
    }
    
}
export default WebSocketServer;