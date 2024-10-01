class Tools
{

    static numArray:string[] = ['-','+','0','1','2','3','4','5','6','7','8','9','.','e'];

    static modulo(div:number,divby:number)
    {
        return div-Math.floor(div/divby)*divby
    }

    static moduloZigZag(div:number,divby:number)
    {
        return (this.modulo(div,divby)*Math.pow(-1,Math.floor(div/divby))+(-Math.pow(-1,Math.floor(div/divby))+1)/(2/divby));
    }

    static findNumber(lowRange:number,highRange:number,seekedNumberIsbigger:(numberFound:number)=>boolean,toStop:{toStop:boolean,number:number},print = false):number
    {

        if(toStop.toStop)
        {
            toStop.toStop = false;
            return toStop.number
        }

        let numFound = (lowRange+highRange)*0.5
        if(print)
        {
            console.log(numFound);
        }        
        if(seekedNumberIsbigger(numFound))
        {
            return Tools.findNumber(numFound,highRange,seekedNumberIsbigger,toStop,print);
        }else
        {
            return Tools.findNumber(lowRange,numFound,seekedNumberIsbigger,toStop,print);
        }
    }

    static getOffset(el:HTMLElement|null)
    {
        const rect = el!.getBoundingClientRect();
        let b = 
        {
          x: rect.left + window.scrollX,
          y: rect.top + window.scrollY
        }
        return b;
    }

    static random(r1:number = 0,r2:number = 1)
    {
        return Tools.map(Math.random(),0,1,r1,r2);
    }
    static map(num:number,ra1:number,ra2:number,rb1:number,rb2:number)
    {
        return (((num-ra1)/(ra2-ra1))*(rb2-rb1))+rb1;
    }

    static quadraticFormula(a:number,b:number,c:number)
    {
        let root = Math.sqrt(b*b-4*a*c);
        return {x1:(-b-root)/(2*a),x2:(-b+root)/(2*a)};
    }

    static isDigitChar(character = '')
    {
        for(let i = 0; i < Tools.numArray.length; i++)
        {
            if(character == Tools.numArray[i]) return true;
        }
        return false;
    }

    static createRecursiveStack<ReturnType>()
    {
        let arr:()=>ReturnType[];
    }

    static mergeSort(arr:number[]):number[]
    {
        // Base case
        if (arr.length <= 1) return arr
        let mid = Math.floor(arr.length / 2)
        // Recursive calls
        let left = Tools.mergeSort(arr.slice(0, mid))
        let right = Tools.mergeSort(arr.slice(mid))
        return Tools.merge(left, right)
    }

    static merge(arr1:number[], arr2:number[]) 
    {
        let i = 0;
        let j = 0;
        let results:number[] = [];
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

    static log(base:number,num:number)
    {
        return Math.log(num)/Math.log(base);
    }

    static GCF(num1:number,num2:number)
    {
        for(let  i = num1%num2; i!=0; i = num1%num2)
        {
            num1 = num2;
            num2 = i;
        }
        return num2;
    }

    static LCM(num1:number,num2:number)
    {
        return Math.abs(num1*num2)/Tools.GCF(num1,num2);
    }

    static factors(num:number)
    {
        if(Math.round(num) != num)
        {
            return [[1,num]]
        }
        let factorPairs:number[][] = [];
        let track:number = num;
        for(let i = 1; i < num; i++)
        {
            if(num%i != 0)
            {
                continue;
            }
            if(i == track)
            {
                break;
            }
            track = num/i;
            factorPairs[factorPairs.length] = [track,i];
        }
        return factorPairs;
    }
    static commonMultiples(num1:number,num2:number)
    {
        let end = num1*num2;
        let common:number[] = [];
        for(let i = 1; i < end; i++)
        {
            if((num1*i)%num2 == 0)
            {
                common[common.length] = num1*i;
            }
            
            if(num1*i == end)
            {
                break;
            }
        }
        return common;
    }
}

export default Tools