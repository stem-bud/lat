import * as net from "net";
import Player from "../Player";
//import serverIO from "./ServerIO";
import Manager from "../Manager";
import Game from "../Game";

class DesktopServer
{
    server:net.Server
    constructor(port:number)
    {
        this.server = net.createServer((client)=>
        {
            let Game:Game;
            let isPlayerOne:boolean;
            let inGame:boolean = false;
            client.on("data",(data)=>
            {
                if(!inGame)
                {
                    let joinGameString = data.toString();

                    if(joinGameString == "noCode")
                    {
                        Game = Manager.findFreeGame();
                        console.log(Game.name);
                        isPlayerOne = Game.setPlayer(client,true);
                        inGame = true;
                        return;
                    }

                    if(joinGameString == "specific")
                    {
                        Game = Manager.addGame();
                        Game.isSpecific = true;
                        console.log(Game.name);
                        isPlayerOne = Game.setPlayer(client,true);
                        Game.player1!.write({message:"gameCode",param:{gameCode:Game.name}});
                        inGame = true;
                        return;
                    }
                    Game = Manager.findGameByName(joinGameString);
                    isPlayerOne = Game.setPlayer(client,true);
                    inGame = true;
                    console.log("connected")
                    //console.log(Game.player1);
                    return;
                }

                if(Game.inSession)
                {   
                    Game.analyze(isPlayerOne,data.toString())
                }
            })
            client.on("error",(err:any)=>
            {
                if(err.code == "ECONNRESET")
                {
                    console.log("client disconnected");
                }
            })
        })

        this.server.listen(port,()=>
        {
            console.log(`listening on ${port}`);
        })
    }
    
    write(client: Player, message: { message: string; param: object; })
    {
        let strungMessage = JSON.stringify(message)+"|";
        client.player.write(Buffer.alloc(strungMessage.length,strungMessage));
    }
}


export default DesktopServer;