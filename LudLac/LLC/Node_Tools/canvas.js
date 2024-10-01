import image from "http://example.com/images";
import vector from "http://example.com/vector";


class canvas
{
    ctx;
    myCanvas;
    size;
    position;
    color;
    ableToMove;
    fontSize = '12px';
    fontStyle = 'arial';

    images =
    {

    }

    constructor(color,position = {x:0,y:0},size = {x: 500,y: 400})
    {
        this.myCanvas = document.createElement("canvas");
        this.position = position;
        this.size = size;
        this.color = color;
        //this.ctx = this.myCanvas.getContext('2d');
    }

    noStroke()
    {
        this.ctx.strokeStyle = "transparent";
    }

    setFontSize(num = 13)
    {
        this.fontSize = num+'px';
        this.ctx.font = this.fontSize+' '+this.fontStyle;
    }

    setFontFamily(style)
    {
        this.fontStyle = style;
        this.ctx.font = this.fontStyle+' '+this.fontStyle;
    }

    setCanvas(color,size,position = this.position)
    {
        this.color = color;
        this.size = size;
        this.position = position;
    }
    createCanvas()
    {
        this.myCanvas.style.position = 'absolute';
        this.ctx = this.myCanvas.getContext('2d');
        this.myCanvas.style.left = `${this.position.x}`;
        this.myCanvas.style.top = `${this.position.y}`;
        this.myCanvas.width = this.size.x;
        this.myCanvas.height = this.size.y;
        this.myCanvas.style.backgroundColor = this.color;
        this.ctx.font = this.fontSize+' '+this.fontStyle;
    }
    setParent(parent)
    {
        parent.appendChild(this.myCanvas);
    }
    fill(r="white")
    {
        this.ctx.fillStyle = r
    }

    strokeStyle(style = "black")
    {
        this.ctx.strokeStyle = style;
    }

    lineWidth(width)
    {
        this.ctx.lineWidth = width;
    }

    getCanvas()
    {
        return this.myCanvas
    }

    rect(x,y,w,h)
    {
        this.ctx.beginPath();
        this.ctx.rect(x,y,w,h);
        this.ctx.fill();
    }
    ellipse(x,y,w,h)
    {
        this.ctx.beginPath();
        this.ctx.ellipse(x,y,w/2,h/2,0,0,Math.PI*2);
        this.ctx.stroke();
        this.ctx.fill();
    }

    addImage(name,src,onZero = 10)
    {
        this.images[name] = new image(src,onZero);
    }

    drawImage(name="",position = {x:0,y:0},scale = true)
    {
        if(!scale)
        {
            this.ctx.drawImage(this.images[name].element,position.x,position.y,this.images[name].onZero,this.images[name].onZero*this.images[name].ratio);
            return;
        }
        let pos = this.translateAndScale(position);
        console.log(this.basicRescale(1));
        this.ctx.drawImage(this.images[name].element,pos.x,pos.y,this.images[name].onZero*this.basicRescale(1),this.images[name].onZero*this.images[name].ratio*this.basicRescale(1));
    }

    text(t,x,y){
        this.ctx.fillText(t,x,y);
    }

    point(x,y)
    {
        this.ellipse(x,y,1,1);
    }

    clear()
    {
        this.ctx.clearRect(0,0,this.myCanvas.width,this.myCanvas.height)
    }

    line(x1 = 10,y1 = 10,x2 = 20,y2 = 20)
    {
        this.polygon([{x:x1,y:y1},{x:x2,y:y2}])
    }

    polygon(arr,complete = false)
    {
        this.ctx.beginPath();
        //let translated = this.translateAndScale(vector.staticAdd(arr[0],offset));
        this.ctx.moveTo(arr[0].x,arr[0].y);
        for(let i = 1; i < arr.length; i++)
        {
            //translated = this.translateAndScale(vector.staticAdd(arr[i],offset));
            this.ctx.lineTo(arr[i].x,arr[i].y);
        }
        if(complete)
        {
            this.ctx.lineTo(arr[0].x,arr[0].y);
        }
        this.ctx.fill();
        this.ctx.stroke();
    }

    translateAndScale(vec)
    {
        return {x:vec.x,y:vec.y}
    }
    
    calculatePolygons(arr = [{x:0,y:0}],offset = {x:0,y:0})
    {
        let calcArr = [];
        for(let i = 0; i < arr.length; i++)
        {
            calcArr[i] = this.translateAndScale(vector.staticAdd(arr[i],offset));
        }
        return calcArr;
    }

    resetSize(size = {x:500,y:400})
    {
        this.size = size
        //let parent = this.myCanvas.parentElement;
        //this.myCanvas.remove();
        //this.myCanvas = null;
        //this.myCanvas = document.createElement("canvas");
        //this.myCanvas.style.position = 'absolute';
        //this.ctx = this.myCanvas.getContext('2d');
        //this.myCanvas.style.left = this.position.x;
        //this.myCanvas.style.top = this.position.y;
        this.myCanvas.width = this.size.x;
        this.myCanvas.height = this.size.y;
        //this.myCanvas.style.backgroundColor = this.color;
        //this.ctx.font = this.fontSize+' '+this.fontStyle;
        //parent.appendChild(this.myCanvas);
    }

    setTranslateAndScale(camera)
    {
        this.translateAndScale = (vec)=>{return camera.recalculatePosition(vec)};
        this.setbasicShapeRedraw(camera);
    }
    setbasicShapeRedraw(camera)
    {
        this.basicRedraw = (vec)=>{return camera.recalculatePosition(vec)};
        this.basicRescale = (size)=>{return camera.scale*size};
    }
    basicRedraw(vec)
    {
        return vec;
    }

    basicRescale(size)
    {
        return size;
    }
}

export default canvas