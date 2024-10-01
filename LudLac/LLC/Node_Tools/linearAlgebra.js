const tools = require("./tools");
const vector = require("./vector");

class linear
{
    slope;
    int;
    myZero = 0;
    context;
    myEnd;
    color = "red";
    myEndAsPoint;
    constructor(slope,int,allowZero = false)
    {
        this.slope = slope;
        this.int = int;
        if(((slope == 0 && !allowZero) || !Number.isFinite(slope)))
        {
            throw "cannot be zero or infinity or NaN, unless skew = true or allowZero = true";
        }
    }

    static pointAndPoint(p1,p2,skew = false)
    {   
        try
        {
            let slope = (p1.y-p2.y)/(p1.x-p2.x);
            let intercept = -(slope*p1.x)+p1.y
            let t = new linear(slope,intercept,skew);
            let angPoint = {x: p2.x-p1.x, y: p2.y-p1.y};
            t.setContext(Math.atan2(angPoint.y,angPoint.x));
            t.setZero(p1.x);
            t.setMyEnd(vector.distance(p1,p2));
            return t;
        }catch(err)
        {
            if(!skew)
            {
                throw err;
            }
            let slope = (p1.y-(p2.y+0.000001))/(p1.x-(p2.x+0.000001));
            let intercept = -(slope*p1.x)+p1.y
            let t = new linear(slope,intercept);
            let angPoint = {x:(p2.x+0.000001)-p1.x, y: (p2.y+0.000001)-p1.y};
            t.setContext(Math.atan2(angPoint.y,angPoint.x));
            t.setZero(p1.x);
            t.setMyEnd(vector.distance(p1,vector.staticAdd(p2,{x:0.000001,y:0.000001})));
            return t;
        }
    }

    static slopeAndPoint(slope,p)
    {
        let t = new linear(slope,-(slope*p.x)+p.y);
        t.setContext(Math.atan2(p.y-t.int,p.x));
        t.setZero(p.x);
        return t;
    }

    static angleAndPoint(angle,p)
    {
        return linear.slopeAndPoint(Math.tan(angle/180*Math.PI),p)
    }

    setMyEnd(num)
    {
        this.myEnd = num;
        this.myEndAsPoint = this.getEnd();
    }

    set(line)
    {
        Object.assign(this,line);
    }

    getIntercept()
    {
        return this.int;
    }

    evaluate(num)
    {
        return (num*this.slope)+this.int;
    }

    static solution(line1,line2)
    {
        let myPoint = 
        {
            x: (line2.int-line1.int)/(line1.slope-line2.slope),
            y: null
        }
        myPoint.y = line1.evaluate(myPoint.x);
        return myPoint;
    }
    setZero(num)
    {
        this.myZero = num;
    }

    setContext(angle)
    {
        this.context = angle;
    }

    fallsOn(point)
    {
        if(Math.abs(this.evaluate(point.x) - point.y) > 0.001)
        {
            throw "not on line";
        }
        
        if(this.context == 0)
        {

            return (point.x-this.myZero);
        }

        return tools.mag([point.y-this.evaluate(this.myZero),point.x-this.myZero])*(Math.atan2(point.y-this.evaluate(this.myZero),point.x-this.myZero)/this.context);
    }

    placeOn(num)
    {
        if(this.context == null)
        {
            throw `requires this.context to be defined`;
        }
        
        let angle = this.context;
        let point = 
        {
            x: Math.cos(angle)*num+this.myZero,
            y: Math.sin(angle)*num+this.evaluate(this.myZero)
        }
        return point;
    }
    getContext()
    {
        return tools.modulo(this.context*180/Math.PI,360)
    }

    meetCircle(point,rad)
    {
        let perpendicular = linear.slopeAndPoint(-1/this.slope,point)
        let meetPoint1 = linear.solution(this,perpendicular)
        let meetPoint2 = {x:meetPoint1.x+1,y:this.evaluate(meetPoint1.x+1)}
        let c1 = vector.distance(meetPoint1,point)
        let c2 = vector.distance(meetPoint2,point)
        let a = c2*c2-c1*c1
        let roots = tools.quadFormula(a,0,c1*c1-rad*rad)

        if(isNaN(roots.firstRoot+meetPoint1.x) || isNaN(roots.secondRoot+meetPoint2.y))
        {
            throw "does not intersect with circle"
        }
        return {firstRoot: roots.firstRoot+meetPoint1.x, secondRoot: roots.secondRoot+meetPoint1.x};
    }

