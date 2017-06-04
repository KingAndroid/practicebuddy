import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NgModule } from "@angular/core";
import { NativeScriptAnimationsModule } from "nativescript-angular/animations";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import {TNSFontIconModule, TNSFontIconService, TNSFontIconPipe, TNSFontIconPurePipe} from 'nativescript-ngx-fonticon';
import { homeRouting } from "./home.routes";
import { HomeComponent } from "./home.component";

@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    NativeScriptAnimationsModule,
    homeRouting,
    TNSFontIconModule.forRoot({
      'fa': 'fonts/font-awesome.css'
    }),
  ],
  declarations: [    
    HomeComponent
  ]
})
export class HomeModule {}