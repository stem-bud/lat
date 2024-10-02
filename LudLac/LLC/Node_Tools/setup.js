import tools from "http://127.0.0.1/tools"

import {vector,canvas,camera} from "http://127.0.0.1/visuals"


class setup
{
    myCanvas;
    myCamera;
    mouse;
    mouseOnCanvas;
    mouseDown = false;
    allowedToFocus;
    wheelEvent = (e)=>
    {
        this.myCamera.zoomChange(((e.deltaY > 0)*2)-1);
        this.myCamera.setCenter(this.myCamera.showPointAt(this.mouseOnCanvas,this.mouse));
    }

    mouseMoveEvent = (e)=>
    {
        //console.log("hello");
        if(this.allowedToFocus)
        {
            let mouseBefore = new vector();
            mouseBefore.set(this.mouse);
            this.myCamera.appendPoint(this.mouse);
            let offSet = tools.getOffset(this.myCanvas.getCanvas().parentElement);
            //console.log(offSet);
            offSet.x+=this.myCanvas.position.x;
            offSet.y+=this.myCanvas.position.y;
            let realMouse = {x:e.clientX,y:e.clientY};
            this.mouse.set(vector.staticSub(realMouse,offSet));
            let difference = vector.staticSub(this.mouse,mouseBefore);
            difference.mult(-1/this.myCamera.scale);
            this.mouseOnCanvas.set(this.myCamera.trueDistance(this.mouse));
            if(this.mouseDown)
            {
                this.myCamera.setCenter(vector.staticAdd(this.myCamera.center,difference));
            }
        }
    }
    constructor(color,position = {x:0,y:0},size = {x:screen.width,y:screen.height})
    {
        this.mouse = new vector();
        this.myCanvas = new canvas(color,position,size);
        this.myCamera = new camera();
        this.mouseOnCanvas = this.myCamera.trueDistance(this.mouse);
        console.log("hello");
    }

    overridemouseMoveEvent(func=(e)=>{})
    {
        this.mouseMoveEvent = func;
    }

    overrideWheelEvent(func=(e)=>{})
    {
        this.wheelEvent = func;
    }

    setup(parent = document.body)
    {   
        this.myCamera.exponentialZoomFactor(0.98);
        this.myCanvas.setParent(parent);
        this.myCanvas.createCanvas();
        this.myCanvas.setTranslateAndScale(this.myCamera);
        this.myCanvas.getCanvas().addEventListener("wheel",/*(e)=>
        {
            this.myCamera.zoomChange(((e.deltaY > 0)*2)-1);
            this.myCamera.setCenter(this.myCamera.showPointAt(this.mouseOnCanvas,this.mouse));
        }*/this.wheelEvent)

            this.myCanvas.getCanvas().addEventListener("mousemove",/*(e)=>
            {
                //console.log("hello");
                if(this.allowedToFocus)
                {
                    let mouseBefore = new vector();
                    mouseBefore.set(this.mouse);
                    this.myCamera.appendPoint(this.mouse);
                    let offSet = tools.getOffset(this.myCanvas.getCanvas().parentElement);
                    //console.log(offSet);
                    offSet.x+=this.myCanvas.position.x;
                    offSet.y+=this.myCanvas.position.y;
                    let realMouse = {x:e.clientX,y:e.clientY};
                    this.mouse.set(vector.staticSub(realMouse,offSet));
                    let difference = vector.staticSub(this.mouse,mouseBefore);
                    difference.mult(-1/this.myCamera.scale);
                    this.mouseOnCanvas.set(this.myCamera.trueDistance(this.mouse));
                    if(this.mouseDown)
                    {
                        this.myCamera.setCenter(vector.staticAdd(this.myCamera.center,difference));
                    }
                }
            }*/this.mouseMoveEvent)
            
        addEventListener("mousedown",()=>
        {
            this.mouseDown = true;
        })
        addEventListener("mouseup",()=>
        {
            this.mouseDown = false;
        })
    }
    getCamera()
    {
        return this.myCamera;
    }

    getMouse()
    {
        return this.mouse;
    }

    getCanvas()
    {
        return this.myCanvas;
    }
}



export default setup;