import { ModuleWithProviders }  from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { StudentAdminComponent } from './student-admin.component';

const StudentAdminRoutes: Routes = [
   { path: "student-admin/:id", component: StudentAdminComponent }
];
export const studentAdminRouting: ModuleWithProviders = RouterModule.forChild(StudentAdminRoutes);