class tools
{
    static numArray = ['-','0','1','2','3','4','5','6','7','8','9','.'];

    static mag(arr)
    {
        let lengthsqrd = 0;
        for(let i = 0; i < arr.length; i++)
        {
            lengthsqrd+=(arr[i]*arr[i]);
        }
        return Math.pow(lengthsqrd,0.5);
    }

    static isAllNumber(supposedNumber = "")
    {
        for(let i = 0; i < supposedNumber.length; i++)
        {
            if(!tools.isDigitChar(supposedNumber[i])) return false;
        }
        return true;
    }

    static isDigitChar(character = '')
    {
        for(let i = 0; i < tools.numArray.length; i++)
        {
            if(character == tools.numArray[i]) return true;
        }
        return false;
    }


    static distance(obj1,obj2)
    {
        let copyObj1 = obj1
        let copyObj2 = obj2

        console.log(copyObj1,copyObj2)

        let standard = copyObj1
        if(Object.keys(copyObj2).length > Object.keys(copyObj1).length)
        {
            standard = copyObj2
        }

        let keys = Object.keys(standard)
        let numArr = [];
        for(let i = 0; i < keys.length; i++)
        {
            if(isNaN(copyObj1[keys[i]]))
            {
                copyObj1[keys[i]] = 0
            }else if(isNaN(copyObj2[keys[i]]))
            {
                copyObj2[keys[i]] = 0
            }

            numArr[i] = copyObj1[keys[i]]-copyObj2[keys[i]]
        }
        console.log(numArr)
        return tools.mag(numArr)
    }

    static random(r1 = 0 ,r2 = 1)
    {
        return tools.map(Math.random(),0,1,r1,r2);
    }

    static map(num,ra1,ra2,rb1,rb2)
    {
        return (((num-ra1)/(ra2-ra1))*(rb2-rb1))+rb1
    }
    
    static simpQuadForm(a,c)
    {
        return Math.pow(-4*a*c,0.5)/(2*a)
    }

    static quadFormula(a,b,c)
    {
        let roots =
        {
            firstRoot: (-b-Math.sqrt(b*b - 4*a*c))/(2*a),
            secondRoot: (-b+Math.sqrt(b*b - 4*a*c))/(2*a)
        }
        return roots;
    }
    static boxMethod(arr1,arr2)
    {
        let t = [];
        for(let i = 0; i < arr2.length; i++)
        {
            t[i] = [];
            for(let fi = 0; fi < arr1.length; fi++)
            {
                t[i][fi] = arr2[i]*arr1[fi];
            }
        }
        return t
    }
    static addDiagonals(arr)
    {
        let t = [arr[0][0]];
        for(let i = 1; i < arr.length; i++)
        {
            t[i] = arr[i-1][1]+arr[i][0];
        }
        t[arr.length] = arr[arr.length-1][1];
        return t
    }

    static merge(arr1, arr2) 
    {
        let i = 0;
        let j = 0;
        let results = [];
        while(i < arr1.length && j < arr2.length) {
            if (arr2[j] > arr1[i])
            {
                results.push(arr1[i]);
                i++;  
            }else
            {
                results.push(arr2[j])
                j++
            }
        }
        while(i < arr1.length)
        {
            results.push(arr1[i]);
            i++;
        }
        while(j < arr2.length)
        {
            results.push(arr2[j]);
            j++;
        }
        return results;
    }

    //just amazing
    static mergeSort(arr) 
    {
        // Base case
        if (arr.length <= 1) return arr
        let mid = Math.floor(arr.length / 2)
        // Recursive calls
        let left = tools.mergeSort(arr.slice(0, mid))
        let right = tools.mergeSort(arr.slice(mid))
        return tools.merge(left, right)
    }
    
