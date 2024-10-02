import tools from "http://127.0.0.1/tools"

class vector{
    x;
    y;
    color;
    constructor(x=0,y=0)
    {
        this.x = x;
        this.y = y;
    }
    setColor(color)
    {
        this.color = color;
    }

    add(vec)
    {
        this.y+=vec.y;
        this.x+=vec.x;
    }
    sub(vec)
    {
        this.y-=vec.y;
        this.x-=vec.x;
    }
    set(vec)
    {
        this.x = vec.x;
        this.y = vec.y;
    }
    mult(num)
    {
        this.x*=num;
        this.y*=num;
    }
    div(num)
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
            this.set(new vector(0,0));
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
        return tools.modulo(this.radian(),Math.PI*2)
    }

    angle()
    {
        return (Math.atan2(this.y,this.x)*180/Math.PI);
    }

    angle360()
    {
        return tools.modulo(this.angle(),360);
    }

    limit(num)
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

    static staticAdd(vec1,vec2)
    {
        return new vector(vec1.x+vec2.x,vec1.y+vec2.y);
    }
    static staticSub(vec1,vec2)
    {
        return new vector(vec1.x-vec2.x,vec1.y-vec2.y);
    }
    static createVector(mag,angle)
    {
        let rad_angle = angle/180*Math.PI;
        return new vector(mag*Math.cos(rad_angle),mag*Math.sin(rad_angle));
    }
    static distance(vec1,vec2)
    {
        return vector.staticSub(vec1,vec2).mag();
    }

    static staticRadian(vec1,vec2)
    {
        return vector.staticSub(vec1,vec2).radian();
    }

    static staticRadian2PI(vec1,vec2)
    {
        return vector.staticSub(vec1,vec2).radian2PI();
    }

    static staticAngle(vec1,vec2)
    {
        return vector.staticSub(vec1,vec2).angle();
    }

    static staticAngle360(vec1,vec2)
    {
        return vector.staticSub(vec1,vec2).angle360();
    }
    visualize(board)
    {
        let reColor = board.ctx.strokeStyle;
        let reSize = board.ctx.lineWidth;
        board.lineWidth(2);
        board.strokeStyle(this.color);
        board.line(0,0,this.x,this.y);
        board.strokeStyle(reColor);
        board.lineWidth(reSize);
    }
    
    visualizeAround(board,point)
    {
        let reColor = board.ctx.strokeStyle;
        let reSize = board.ctx.lineWidth;
        board.strokeStyle(this.color);
        board.lineWidth(2);
        board.line(this.x,this.y,point.x,point.y);
        board.strokeStyle(reColor);
        board.lineWidth(reSize);
    }

    static betweenRange(range1,range2)
    {
        
    }

    equal(vec)
    {
        return ((this.x == vec.x)*(this.y == vec.y) == 1);
    }

    static staticEqual(vec1 = {x,y},vec2 = {x,y})
    {
        return (vec1.x == vec2.x && vec2.y == vec1.y);
    }

    static staticMult(vec,num)
    {
        return new vector(vec.x*num,vec.y*num);
    }

    static staticDiv(vec,num)
    {
        let t = new vector()
        t.set(vec);
        t.div(num);
        return t;
    }
    toString()
    {
        return `(${this.x},${this.y})`;
    }

    addAngle(angle)
    {
        this.set(vector.createVector(this.mag(),this.angle()+angle));
    }

    rotateAround(point,angle)
    {
        let vectorChange = vector.staticSub(this,point);
        vectorChange.set(vector.createVector(vectorChange.mag(),vectorChange.angle()+angle));
        this.set(vector.staticAdd(vectorChange,point));
    }

    static staticRotateAround(vec,reference,angle)
    {
        let vectorChange = vector.staticSub(vec,reference);
        vectorChange.set(vector.createVector(vectorChange.mag(),vectorChange.angle()+angle));
        return vector.staticAdd(vectorChange,reference);
    }
    getData()
    {
        return {x:this.x,y:this.y};
    }

    static angleDifference(a1,a2)
    {
        return tools.modulo(a1-a2,Math.PI*2)
    }

    static angleDifference360(a1,a2)
    {
        return tools.modulo(a1-a2,360)
    }
}


export default vector