    segmentMeetCircle(point,rad)
    {
        let mid = vector.staticAdd(this.getEnd(),{x:this.myZero,y:this.evaluate(this.myZero)});
        mid.div(2);
        let roots = this.meetCircle(point,rad);
        let endPosition = this.getEnd();
        /*if((vector.distance({x:this.myZero,y:this.evaluate(this.myZero)},point) > rad) && (vector.distance(this.getEnd(),point) > rad))
        {
            throw "does not intersect with circle";
        }*/
        //b.line((endPosition.x+this.myZero)/2,0,(endPosition.x+this.myZero)/2,100000);
        //b.line((roots.firstRoot+roots.secondRoot)/2,0,(roots.firstRoot+roots.secondRoot)/2,100000)

        //if the distance between the root's midpoint and the endposition's x and zero's midpoint is greater than the distance between the roots over two plus the distance between endposition's x and zero then the segment does not meet the circle.
        if(Math.abs(((endPosition.x+this.myZero)/2)-((roots.firstRoot+roots.secondRoot)/2)) > (Math.abs((endPosition.x-this.myZero)/2) + Math.abs(((roots.firstRoot-roots.secondRoot)/2))))
        {
            throw "segmented section does not intersect with circle";
        }

        if(this.fallsOn({x:roots.firstRoot,y:this.evaluate(roots.firstRoot)}) > this.myEnd)
        {
            roots.firstRoot = endPosition.x
        }else if(this.fallsOn({x:roots.firstRoot,y:this.evaluate(roots.firstRoot)}) < 0)
        {
            //let ang = vector.staticAngle({x:this.myZero,y:this.evaluate(this.myZero)},point);
            roots.firstRoot = this.myZero;
        }

        if(this.fallsOn({x:roots.secondRoot,y:this.evaluate(roots.secondRoot)}) > this.myEnd)
        {
            //let ang = vector.staticAngle(this.getEnd(),point);
            roots.secondRoot = endPosition.x
        }else if (this.fallsOn({x:roots.secondRoot,y:this.evaluate(roots.secondRoot)}) < 0)
        {
            //let ang = vector.staticAngle({x:this.myZero,y:this.evaluate(this.myZero)},point);
            roots.secondRoot = this.myZero;
        }
        return roots;
    }

    getAnglesToCircle(roots,pos)
    {
        let angle1 = vector.staticAngle360({x:roots.firstRoot,y:this.evaluate(roots.firstRoot)},pos);
        let angle2 = vector.staticAngle360({x:roots.secondRoot,y:this.evaluate(roots.secondRoot)},pos);
        return {endpoint1: angle1,endpoint2: angle2};
    }
    getEnd()
    {
        return vector.staticAdd(vector.createVector(this.myEnd,this.context*180/Math.PI),{x:this.myZero,y:this.evaluate(this.myZero)});
    }
    visualize(board,end1,end2)
    {
        let getColor = board.ctx.strokeStyle;
        let getWidth = board.ctx.lineWidth;
        board.lineWidth(2);
        board.strokeStyle(this.color);
        board.line(end1,this.evaluate(end1),end2,this.evaluate(end2));
        board.lineWidth(getWidth);
        board.strokeStyle(getColor);
    }

    visualizeCtx(board)
    {
        if(!this.myEnd)
        {
            throw "no end";
        }
        let pos = this.getEnd();
        let getColor = board.ctx.strokeStyle;
        let getWidth = board.ctx.lineWidth;
        board.lineWidth(3);
        board.strokeStyle("orange");
        board.line(this.myZero,this.evaluate(this.myZero),pos.x,pos.y);
        board.lineWidth(getWidth);
        board.strokeStyle(getColor);
    }

    ymxFormat()
    {
        return `${this.slope}x + ${this.int}`
    }

    static segmentMeetSegment(line1 = new linear(10,10),line2 = new linear(80,3))
    {
        if(line1.slope == line2.slope && line1.int == line2.int)
        {
            let line1End = line1.getEnd();
            let line2End = line2.getEnd();
            let rangeX = tools.rangeoverlap({end1:line1.myZero,end2:line1End.x},{end1:line2.myZero,end2:line2End.x})
            let rangeY = tools.rangeoverlap({end1:line1.evaluate(line1.myZero),end2:line1End.y},{end1:line2.evaluate(line2.myZero),end2:line2End.y});
            return rangeX && rangeY;
        }
        let meeting = linear.solution(line1,line2);
        let meetSelf = line1.fallsOn(meeting);
        let meetOther = line2.fallsOn(meeting);
        return ((meetSelf >= 0 && meetSelf <= line1.myEnd) && (meetOther >= 0 && meetOther <= line2.myEnd))
    }
    translateByVector(vec = {x:0,y:0})
    {
        this.int = (this.int+vec.y)-vec.x*this.slope;
        this.myZero+=vec.x;
    }
}


module.exports = linear;