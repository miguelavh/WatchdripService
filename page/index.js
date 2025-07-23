import hmUI from "@zos/ui";
import * as appService from "@zos/app-service";
import { queryPermission, requestPermission } from "@zos/app";
import { Time } from '@zos/sensor'
import { readFileSync } from "@zos/fs";

import {
  FETCH_BUTTON,
  FETCH_RESULT_TEXT,
  IMG_LOADING_PROGRESS,
  BG_VALUE_TEXT,
  BG_TIME_TEXT,
  BG_TREND_IMAGE,
  BG_STALE_RECT,
  Colors,
  IMG_LOGO,
} from "zosLoader:./index.[pf].layout.js";

const PagesType = {
  MAIN: 'main',
  UPDATE_LOCAL: 'update_local'
};

let vm;
const timeSensor = new Time();
const permissions = ["device:os.bg_service"];
const serviceFile = "app-service/background_service";

const PROGRESS_UPDATE_INTERVAL_MS = 300;
const PROGRESS_ANGLE_INC = 15;

function permissionRequest() {
  const [result2] = queryPermission({
    permissions,
  });

  if (result2 === 0) {
    requestPermission({
      permissions,
      callback([result2]) {
        if (result2 === 2) {
          startTimeService();
        }
      },
    });
  } else if (result2 === 2) {
    startTimeService();
  }
}

function setProperty(w, p, v) {
  w.setProperty(p, v);
}

function startTimeService() {
  console.log(`=== starting service: ${serviceFile} ===`);
  const result = appService.start({
    url: serviceFile,
    param: `service=${serviceFile}&action=start`,
    complete_func: (info) => {
      if (info.result) 
      {
        vm.startLoader();
        vm.state.running = true;
        setProperty(vm.state.serviceText, hmUI.prop.TEXT, "Service started");
        if(vm.state.serviceBtn!=null)
          setProperty(vm.state.serviceBtn, hmUI.prop.TEXT, "Stop Service");
      }
    },
  });
}

function stopTimeService() {
  console.log(`=== stop service: ${serviceFile} ===`);
  const result = appService.stop({
    url: serviceFile,
    param: `service=${serviceFile}&action=stop`,
    complete_func: (info) => {
      if (info.result) 
      {
        vm.stopLoader();
        vm.state.running = false;
        setProperty(vm.state.serviceText, hmUI.prop.TEXT, "Service stopped");
        if(vm.state.serviceBtn!=null)
          setProperty(vm.state.serviceBtn, hmUI.prop.TEXT, "Start Service");
      }
    },
  });

}

Page({
    name: 'ble-sendData.page',
    state: {
      running: false,
      serviceBtn: null,
      serviceText: null,
      imgLoading: null,
      bgValueText: null,
      bgTimeText: null,
      bgTrendImage: null,
      bgStale: null,
    },

    onInit(p) {

      let data = {page: PagesType.MAIN};
      try {
        if (!(!p || p === 'undefined')) {
            data = JSON.parse(p);
        }
      } catch (e) {
        data = {page: p}
      }
    },

    startLoader() {
        vm.state.imgLoading.setProperty(hmUI.prop.MORE, {angle: this.progressAngle});
        this.progressTimer = setInterval(() => {
            this.updateLoader();
        }, PROGRESS_UPDATE_INTERVAL_MS);

        this.progressTimerRead = setInterval(() => {
            this.readFileInfo();
        }, 10000);        
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
        return `watchdrip/arrows/${fileName}.png`;
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

    readFileInfo() {
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

    build() {
      vm = this;
      let textWidget="Init service";
      let textButton="";
      
      hmUI.createWidget(hmUI.widget.IMG, IMG_LOGO);
      vm.state.imgLoading=hmUI.createWidget(hmUI.widget.IMG, IMG_LOADING_PROGRESS);
      this.progressAngle = 0;
      this.stopLoader();

      
      vm.state.bgValueText = hmUI.createWidget(hmUI.widget.TEXT, BG_VALUE_TEXT);
      vm.state.bgTimeText = hmUI.createWidget(hmUI.widget.TEXT, BG_TIME_TEXT);
      vm.state.bgTrendImage = hmUI.createWidget(hmUI.widget.IMG, BG_TREND_IMAGE);
      vm.state.bgStale = hmUI.createWidget(hmUI.widget.FILL_RECT, BG_STALE_RECT);
      vm.state.bgStale.setProperty(hmUI.prop.VISIBLE, false);


      let services = appService.getAllAppServices();
      vm.state.running = services.includes(serviceFile);
      if (vm.state.running)
      {
        textWidget="Service started";
        textButton="Stop Service";
        this.startLoader();
      }
      else
      {
        textWidget="Service stopped";
        textButton="Start Service";
        this.stopLoader();
      }

      vm.state.serviceText=hmUI.createWidget(hmUI.widget.TEXT, {
        ...FETCH_RESULT_TEXT,
        text: textWidget,
      });
        
      vm.state.serviceBtn=hmUI.createWidget(hmUI.widget.BUTTON, {
          ...FETCH_BUTTON,
          text: textButton,
          click_func: () => {
            if (vm.state.running)
              stopTimeService(vm);
            else
              permissionRequest(vm);
          },
      });
    }
  }
);
