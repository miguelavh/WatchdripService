const logger = Logger.getLogger('test-message-fetch')

let lastJSONData="";
let lastTime=0;
export let lastSentTime=0;
//export let tryNum=0;
const time = new Date();

export const fetchModule = {
  async onRunFetch() {
    logger.log('fetchTest run')
  },

  async setLastTime(value)
  {
    lastTime=value
  },

  async setLastSentTime(value)
  {
    lastSentTime=value
  },

  /*async setTryNum(value)
  {
    tryNum=value
  },*/

  async getWatchdripBGData() {
    /*if (tryNum>0)
    {
      tryNum--;     
      return;
    }*/
    try
    {
      const result = this.fetch({
        method: 'get',
        url: 'http://localhost:29863/info.json?graph=1',
      }).then(
        (result) => {
          const body = JSON.parse(result.body)
          if(body.bg.time!=lastTime)
          {
            lastJSONData=result.body;
            this.call({
              method: 'BG JSON',
              params: {
                json: lastJSONData,
                lastTime: body.bg.time,
              },
            });
            //tryNum=3;
            lastSentTime=time.getTime();
          }
        }).catch((e) => {
          console.log('test fetch=>', e)
      });
    }catch(exception)
    {
      console.log("Exception error: " + exception);
    }
  },
}