    //not too shabby
    static leastBy(arr)
    {
        let retArr = arr;
        let smallArray = [];
        let everythingElse = [];

        let sorted = true;
        let standard = retArr[0]
        for(let i = 0; i < retArr.length; i++)
        {
            if(retArr[i] < standard)
            {
                sorted = false;
                break;
            }
            standard = retArr[i]
        }
        if(!sorted)
        {   
            let least = retArr[0];
            for(let i = 0; i < retArr.length; i++)
            {
                if(retArr[i] < least)
                {
                    least = retArr[i];
                }
            }

            for(let i = 0; i < retArr.length; i++)
            {
                if (retArr[i] == least)
                {
                    smallArray.push(retArr[i])
                }else
                {
                    everythingElse.push(retArr[i])
                }
            }
            return smallArray.concat(this.leastBy(everythingElse));
        }
        return retArr;
    }

    static sortByKey(arr,key)
    {
        let retArr = arr;
        let smallArray = [];
        let everythingElse = [];

        let sorted = true;
        let standard = retArr[0][key]
        for(let i = 0; i < retArr.length; i++)
        {
            if(retArr[i][key] < standard)
            {
                sorted = false;
                break;
            }
            standard = retArr[i][key]
        }
        if(!sorted)
        {   
            let least = retArr[0][key];
            for(let i = 0; i < retArr.length; i++)
            {
                if(retArr[i][key] < least)
                {
                    least = retArr[i][key];
                }
            }

            for(let i = 0; i < retArr.length; i++)
            {
                if (retArr[i][key] == least)
                {
                    smallArray.push(retArr[i])
                }else
                {
                    everythingElse.push(retArr[i])
                }
            }
            return smallArray.concat(this.sortByKey(everythingElse,key));
        }
        return retArr;
    }

    static modulo(div,divby)
    {
        return div-Math.floor(div/divby)*divby
    }


    static zigZag(num,max)
    {
        return this.modulo(num*Math.pow(-1,Math.floor(num/max)),max)
    }

    static angleDirection(angle)
    {
        return tools.modulo(angle,360)+((Math.pow(-1,Math.floor(angle/180))-1)*180);
    }

    static angleRadianDiraction(angle)
    {
        return tools.angleDirection(angle*180/Math.PI)/180*Math.PI;
    }

    static round(num,pos)
    {
        //num*Math.pow(10,pos);
        return Math.round(num*Math.pow(10,pos))/Math.pow(10,pos);
    }

    static pickRandom(arr)
    {
        return arr[Math.round(Math.random()*(arr.length-1))]
    }

    static invRGBA(string)
    {
        let f = string.split('(');
        let d = f[1].split(')');
        let d2 = d[0].split(',');
        let rgbString = 'rgba(';
        for(let i = 0; i < d2.length; i++)
        {
            rgbString+= (Math.abs(255-parseFloat(d2[i]))+',');
        }
        rgbString+='0.4)';
        return rgbString;
    }


    static setAlpha(string,alpha)
    {
        f = string.split('(');
        let d = f[1].split(')');
        let d2 = d[0].split(',');
        let rgbString = 'rgba(';
        for(let i = 0; i < 3; i++)
        {
            rgbString+= (Math.abs(0-parseFloat(d2[i]))+',');
        }
        rgbString+=alpha+')';
        return rgbString;
    }

    //horrible sorting algorithm
    /*static sortBy(arr)
    {
        let beBroken = false;
        let retArr = arr;
        let arrOfArr = [];
        let indexNum = 0;
        let sorted = true;
        for(let fi = 0;!beBroken; fi++)
        {
            let standard = retArr[indexNum];
            let newArr = [];
            for(let i = indexNum; i < retArr.length;i++)
            {
                if(retArr[i] < standard)
                {
                    //console.log(retArr[i],standard)
                    standard = retArr[i]
                    indexNum = i;
                    sorted = false;
                    break;
                }
                if(i == retArr.length-1)
                {
                    beBroken = true
                    //console.log("hello");
                }
                newArr.push(retArr[i]);
                standard = retArr[i];
            }
            arrOfArr.push(newArr)
        }
        retArr = [];

        //console.log(arrOfArr[0]);
        //console.log(arrOfArr)
        if(!sorted)
        {
            for(let fi = 1; fi < arrOfArr.length; fi++)
            {
                for(let i = 0; i < arrOfArr[0].length; i++)
                {
                    if(arrOfArr[fi][0] < arrOfArr[0][i])
                    {
                        arrOfArr[0] = tools.insertArr(arrOfArr[fi],i, arrOfArr[0]);
                        break;
                    }
                }
                    //console.log(arrOfArr[0])
            }
            //console.log(arrOfArr[0])
            return tools.sortBy(arrOfArr[0])
        }
        return arrOfArr[0]
    }
    */

