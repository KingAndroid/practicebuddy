import { NativeScriptModule } from "nativescript-angular/platform";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NgModule } from "@angular/core";
import {TNSFontIconModule, TNSFontIconService, TNSFontIconPipe, TNSFontIconPurePipe} from 'nativescript-ngx-fonticon';

import { teacherStudentArchiveRouting } from "./teacher-student-archive.routes";
import { TeacherStudentArchiveComponent } from "./teacher-student-archive.component";

@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    teacherStudentArchiveRouting,
    TNSFontIconModule.forRoot({
      'fa': 'fonts/font-awesome.css'
    })
  ],
  declarations: [
    TeacherStudentArchiveComponent
  ]
})
export class TeacherStudentArchiveModule { }
