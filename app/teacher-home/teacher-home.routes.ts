import { ModuleWithProviders }  from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { TeacherHomeComponent } from './teacher-home.component';

const TeacherHomeRoutes: Routes = [
   { path: "teacher-home", component: TeacherHomeComponent }
];
export const teacherHomeRouting: ModuleWithProviders = RouterModule.forChild(TeacherHomeRoutes);