import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NgModule } from "@angular/core";
import {TNSFontIconModule, TNSFontIconService, TNSFontIconPipe, TNSFontIconPurePipe} from 'nativescript-ngx-fonticon';

import { studentHomeRouting } from "./student-home.routes";
import { StudentHomeComponent } from "./student-home.component";

@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    studentHomeRouting,
    TNSFontIconModule.forRoot({
      'fa': 'fonts/font-awesome.css'
    })
  ],
  declarations: [
    StudentHomeComponent
  ]
})
export class StudentHomeModule { }
