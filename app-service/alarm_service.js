import * as appService from "@zos/app-service";
import * as notificationMgr from "@zos/notification";
import { queryPermission } from "@zos/app";

const permissions = ["device:os.bg_service"];
const serviceFile = "app-service/background_service";

AppService({
  onInit(e) {
    console.log(`=== restarting service: ${serviceFile} ===`);

    notificationMgr.notify({
            title: "Watchdrip+ Service",
            content: "Watchdrip+ Service Restarted",
            actions: [ ]
    });
    
  const [result2] = queryPermission({
    permissions,
  });

  console.log("result2: "+result2);

  if (result2 === 2) {
    const result = appService.start({
        url: serviceFile,
        file: serviceFile,
        param: `service=${serviceFile}&action=start`,
        complete_func: (info) => {
            if (info.result) 
            {
                console.log("Service Started Correctly");
            } 
            else
            {
                console.log("Service Not Started Correctly");
            }
        },
    });
  }

  },
  onDestroy() {
  },
});