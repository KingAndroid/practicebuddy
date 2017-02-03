import { ModuleWithProviders }  from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { StudentHomeComponent } from './student-home.component';

const StudentHomeRoutes: Routes = [
  { path: "student-home/:id", component: StudentHomeComponent }
];
export const studentHomeRouting: ModuleWithProviders = RouterModule.forChild(StudentHomeRoutes);