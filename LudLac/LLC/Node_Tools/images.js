class image
{
    ratio = 1;
    element;
    onZero;
    constructor(src="",onZero = 0)
    {

        this.element = document.createElement("img");
        this.element.src = src;
        this.onZero = onZero;
        let t = new Image;
        t.src = src;
        t.onload = ()=>
        {
            this.ratio = t.naturalHeight/t.naturalWidth;
            t.onload = null;
            t = null;
        }
    }
}


export default image;