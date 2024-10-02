//const net = require("net");
import tools from "http://127.0.0.1/tools";
import { vector } from "http://127.0.0.1/visuals";
import movement from "http://127.0.0.1/movement";

class player
{

    player;
    color = "rgb(255,255,255)";
    captainColor;
    opponentCaptainColor;
    pieces = [[{hasPiece:false,owned:false,isCaptain:false,position:new movement({x:0,y:0})}]];
    opponentColor;
    stroke;
    opponentStroke;
    isMyturn = false;

    todoArray = [];

    serverInstructions = 
    {
        movePiece:(param = {start:{x,y},end:{x,y}},num)=>
        {
            this.pieces[param.start.x][param.start.y].position.setDestination(param.end).then(()=>
            {
                let isCaptain = this.pieces[param.start.x][param.start.y].isCaptain;
                let owned = this.pieces[param.start.x][param.start.y].owned;
                this.pieces[param.start.x][param.start.y].hasPiece = false;
                this.pieces[param.start.x][param.start.y].isCaptain = false;
                this.pieces[param.start.x][param.start.y].owned = false;

                this.pieces[param.end.x][param.end.y].hasPiece = true;
                if(owned)
                {
                    this.pieces[param.end.x][param.end.y].owned = true;
                }

                if(isCaptain)
                {
                    this.pieces[param.end.x][param.end.y].isCaptain = true;
                }

                console.log(this.isMyturn);
                this.isMyturn = !this.isMyturn;
                console.log(this.isMyturn);
                this.nextAction(num);
            })
        },

        error:(param = {error:""},num)=>
        {
            console.log(param.error);
            this.nextAction(num);
        },

        gameEnd:(param={isWinner:true},num)=>
        {
            let banner = document.createElement("div");
            if(param.isWinner)
            {
                banner.className = "winner";
                banner.textContent = "You Win!"
            }else
            {
                banner.className = "loser";
                banner.textContent = "Unfortunately You Lost.";
            }
            document.body.appendChild(banner);
            this.isMyturn = false;
            setTimeout(()=>
            {
                banner.remove();
            },8000)
            this.nextAction(num);
        },

        endPiece:(param = {places:[{x,y}]},num)=>
        {
            for(let i = 0; i < param.places.length; i++)
            {
                this.pieces[param.places[i].x][param.places[i].y].hasPiece = false;
                this.pieces[param.places[i].x][param.places[i].y].isCaptain = false;
                this.pieces[param.places[i].x][param.places[i].y].owned = false;
            }
            this.nextAction(num);
        },

        resetBoard:(param = {starter:true},num)=>
        {
            this.isMyturn = param.starter;
            if(param.starter)
            {
                this.color = "rgb(235,235,235)";
                this.captainColor = "rgb(255,255,255)";
                this.stroke = "black";

                this.opponentColor = "rgb(20,20,20)";
                this.opponentCaptainColor = "rgb(0,0,0)";
                this.opponentStroke  = "white";

            }else
            {
                this.color = "rgb(20,20,20)";
                this.captainColor = "rgb(0,0,0)";
                this.stroke = "white";

                this.opponentColor = "rgb(235,235,235)";
                this.opponentCaptainColor = "rgb(255,255,255)";
                this.opponentStroke = "black";
            }

            for(let i = 0; i < 8; i++)
            {
                for(let fi = 9; fi < 12; fi++)
                {
                    this.pieces[i][fi].hasPiece = true;
                    this.pieces[i][fi].owned = true;
                }
            }
            this.pieces[4][8].hasPiece = true;
            this.pieces[4][8].owned = true;
            this.pieces[4][8].isCaptain = true;

            for(let i = 0; i < 8; i++)
            {
                for(let fi = 0; fi < 3; fi++)
                {
                    this.pieces[i][fi].hasPiece = true;
                }
            }
            
            this.pieces[3][3].hasPiece = true;
            this.pieces[3][3].isCaptain = true;
            /*let menu = document.getElementById("menu");

            if(menu.parentElement != document.head)
            {
                document.head.appendChild(menu);
            }*/
            let menu = document.getElementById("menuHolder");
            menu.className = `${menu.className} nodisplay`;

            this.nextAction(num);
        },

        gameCode:(param = {gameCode},num)=>
        {
            console.log(param.gameCode);
            let menu = document.getElementById("menu");
            menu.className = `${menu.className} nodisplay`;
            let codeDisplay = document.getElementById("codeDisplay")
            codeDisplay.className = "codeDisplay";
            let codeShower = document.getElementById("codeShower");
            codeShower.textContent = param.gameCode;
            this.nextAction(num);
        }
    }

