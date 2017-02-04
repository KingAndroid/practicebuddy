import { ModuleWithProviders }  from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { TeacherStudentArchiveComponent } from './teacher-student-archive.component';

const TeacherStudentArchiveRoutes: Routes = [
   { path: "teacher-student-archive", component: TeacherStudentArchiveComponent }
];
export const teacherStudentArchiveRouting: ModuleWithProviders = RouterModule.forChild(TeacherStudentArchiveRoutes);