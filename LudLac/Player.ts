import Manager from "./Manager";
import write from "./serverIO/Server";
import Server from "./serverIO/Server";

class Player
{
    player:any;
    private isDesktopClient:boolean;
    score:number = 24;
    headScore:number = 1;
    constructor(client:any,isDesktop = false)
    {
        this.player = client;
        this.isDesktopClient = isDesktop;
    }

    write(message:{message:string,param:object})
    {
        //write(this,message);
        write(this,message);
    }

    isDesktop()
    {
        return this.isDesktopClient;
    }
}

export default Player;