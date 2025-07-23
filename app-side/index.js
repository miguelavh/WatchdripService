import { BaseSideService } from "@zeppos/zml/base-side";
//import { fetchModule,lastSentTime,tryNum } from './fetch-module'
import { fetchModule,lastSentTime } from './fetch-module'

let  ctx;
let MyTimerID=null;
const time = new Date();

function myCallback(ctx){
  try
  {
      ctx.getWatchdripBGData();

      if(lastSentTime<=(time.getTime()-90000))
      {
        this.call({
                method: 'HEARTBEAT',
                params: {
                  param1: 'OK',
                },
              });      
        this.setLastSentTime(time.getTime());
      }
  }catch(exception)
  {
    console.log("Exception error: " + exception);
  }
}

AppSideService(
  BaseSideService({...fetchModule,
    onInit() {
      console.log('app side service invoke onInit');
      ctx=this;
    },
    onRun() {
        console.log('app side service invoke onRun')
        MyTimerID=null;
        //this.setTryNum(0);
    },

    onDestroy() {
        console.log('app side service invoke onDestroy')
        if (MyTimerID!==null) 
        {
          clearInterval(MyTimerID);
          MyTimerID=null;
        }
    },
    onCall(req) {
        try
        {
          if (req.method === 'Service Control') 
          {
            if(req.params.param1==='START')
            {
              if (MyTimerID!==null) 
              {
                clearInterval(MyTimerID);
                MyTimerID=null;
              }
              MyTimerID=setInterval(myCallback, 1000*10, ctx);
              myCallback(ctx);
              //this.setTryNum(0);
            }
            else
            {
              if (MyTimerID!==null) 
              {
                clearInterval(MyTimerID);
                MyTimerID=null;
              }
            }
          }
          else if(req.method === 'BG ACK')
          {
            if(req.params.param1==='OK')
            {
              this.setLastTime(req.params.param2);
              //this.setTryNum(0);
            }
          }
        }catch(exception)
        {
          console.log("Exception error: " + exception);
        }
     },

    onRequest(req, res) {
      console.log('app side service invoke request '+req.method);
    },
  }),
)