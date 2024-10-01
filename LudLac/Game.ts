import Player from "./Player";

import Tools from "../Node_Tools(TS)/Tools"

import Vector from "../Node_Tools(TS)/Vector";


class Game
{
    player1 : Player|undefined;
    player2 : Player|undefined;
    inSession = false;
    pieces:{isPlayerOne:boolean,isPlayerTwo:boolean,killReq:number,killNum:number}[][];
    awaitingPlayer1:boolean|undefined;
    isSpecific:boolean = false;
    name:string;
    instructions:any = 
    {
        movePiece:(param:{start:{x:number,y:number},end:{x:number,y:number}},isPlayerOne:boolean)=>
        {
            if(this.awaitingPlayer1 != isPlayerOne)
            {
                return;
            }
            let flipped = {start:this.flip(param.start),end:this.flip(param.end)}
            if(!isPlayerOne)
            {
                if(!this.canMove(flipped))
                {
                    this.player2!.write({message:"error",param:{error:"try again"}});
                    return;
                }
                this.pieces[flipped.start.x][flipped.start.y].isPlayerTwo = false;
                this.pieces[flipped.end.x][flipped.end.y].isPlayerTwo = true;
                this.pieces[flipped.end.x][flipped.end.y].killReq = this.pieces[flipped.start.x][flipped.start.y].killReq;
                console.log("player 2");
                let kill = this.analyzeBoard(flipped.end);
                this.player1!.write({message:"movePiece",param:flipped});
                this.player2!.write({message:"movePiece",param:param});
                if(kill.length > 0)
                {
                    for(let i = 0; i < kill.length; i++)
                    {
                        this.pieces[kill[i].x][kill[i].y].isPlayerOne = false;
                        this.pieces[kill[i].x][kill[i].y].isPlayerTwo = false;
                    }
                    this.player1!.write({message:"endPiece",param:{places:kill}});
                    this.player2!.write({message:"endPiece",param:{places:this.flipArray(kill)}});
                    for(let i = 0; i < kill.length; i++)
                    {
                        if(this.pieces[kill[i].x][kill[i].y].killReq == 2)
                        {
                            this.player1!.write({message:"gameEnd",param:{isWinner:false}});
                            this.player2!.write({message:"gameEnd",param:{isWinner:true}});
                            continue;
                        }
                    }
                    this.player1!.score-=kill.length;
                    console.log(this.player1!.score);
                    if(this.player1!.score == 0)
                    {
                        this.player1!.write({message:"gameEnd",param:{isWinner:false}});
                        this.player2!.write({message:"gameEnd",param:{isWinner:true}});
                    }
                }
                this.awaitingPlayer1 = true;
                return;
            }

            if(!this.canMove(param))
            {
                this.player1!.write({message:"error",param:{error:"try again"}});
                return;
            }
            

            this.pieces[param.start.x][param.start.y].isPlayerOne = false;
            this.pieces[param.end.x][param.end.y].isPlayerOne = true;
            this.pieces[param.end.x][param.end.y].killReq = this.pieces[param.start.x][param.start.y].killReq;
            console.log("player 1");
            
            let kill = this.analyzeBoard(param.end);
            //console.log(kill);
            this.player2!.write({message:"movePiece",param:flipped});
            this.player1!.write({message:"movePiece",param:param});
            if(kill.length > 0)
            {
                for(let i = 0; i < kill.length; i++)
                {
                    this.pieces[kill[i].x][kill[i].y].isPlayerOne = false;
                    this.pieces[kill[i].x][kill[i].y].isPlayerTwo = false;
                }

                this.player1!.write({message:"endPiece",param:{places:kill}});
                this.player2!.write({message:"endPiece",param:{places:this.flipArray(kill)}});
                for(let i = 0; i < kill.length; i++)
                {
                    if(this.pieces[kill[i].x][kill[i].y].killReq == 2)
                    {
                        this.player1!.write({message:"gameEnd",param:{isWinner:true}});
                        this.player2!.write({message:"gameEnd",param:{isWinner:false}});
                        continue;
                    }
                }
                this.player2!.score-=kill.length;

                console.log(this.player2!.score);
                if(this.player2!.score == 0)
                {
                    this.player1!.write({message:"gameEnd",param:{isWinner:true}});
                    this.player2!.write({message:"gameEnd",param:{isWinner:false}});
                }
            }
            this.awaitingPlayer1 = false;
        }
    }
    

    flip(place:{x:number,y:number}):{x:number,y:number}
    {
        return {x:7-place.x,y:11-place.y};
    }

    flipArray(places:{x:number,y:number}[]):{x:number,y:number}[]
    {
        let arr:{x:number,y:number}[] = [];

        for(let i = 0; i < places.length; i++)
        {
            arr[arr.length] = this.flip(places[i]);
        }

        return arr;
    }

