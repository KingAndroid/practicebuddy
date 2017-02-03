import { ModuleWithProviders }  from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { StudentHistoryComponent } from './student-history.component';

const StudentHistoryRoutes: Routes = [
   { path: "student-history/:id", component: StudentHistoryComponent }
];
export const studentHistoryRouting: ModuleWithProviders = RouterModule.forChild(StudentHistoryRoutes);