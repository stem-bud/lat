import vector from "http://example.com/vector";

class camera
{
    center = new vector()
    scale = 1
    positionOnScreen = new vector()
    expZBase = 0.5;
    expZPower = 0;
    appendedPoint = new vector();
    flip = {x:1,y:1};
    axisScale = {x:1,y:1};
    reverseAxisScale = {x:1/this.axisScale.x,y:1/this.axisScale.y};
    setAxisScale(scaleVector = {x:1,y:1})
    {
        this.axisScale = scaleVector;
        this.reverseAxisScale = {x:1/this.axisScale.x,y:1/this.axisScale.y};
    }
    
    setScale(num)
    {
        this.scale = num
    }

    flipY()
    {
        this.flip.y*=-1;
    }

    flipX()
    {
        this.flip.x*=-1;
    }

    //reverse of recalculatedPosition()
    trueDistance(vec)
    {
        let distance = vector.staticSub(vec,this.recalculatePosition(this.center));
        distance.flipAxis(this.flip);
        distance.div(this.scale);
        distance.add(this.center);
        distance.flipAxis(this.reverseAxisScale);
        return distance;
    }

    setPositionOnScreen(vec)
    {
        this.positionOnScreen.set(vec)
    }

    setCenter(vec)
    {
        this.center.set(vec)
    }
    //give a position on a canvas will adjust to where it would show on the screen
    recalculatePosition(position)
    {

        let copyPos = new vector();
        copyPos.set(position);
        copyPos.flipAxis(this.axisScale);
        let distance = vector.staticSub(copyPos,this.center);
        distance.flipAxis(this.flip);
        distance.mult(this.scale)
        distance.add(this.positionOnScreen);
        return distance;
    }

    recalculateScale(scale)
    {
        return scale*this.scale;
    }

    screenShow()
    {
        return vector.staticSub(this.center,this.positionOnScreen);
    }
    showPointAt(pivotPoint = this.center,place)
    {
        let placeOnCanvas = this.trueDistance(place);
        //placeOnCanvas.flipAxis({x:this.flip.x,y:this.flip.y});
        let placeToBe = vector.staticAdd(this.center,vector.staticSub(pivotPoint,placeOnCanvas));
        return placeToBe;
    }
    exponentialZoomFactor(num)
    {
        this.expZBase = num;
    }

    getExponentialZoomFactor()
    {
        return this.expZBase;
    }

    getZoom()
    {
        return this.expZPower;
    }

    zoomChange(num)
    {
        if(Number.isFinite(num))
        {
            this.expZPower+=num;
        }
        this.setScale(Math.pow(this.expZBase,this.expZPower));
    }
    
    appendPoint(pointOnCanvas)
    {
        let recalc = this.trueDistance(pointOnCanvas)
        //recalc.flipAxis({x:Math.abs(this.flip.x),y:Math.abs(this.flip.y)});
        this.appendedPoint.set(recalc);
    }
}


export default camera