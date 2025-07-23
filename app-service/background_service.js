import {connectStatus} from '@zos/ble'
import * as notificationMgr from "@zos/notification";
import { Time } from '@zos/sensor'
import { BasePage } from "@zeppos/zml/base-page";
import { writeFileSync,rmSync} from "@zos/fs";

const timeSensor = new Time();
let inicioServicioPendiente=false;
let lastReceivedTime=0;
let lastBGTime=0;

AppService( //600 ms for execution
  BasePage({

    build() {
      //console.log('page build invoked')
    },
        
    onInit() {
        notificationMgr.notify({
          title: "Watchdrip+ Service",
          content: "Watchdrip+ Service Started",
          actions: []
        });
        try{
          const file_name_running = "serviceStarted.status";
          writeFileSync({
            path: file_name_running,
            data: "started",
            options: {
              encoding: 'utf8',
            },
          });
        }catch(exception)
        {
          console.log("Exception error: " + exception);
        }
        lastReceivedTime=timeSensor.getTime();

        if (connectStatus()) 
        {
          try
          {
            this.call({
                method: 'Service Control',
                params: {
                  param1: 'START',
                },
            });
            lastReceivedTime=timeSensor.getTime();
            inicioServicioPendiente=false;
          }catch(exception)
          {
            inicioServicioPendiente=true;
            console.log("Exception error: " + exception);
          }
        }
        else
        {
          inicioServicioPendiente=true;
        }

        timeSensor.onPerMinute(() => {
          if (connectStatus()) 
          {
            if(inicioServicioPendiente)
            {
              try
              {
                this.call({
                    method: 'Service Control',
                    params: {
                      param1: 'START',
                    },
                });
                lastReceivedTime=timeSensor.getTime();
                inicioServicioPendiente=false;
              }catch(exception)
              {
                console.log("Exception error: " + exception);
              }
            }
            else
            {
              try
              {
                if(lastReceivedTime<=(timeSensor.getTime()-120000))
                {
                  this.call({
                      method: 'Service Control',
                      params: {
                        param1: 'START',
                      },
                  });
                  lastReceivedTime=timeSensor.getTime();
                }
              }catch(exception)
              {
                console.log("Exception error: " + exception);
              }
            }
          }
          else
          {
            inicioServicioPendiente=true;
          }
        });
    },

    onCall(req) {
      try
      {
        if (req.method === 'BG JSON') {
          try
          {
            if(lastBGTime===req.params.lastTime)
            {
              this.call({
                method: 'BG ACK',
                params: {
                  param1: 'OK',
                  param2: req.params.lastTime,
                },
              });
              lastReceivedTime=timeSensor.getTime();
            }
            else
            {
              const file_name = "info.json";
              writeFileSync({
                path: file_name,
                data: req.params.json,
                options: {
                  encoding: 'utf8',
                },
              });        
              this.call({
                method: 'BG ACK',
                params: {
                  param1: 'OK',
                  param2: req.params.lastTime,
                },
              });
              lastBGTime=req.params.lastTime;
              lastReceivedTime=timeSensor.getTime();
            }
          }catch(exception)
          {
            console.log("Exception error: " + exception);
            try
            {
              this.call({
                method: 'BG ACK',
                params: {
                  param1: 'KO',
                },
              });
            }catch(exception2)
            {
              console.log("Exception error: " + exception2);
            }
          }
        }
        else
          lastReceivedTime=timeSensor.getTime();

      }catch(externalException)
      {
        console.log("Exception error: " + externalException);
      }
    },

    onDestroy() {
      try{
        const file_name_running = "serviceStarted.status";
        rmSync({
          path: file_name_running,
        });
      }catch(exception)
      {
        console.log("Exception error: " + exception);
      }
      notificationMgr.notify({
        title: "Watchdrip+ Service",
        content: "Watchdrip+ Service Stopped",
        actions: []
      });

      try
      {
        this.call({
          method: 'Service Control',
          params: {
            param1: 'STOP',
          },
        });
      }catch(exception)
      {
        console.log("Exception error: " + exception);
      }
    },
}));
