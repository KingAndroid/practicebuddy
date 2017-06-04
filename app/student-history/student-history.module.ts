import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NgModule } from "@angular/core";
import {TNSFontIconModule, TNSFontIconService, TNSFontIconPipe, TNSFontIconPurePipe} from 'nativescript-ngx-fonticon';

import { studentHistoryRouting } from "./student-history.routes";
import { StudentHistoryComponent } from "./student-history.component";

@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    studentHistoryRouting,
    TNSFontIconModule.forRoot({
      'fa': 'fonts/font-awesome.css'
    })
  ],
  declarations: [
    StudentHistoryComponent
  ]
})
export class StudentHistoryModule { }