    static insertArr(put,inside,arr)
    {
        let arr1 = [];
        let arr2 = [];
        for(let i = 0; i < inside; i++)
        {
            arr1[i] = arr[i];
        }
        for(let i = inside; i < arr.length; i++)
        {
            arr2[i] = arr[i];
        }
        
        arr1 = arr1.concat(put);
        arr1 = arr1.concat(arr2);
        for(let i = 0; i < arr1.length; i++)
        {
            if(arr1[i] == undefined)
            {
                arr1 = tools.removeEl(arr1,i)
                i = 0;
            }
        }
        return arr1
    }

    static clamp(num,low,high)
    {
        if(num < low)
        {
            return low;
        }
        
        if(num > high)
        {
            return high;
        }

        return num;
    }

    static changeElementPlace(elem = document.body,parent = document,index)
    {
        //let parent = elem.parentElement;
        let childElem = [];
        let children = parent.children;
        for(let i = 0; i < children.length; i++)
        {
            childElem[i] = children[i];
        }

        //console.log(childElem);

        for(let i = 0; i < childElem.length; i++)
        {
            document.head.appendChild(childElem[i]);
        }

        for(let i = 0; i < index; i++)
        {
            if(childElem[i] != elem)
            {
                parent.appendChild(childElem[i]);
            }
        }

        parent.appendChild(elem);

        for(let i = index; i < childElem.length; i++)
        {
            if(childElem[i] != elem)
            {
                parent.appendChild(childElem[i]);
            }
        }

    }

    static findelemIndex(elem = document)
    {
        let parent = elem.parentElement;
        //let num = 0;
        for(let i = 0; i < parent.children.length; i++)
        {
            if(parent.children[i] == elem)
            {
                return i;
            }
        }
    }

    switchElement()
    {

    }

    static removeEl(arr,index)
    {
        let retArr = [];
        for(let i = 0; i < arr.length; i++)
        {
            if(i!=index)
            {
                retArr.push(arr[i])
            }
        }
        return retArr
    }


    static family(node)
    {
        let retArr = [];
        let childNum = [];
        for(let i = 0; i < node.children.length; i++)
        {
            try
            {
                if(node.children[i] != undefined)
                {
                    retArr.push(node.children[i]);
                    if(node.children[i].children.length > 0)
                    {
                        childNum.push(i);
                    }
                }
            }catch
            {

            }
        }
        for(let i = 0; i < childNum.length; i++)
        {
            retArr = retArr.concat(tools.family(retArr[childNum[i]]));
        }
        return retArr;
    }
    static rangeoverlap(smallRange1 = {end1: num, end2: num},smallRange2 = {end1: num, end2:num},inclusive = true)
    {
        return (this.between(smallRange1.end1,smallRange2.end1,smallRange2.end2,inclusive) || this.between(smallRange1.end2,smallRange2.end1,smallRange2.end2,inclusive))
    }
    static between(num,r1,r2,inclusive = true)
    {
        let midPoint = (r1+r2)/2;
        let range = Math.abs(r2-r1)/2;
        if(inclusive)return (Math.abs(num-midPoint) <= range);
        return (Math.abs(num-midPoint) < range);
    }

    static getOffset(el) 
    {
        const rect = el.getBoundingClientRect();
        let b = 
        {
          x: rect.left + window.scrollX,
          y: rect.top + window.scrollY
        }
        return b;
    }

}

//console.log(tools.map(2,0,4,0,8));
// default tools;
export default tools;
