import { getTextLayout, createWidget, widget, deleteWidget, setAppWidgetSize, getAppWidgetSize } from "@zos/ui";
import { log as Logger, px } from "@zos/utils";
import hmUI from "@zos/ui";
import { Time } from '@zos/sensor'
import { readFileSync,statSync } from "@zos/fs";

const logger = Logger.getLogger("watchdrip+ service");

import {
  IMG_LOADING_PROGRESS,
  BG_VALUE_TEXT,
  BG_TIME_TEXT,
  BG_TREND_IMAGE,
  BG_STALE_RECT,
  Colors,
  IMG_LOGO,
} from "zosLoader:./index.[pf].layout.js";

let vm;
const timeSensor = new Time();
const PROGRESS_UPDATE_INTERVAL_MS = 300;
const PROGRESS_ANGLE_INC = 15;

function setProperty(w, p, v) {
  w.setProperty(p, v);
}

AppWidget({
  state: {
    running: null,
    imgLoading: null,
    bgValueText: null,
    bgTimeText: null,
    bgTrendImage: null,
    bgStale: null,
  },

  onInit() {
    logger.log("===onInit===");
  },

    readFileInfo() {
      vm.state.running = this.isServiceStarted();
      if (!vm.state.running)
        return;
      try
      {
        const file_name = "info.json";
        const contentString = readFileSync({
          path: file_name,
          options: {
            encoding: 'utf8',
          },
        });
      
        if(contentString!==null)
        {
          const jsonValues=JSON.parse(contentString);
          vm.state.bgValueText.setProperty(hmUI.prop.MORE, {text: jsonValues.bg.val});
          if(jsonValues.bg.isHigh) 
            vm.state.bgValueText.setProperty(hmUI.prop.MORE, {color: Colors.bgHigh});
          else if(jsonValues.bg.isLow) 
            vm.state.bgValueText.setProperty(hmUI.prop.MORE, {color: Colors.bgLow});
          else 
            vm.state.bgValueText.setProperty(hmUI.prop.MORE, {color: Colors.white});

          let strDeltaTime=jsonValues.bg.delta+"   "+this.niceTime(timeSensor.getTime() - jsonValues.bg.time);
          vm.state.bgTimeText.setProperty(hmUI.prop.MORE, {text: strDeltaTime});

          vm.state.bgTrendImage.setProperty(hmUI.prop.SRC, this.getArrowResource(jsonValues.bg.trend));

          vm.state.bgStale.setProperty(hmUI.prop.VISIBLE, jsonValues.bg.isStale);
        }

      }catch(exception)
      {
        console.log("Exception error: " + exception);
      }
    },

    isServiceStarted()
    {
        const file_name_running = "serviceStarted.status";
        try {

            const result = statSync({ path: file_name_running,});
            return result;
        } catch (error) {
            return false;
        }
        return false;
    },

    startLoader() {
        //vm.state.imgLoading.setProperty(hmUI.prop.MORE, {angle: this.progressAngle});
        this.progressTimer = setInterval(() => {
            this.updateLoader();
        }, PROGRESS_UPDATE_INTERVAL_MS);

        this.progressTimerRead = setInterval(() => {
            this.readFileInfo();
        }, 30000);      
        this.readFileInfo();
    },

    updateLoader() {
        this.progressAngle = this.progressAngle + PROGRESS_ANGLE_INC;
        if (this.progressAngle >= 360) this.progressAngle = 0;
        vm.state.imgLoading.setProperty(hmUI.prop.MORE, {angle: this.progressAngle});
    },

    stopLoader() {
        if (this.progressTimer !== null) {
            clearInterval(this.progressTimer);
            this.progressTimer = null;
        }
        if (this.progressTimerRead !== null) {
            clearInterval(this.progressTimerRead);
            this.progressTimerRead = null;
        }
    },

    getArrowResource(trend) {
        let fileName = trend;
        if (fileName === undefined || fileName === "") {
            fileName = "None";
        }
        return `watchdrip/arrowsmin/${fileName}.png`;
    },

    niceTime(t) {
      let unit = 'sec';
      console.log("Antes: " + t);
      t = t / 1000;
      console.log("Despues: " + t);
      if (t !== 1) unit = 'sec';

      if (t > 59) {
        unit = 'min';
        t = t / 60;
        if (t != 1) unit = 'mins';
        if (t > 59) {
            unit = 'hour';
            t = t / 60;
            if (t != 1) unit = 'hours';
            if (t > 24) {
                unit = 'day';
                t = t / 24;
                if (t != 1) unit = 'days';
                if (t > 28) {
                    unit = 'week';
                    t = t / 7;
                    if (t != 1) unit = 'weeks';
                }
            }
        }
      }else{
        return "now";
      }
      return Math.trunc(t) + " " + unit;
    },    

  build() {
    //logger.log(build())

    setAppWidgetSize({
      h: px(140)
    })

      vm = this;

      hmUI.createWidget(hmUI.widget.IMG, IMG_LOGO);
      vm.state.imgLoading=hmUI.createWidget(hmUI.widget.IMG, IMG_LOADING_PROGRESS);
      this.progressAngle = 0;
      this.stopLoader();

      
      vm.state.bgValueText = hmUI.createWidget(hmUI.widget.TEXT, BG_VALUE_TEXT);
      vm.state.bgTimeText = hmUI.createWidget(hmUI.widget.TEXT, BG_TIME_TEXT);
      vm.state.bgTrendImage = hmUI.createWidget(hmUI.widget.IMG, BG_TREND_IMAGE);
      vm.state.bgStale = hmUI.createWidget(hmUI.widget.FILL_RECT, BG_STALE_RECT);
      vm.state.bgStale.setProperty(hmUI.prop.VISIBLE, false);
  },

  onResume() {
    try {
      vm.state.running = this.isServiceStarted();
      if (vm.state.running)
        this.startLoader();
      logger.log("===onResume===");
    } catch(e) {
      console.log('LifeCycle Error', e)
      e && e.stack && e.stack.split(/\n/).forEach((i) => console.log('error stack', i))
    }
  },

  onPause() {
    this.stopLoader();
  },
  
  onDestroy() {
    this.stopLoader();
  },

 
});
