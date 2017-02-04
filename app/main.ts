// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic } from "nativescript-angular/platform";
import {registerElement} from "nativescript-angular/element-registry";
import { AppModule } from "./app.module";
import { BackendService } from "./services";
const dialogs = require("ui/dialogs");
import firebase = require("nativescript-plugin-firebase");

 firebase.init({
   persist: false,
   storageBucket: 'gs://practicebuddy-4d466.appspot.com',
   onAuthStateChanged: (data: any) => {     
     if (data.loggedIn) {
       BackendService.token = data.user.uid;
     }
     else {
       BackendService.token = "";
     }
   }
 }).then(
     function (instance) {
       console.log("firebase.init done");
     },
     function (error) {
       console.log("firebase.init error: " + error);
     }
 );
registerElement("Fab", () => require("nativescript-floatingactionbutton").Fab);
//registerElement("PlayPause", () => require("nativescript-play-pause-button").PlayPauseButton);
platformNativeScriptDynamic().bootstrapModule(AppModule);