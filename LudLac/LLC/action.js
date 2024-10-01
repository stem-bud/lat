import player from "http://example.com/player";
import setup from "http://example.com/setup";
import vector from "http://example.com/vector"


const onlyPlayer = new player("example.com",5000);

const canvasAndCamera = new setup("lightblue",{x:0,y:0},{x:screen.width,y:screen.height});
canvasAndCamera.setup(document.body);
canvasAndCamera.allowedToFocus = true;
const camera = canvasAndCamera.getCamera();
camera.setPositionOnScreen({x:screen.width/2,y:screen.height/2})
camera.setCenter({x:4,y:6});
camera.expZPower = -200;
camera.zoomChange(0)
const canvas = canvasAndCamera.getCanvas();
const mouse = canvasAndCamera.getMouse();

let horizontalLines = [];

for(let i = 0; i < 12; i++)
{   
    if(i%2 == 0)
    {
        horizontalLines = horizontalLines.concat([{x:0,y:i},{x:8,y:i},{x:8,y:(i+1)}]);
    }else
    {
        horizontalLines =  horizontalLines.concat([{x:8,y:i},{x:0,y:i},{x:0,y:(i+1)}]);
    }
}

let verticalLines = [];
for(let i = 0; i < 8; i++)
{
    if(i%2 == 0)
    {
        verticalLines = verticalLines.concat([{x:i,y:0},{x:i,y:12},{x:i+1,y:12}])
    }else
    {
        verticalLines = verticalLines.concat([{x:i,y:12},{x:i,y:0},{x:i+1,y:0}]);
    }
}

let board = [{x:0,y:0},{x:8,y:0},{x:8,y:12},{x: 0,y:12}];


let floorMouse;
let selected = null;
let canMoveArray = [];
setInterval(()=>
{
    let onCanvas = camera.trueDistance(mouse);
    canvas.clear();
    canvas.fill("rgb(242, 159, 94)");
    canvas.strokeStyle("black");
    canvas.polygon(canvas.calculatePolygons(board),true);
    canvas.fill("transparent");
    canvas.polygon(canvas.calculatePolygons(horizontalLines));
    canvas.polygon(canvas.calculatePolygons(verticalLines));
    floorMouse = {x:Math.floor(onCanvas.x),y:Math.floor(onCanvas.y)};


    canvas.fill(onlyPlayer.color);
    canvas.strokeStyle("transparent");
    canvas.lineWidth(3);
    for(let i = 0; i < onlyPlayer.pieces.length; i++)
    {
        for(let fi = 0; fi < onlyPlayer.pieces[i].length; fi++)
        {
            if(onlyPlayer.pieces[i][fi].hasPiece)
            {
                if(onlyPlayer.pieces[i][fi].owned)
                {
                    canvas.fill(onlyPlayer.color);
                    canvas.strokeStyle("transparent");
                    if(onlyPlayer.pieces[i][fi].isCaptain)
                    {
                        canvas.strokeStyle(onlyPlayer.stroke);
                        canvas.fill(onlyPlayer.captainColor);
                    }
                    let piecePosition =  onlyPlayer.pieces[i][fi].position.input(Date.now());
                    piecePosition = camera.recalculatePosition({x:piecePosition.x+0.5,y:piecePosition.y+0.5});
                    canvas.ellipse(piecePosition.x,piecePosition.y,camera.scale*0.75,camera.scale*0.75);
                }else
                {
                    canvas.fill(onlyPlayer.opponentColor);
                    canvas.strokeStyle("transparent");
                    if(onlyPlayer.pieces[i][fi].isCaptain)
                    {
                        canvas.strokeStyle(onlyPlayer.opponentStroke);
                        canvas.fill(onlyPlayer.opponentCaptainColor);
                    }
                    let piecePosition =  onlyPlayer.pieces[i][fi].position.input(Date.now());
                    piecePosition = camera.recalculatePosition({x:piecePosition.x+0.5,y:piecePosition.y+0.5});
                    canvas.ellipse(piecePosition.x,piecePosition.y,camera.scale*0.75,camera.scale*0.75);
                }
            }
        }
    }
    canvas.lineWidth(1);
    canvas.strokeStyle("transparent");
    canvas.fill("rgba(100,130,50,0.4)");
    for(let i = 0; i < canMoveArray.length; i++)
    {
        let place = camera.recalculatePosition(canMoveArray[i]);
        canvas.ellipse(place.x,place.y,camera.scale*0.75,camera.scale*0.75);
    }

    if(onlyPlayer.isMyturn)
    {
        canvas.strokeStyle("transparent");
        canvas.fill("rgba(255,255,0,0.5)");
        if(selected)
        {
            canvas.fill("rgba(255,255,0,0.8)");
            canvas.polygon(canvas.calculatePolygons([{x:selected.x,y:selected.y},{x:selected.x+1,y:selected.y},{x:selected.x+1,y:selected.y+1},{x:selected.x,y:selected.y+1}]));
            return;
        }
        if(floorMouse.x > -1 && floorMouse.x < 8 && floorMouse.y > -1 && floorMouse.y < 12)
        {
            canvas.polygon(canvas.calculatePolygons([{x:floorMouse.x,y:floorMouse.y},{x:floorMouse.x+1,y:floorMouse.y},{x:floorMouse.x+1,y:floorMouse.y+1},{x:floorMouse.x,y:floorMouse.y+1}]));
        }
    }
},10)


canvas.getCanvas().addEventListener("mouseup",(e)=>
{   

    if(onlyPlayer.isMyturn)
    {    
        try
        {
            if(selected)
            {
                if(vector.staticEqual(selected,floorMouse))
                {
                    selected = null;
                    canMoveArray = [];
                    return;
                }
                if((selected.x == floorMouse.x) ^ (selected.y == floorMouse.y))
                {
                    onlyPlayer.pieces[floorMouse.x][floorMouse.y].owned;
                    onlyPlayer.toServer.movePiece({start:selected,end:floorMouse});
                    selected = null;
                    canMoveArray = [];
                }
                return;
            }
            
            if(onlyPlayer.pieces[floorMouse.x][floorMouse.y].owned)
            {
                selected = {x:floorMouse.x,y:floorMouse.y};
                console.log("selected");
                canMoveArray = onlyPlayer.whereCanMove(selected);
            }
        }catch
        {

        }
    }
})


let newGame = document.getElementById("NewGame");

let randomGame = document.getElementById("RandomGame");

let join = document.getElementById("join");

let input = document.getElementById("input");

newGame.addEventListener("mouseup",()=>
{
    onlyPlayer.directWrite("specific");
})

randomGame.addEventListener("mouseup",()=>
{
    onlyPlayer.directWrite("noCode");
})


join.addEventListener("mouseup",()=>
{
    onlyPlayer.directWrite(input.value);
})

