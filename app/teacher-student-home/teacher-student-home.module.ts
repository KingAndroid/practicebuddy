import { NativeScriptModule } from "nativescript-angular/platform";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NgModule } from "@angular/core";
import {TNSFontIconModule, TNSFontIconService, TNSFontIconPipe, TNSFontIconPurePipe} from 'nativescript-ngx-fonticon';

import { teacherStudentHomeRouting } from "./teacher-student-home.routes";
import { TeacherStudentHomeComponent } from "./teacher-student-home.component";

@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    teacherStudentHomeRouting,
    TNSFontIconModule.forRoot({
      'fa': 'fonts/font-awesome.css'
    })
  ],
  declarations: [
    TeacherStudentHomeComponent
  ]
})
export class TeacherStudentHomeModule { }