    analyzeBoard(end:{x:number,y:number}):{x:number,y:number}[]
    {
        console.log("start anew");
        let kill:{x:number,y:number}[] = [];

        for(let i = -1; i < 2; i++)
        {
            let place = Vector.staticAdd(end,{x:i,y:0});
            if(Tools.modulo(i,2) == 1)
            {
                try
                {
                    if(this.horizontal(place,this.pieces[place.x][place.y].killReq))
                    {
                        kill[kill.length] = {x:place.x,y:place.y};
                    }
                }catch
                {

                }
            }

        }

        for(let i = -1; i < 2; i++)
        {
            let place = Vector.staticAdd(end,{x:0,y:i});
            if(Tools.modulo(i,2) == 1)
            {
                try
                {
                    if(this.vertical(place,this.pieces[place.x][place.y].killReq))
                    {
                        kill[kill.length] = {x:place.x,y:place.y};
                    }
                }catch
                {
                    
                }
            }
        }

        return kill;        
    }

    horizontal(place:{x:number,y:number},num:number):boolean
    {
        let piecePlace = this.pieces[place.x][place.y];
        let left = this.pieces[place.x-1][place.y];
        let right = this.pieces[place.x+1][place.y];
        if(!(piecePlace.isPlayerOne || piecePlace.isPlayerTwo ))
        {
            return false;
        }

        if(num == 2)
        {
            return this.isSurrounded(place);
        }

        if((left.isPlayerOne && piecePlace.isPlayerTwo && right.isPlayerOne) || (left.isPlayerTwo && piecePlace.isPlayerOne && right.isPlayerTwo))
        {
            return true;
        }
        return false;
    }

    vertical(place:{x:number,y:number},num:number):boolean
    {
        let piecePlace = this.pieces[place.x][place.y];
        let up = this.pieces[place.x][place.y-1];
        let down = this.pieces[place.x][place.y+1];

        if(!(piecePlace.isPlayerOne || piecePlace.isPlayerTwo))
        {
            return false;
        }

        if(num == 2)
        {
            return this.isSurrounded(place);
        }

        if((up.isPlayerOne && piecePlace.isPlayerTwo && down.isPlayerOne) || (up.isPlayerTwo && piecePlace.isPlayerOne && down.isPlayerTwo))
        {
            return true;
        }
        return false;
    }

    isSurrounded(place:{x:number,y:number}):boolean
    {
        return (this.vertical(place,1) && this.horizontal(place,1));
    }

    canMove(movement:{start:{x:number,y:number},end:{x:number,y:number}})
    {
        if((movement.start.x == movement.end.x) == (movement.start.y == movement.end.y))
        {
            return false;   
        }
        //console.log("on the same line")
        let distance = Vector.staticSub(movement.end,movement.start);
        distance.normalize();
        for(let i = 1; i <= Vector.distance(movement.start,movement.end); i++)
        {
            let checkPlace = Vector.staticAdd(Vector.staticMult(distance,i),movement.start);
            if(this.pieces[checkPlace.x][checkPlace.y].isPlayerOne || this.pieces[checkPlace.x][checkPlace.y].isPlayerTwo)
            {
                return false;
            }
        }
        return true;
    }

    constructor(name:string)
    {
        
        this.name = name;
        this.pieces = [];
        for(let i = 0; i < 8; i++)
        {
            this.pieces[i] = [];
            for(let fi = 0; fi < 12; fi++)
            {
                this.pieces[i][fi] = {isPlayerOne:false,isPlayerTwo:false,killReq:0,killNum:0};
            }
        }

        for(let i = 0; i < 8; i++)
        {
            for(let fi = 0; fi < 3; fi++)
            {
                this.pieces[i][fi].isPlayerTwo = true
                this.pieces[i][fi].killReq = 1;
            }
        }
        this.pieces[3][3].isPlayerTwo = true
        this.pieces[3][3].killReq = 2;

        for(let i = 0; i < 8; i++)
        {
            for(let fi = 9; fi < 12; fi++)
            {
                this.pieces[i][fi].isPlayerOne = true
                this.pieces[i][fi].killReq = 1;
            }
        }
        this.pieces[4][8].isPlayerOne = true
        this.pieces[4][8].killReq = 2;
    }

    startGame()
    {
        this.inSession = true;
        if(Tools.random(0,1) > 0.5)
        {
            this.player1!.write({message:"resetBoard",param:{starter:true}});
            this.player2!.write({message:"resetBoard",param:{starter:false}});
            this.awaitingPlayer1 = true;
        }else
        {
            this.player1!.write({message:"resetBoard",param:{starter:false}});
            this.player2!.write({message:"resetBoard",param:{starter:true}});
            this.awaitingPlayer1 = false;
        }
    }

    setPlayer(client:any,isDesktop:boolean)
    {
        if(this.inSession)
        {
            throw "all full";
        }

        if(this.player1)
        {
            this.player2 = new Player(client,isDesktop);
            this.startGame();
            return false;
        }
        this.player1 = new Player(client,isDesktop);
        return true;
    }

    analyze(isPlayerOne:boolean,string:string)
    {
        let instruction:{message:string,param:object} = JSON.parse(string.substring(0,string.length-1));
        try
        {
            this.instructions[instruction.message](instruction.param,isPlayerOne);
        }catch
        {
            
        }
    }
}

export default Game