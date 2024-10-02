import tools from "http://127.0.0.1/tools";

import vector from "http://127.0.0.1/vector";

class position
{
    
    place = new vector();
    destination = new vector();
    distance = new vector();
    span = 1;
    resolve;
    moving = false;
    timeOffset = 0;
    promise = new Promise((resolve,reject)=>
    {
        this.resolve = resolve;
    })

    constructor(place = {x,y})
    {
        this.place.set(place);
        this.destination.set(place);
        this.resolve();
    }

    setDestination(destination = {x,y})
    {
        this.timeOffset = Date.now();
        this.destination.set(destination);
        this.moving = true;
        this.distance.set(vector.staticSub(this.destination,this.place))
        this.promise = new Promise((resolve,reject)=>
        {
            this.resolve = resolve;
        });
        return this.promise;
    }

    setSpan(ms)
    {
        this.span = ms;
        this.timeOffset = Date.now();
    }

    input(time)
    {
        if(!this.moving)
        {
            return this.place;
        }
        this.percent = tools.clamp((time-this.timeOffset)/this.span,0,1);
        if(this.percent == 1)
        {
            this.resolve();
            this.moving = false;
        }
        //console.log(this.distance);
        return vector.staticAdd(vector.staticMult(this.distance,this.percent),this.place);
    }
}

export default position;