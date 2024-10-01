import Tools from "./Tools";

class Vector
{
    x:number;
    y:number;
    color:string|undefined;
    constructor(x:number = 0,y:number = 0)
    {
        this.x = x;
        this.y = y;
    }
    setColor(color:string)
    {
        this.color = color;
    }

    add(vec:Vector|{x:number,y:number})
    {
        this.y+=vec.y;
        this.x+=vec.x;
    }
    sub(vec:Vector|{x:number,y:number})
    {  
        this.y-=vec.y;
        this.x-=vec.x;
    }
    set(vec:Vector|{x:number,y:number})
    {
        this.x = vec.x;
        this.y = vec.y;
    }

    mult(num:number)
    {
        this.x*=num;
        this.y*=num;
    }
    div(num:number)
    {
        this.x/=num;
        this.y/=num;
    }
    normalize()
    {
        if(this.mag() > 0)
        {
            this.div(this.mag());
        }else
        {
            this.set(new Vector(0,0));
        }
    }

    mag()
    {
       return Math.pow((this.x*this.x)+(this.y*this.y),0.5) 
    }

    radian()
    {
        return Math.atan2(this.y,this.x);
    }

    radian2PI()
    {
        return Tools.modulo(this.radian(),Math.PI*2)
    }

    angle()
    {
        return (Math.atan2(this.y,this.x)*180/Math.PI);
    }

    angle360()
    {
        return Tools.modulo(this.angle(),360);
    }

    limit(num:number)
    {
        if(this.mag() >= num)
        {
            this.normalize();
            this.mult(num);
        }
    }

    flipAxis(flip = {x:1,y:1})
    {
        this.x*=flip.x;
        this.y*=flip.y;
    }

    static staticAdd(vec1:Vector|{x:number,y:number},vec:Vector|{x:number,y:number})
    {
        return new Vector(vec1.x+vec.x,vec1.y+vec.y);
    }
    static staticSub(vec1:Vector|{x:number,y:number},vec:Vector|{x:number,y:number})
    {
        return new Vector(vec1.x-vec.x,vec1.y-vec.y);
    }
    static createVector(mag:number,angle:number)
    {
        let rad_angle = angle/180*Math.PI;
        return new Vector(mag*Math.cos(rad_angle),mag*Math.sin(rad_angle));
    }
    static distance(vec1:Vector|{x:number,y:number},vec:Vector|{x:number,y:number})
    {
        return Vector.staticSub(vec1,vec).mag();
    }

    static staticRadian(vec1:Vector|{x:number,y:number},vec:Vector|{x:number,y:number})
    {
        return Vector.staticSub(vec1,vec).radian();
    }

    static staticRadian2PI(vec1:Vector|{x:number,y:number},vec:Vector|{x:number,y:number})
    {
        return Vector.staticSub(vec1,vec).radian2PI();
    }

    static staticAngle(vec1:Vector|{x:number,y:number},vec:Vector|{x:number,y:number})
    {
        return Vector.staticSub(vec1,vec).angle();
    }

    static staticAngle360(vec1:Vector|{x:number,y:number},vec:Vector|{x:number,y:number})
    {
        return Vector.staticSub(vec1,vec).angle360();
    }
    visualize(board:any)
    {
        let reColor = board.ctx.strokeStyle;
        let reSize = board.ctx.lineWidth;
        board.lineWidth(2);
        board.strokeStyle(this.color);
        board.line(0,0,this.x,this.y);
        board.strokeStyle(reColor);
        board.lineWidth(reSize);
    }
    
    visualizeAround(board:any,point:{x:number,y:number})
    {
        let reColor = board.ctx.strokeStyle;
        let reSize = board.ctx.lineWidth;
        board.strokeStyle(this.color);
        board.lineWidth(2);
        board.line(this.x,this.y,point.x,point.y);
        board.strokeStyle(reColor);
        board.lineWidth(reSize);
    }

    static betweenRange(range1:number,range2:number)
    {
        
    }

    equal(vec:Vector)
    {
        return ((this.x == vec.x) && (this.y == vec.y) == true);
    }

    static staticEqual(vec1:Vector|{x:number,y:number},vec:Vector|{x:number,y:number})
    {
        return (vec1.x == vec.x && vec.y == vec1.y);
    }

    static staticMult(vec:Vector|{x:number,y:number},num:number)
    {
        return new Vector(vec.x*num,vec.y*num);
    }

    static staticDiv(vec:Vector|{x:number,y:number},num:number)
    {
        let t = new Vector();
        t.set(vec);
        t.div(num);
        return t;
    }
    
    toString()
    {
        return `(${this.x},${this.y})`;
    }

    addAngle(angle:number)
    {
        this.set(Vector.createVector(this.mag(),this.angle()+angle));
    }

    rotateAround(point:Vector|{x:number,y:number},angle:number)
    {
        let point2 = ((point as unknown) as {x:number,y:number});
        let vectorChange = Vector.staticSub(this,point2);
        vectorChange.set(Vector.createVector(vectorChange.mag(),vectorChange.angle()+angle));
        this.set(Vector.staticAdd(vectorChange,point2));
    }

    static staticRotateAround(vec:Vector|{x:number,y:number},reference:Vector,angle:number)
    {
        let vectorChange = Vector.staticSub(vec,reference);
        vectorChange.set(Vector.createVector(vectorChange.mag(),vectorChange.angle()+angle));
        return Vector.staticAdd(vectorChange,reference);
    }
    
    getData()
    {
        return {x:this.x,y:this.y};
    }

    static angleDifference(a1:number,a2:number)
    {
        return Tools.modulo(a1-a2,Math.PI*2)
    }

    static angleDifference360(a1:number,a2:number)
    {
        return Tools.modulo(a1-a2,360)
    }
}

export default Vector