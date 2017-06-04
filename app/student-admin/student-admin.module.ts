import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NgModule } from "@angular/core";
import {TNSFontIconModule, TNSFontIconService, TNSFontIconPipe, TNSFontIconPurePipe} from 'nativescript-ngx-fonticon';

import { studentAdminRouting } from "./student-admin.routes";
import { StudentAdminComponent } from "./student-admin.component";

@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    studentAdminRouting,
    TNSFontIconModule.forRoot({
      'fa': 'fonts/font-awesome.css'
    })
  ],
  declarations: [
    StudentAdminComponent
  ]
})
export class StudentAdminModule { }
