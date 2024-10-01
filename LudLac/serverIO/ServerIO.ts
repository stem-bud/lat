interface ServerIO
{
    write(client:any,message:{message:string,param:object}):void;
}

export default ServerIO;