    toServer = 
    {
        movePiece:(param = {start:{x,y},end:{x,y}})=>
        {
            this.write({message:"movePiece",param:param});
            console.log("wrote to move")
        }
    }

    nextAction(num = 0)
    {
        if(num == this.todoArray.length)
        {
            this.todoArray = [];
            return;
        }
        console.log("doing action");
        console.log(this.todoArray[num]);
        this.serverInstructions[this.todoArray[num].message](this.todoArray[num].param,num+1);
    }

    constructor(ip,port)
    {   
        this.pieces = [];
        for(let i = 0; i < 8; i++)
        {
            this.pieces[i] = [];
            for(let fi = 0; fi < 12; fi++)
            {
                this.pieces[i][fi] = {hasPiece:false,isCaptain:false,owned:false,position:new movement({x:i,y:fi})}
                this.pieces[i][fi].position.setSpan(500);
            }
        }
        this.player = new WebSocket(`ws://${ip}:${port}`);
    
        this.player.onopen = ()=>
        {
            console.log("hello");
        }

        this.player.onmessage = (data)=>
        {
            let strungData = data.data
            this.readMessage(strungData);
        }
    }

    readMessage(string = "")
    {
        let splitString = string.split('|');
        //console.log(splitString);
        for(let i = 0; i < splitString.length-1; i++)
        {
            let fromServer = JSON.parse(splitString[i]);
            this.addToToDoArray(fromServer);
            //this.serverInstructions[fromServer.message](fromServer.param);
            //console.log(fromServer);
        }
        /*let fromServer;
        try
        {
            fromServer = JSON.parse(string.substring(0,string.length-1));
        }catch(err)
        {
            console.log(string);
            return;
        }
        //triggers instructions based on message;
        console.log(fromServer);
        this.serverInstructions[fromServer.message](fromServer.param);*/
    }

    addToToDoArray(todo = {message:"",param:{}})
    {
        this.todoArray[this.todoArray.length] = todo;

        if(this.todoArray.length == 1)
        {
            this.nextAction(0);
        }
    }


    write(data = {})
    {
        let strungData = JSON.stringify(data);
        
        this.player.send(strungData+"|");

        //this.player.write(Buffer.alloc(strungData.length+1,strungData+"|"),"utf-8");

    }

    directWrite(strungData = "")
    {
        this.player.send(strungData)   
    }

    whereCanMove(place = {x,y})
    {
        console.log("hello");
        let canMoveArray = [];
        let horizontal = {x:1,y:0};
        let vertical = {x:0,y:1};
        for(let i = 0; i < 4; i++)
        {
            console.log(i);
            let direction = tools.modulo(Math.floor(i/2),2)*2-1;
            for(let fi = 1;true;fi++)
            {
                let axis = horizontal;
                if(tools.modulo(i,2) == 1)
                {
                    axis = vertical;
                }
                let onBoard = vector.staticAdd(place,vector.staticMult(axis,fi*direction));
                try
                {
                    if(this.pieces[onBoard.x][onBoard.y].hasPiece)
                    {
                        break;
                    }
                }catch
                {
                    break;
                }
                canMoveArray[canMoveArray.length] = {x:onBoard.x+0.5,y:onBoard.y+0.5};
            }
        }
        //console.log(canMoveArray);
        //console.log("hello");
        return canMoveArray;
    }
}


export default player;