import { ModuleWithProviders }  from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { TeacherStudentHomeComponent } from './teacher-student-home.component';

const TeacherStudentHomeRoutes: Routes = [
   { path: "teacher-student-home/:id", component: TeacherStudentHomeComponent }
];
export const teacherStudentHomeRouting: ModuleWithProviders = RouterModule.forChild(TeacherStudentHomeRoutes);