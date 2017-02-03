import { NativeScriptModule } from "nativescript-angular/platform";
import { NgModule } from "@angular/core";
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { authProviders, appRoutes } from "./app.routes";
import { AppComponent } from "./app.component";
import { FirebaseService, UtilsService, AuthGuard, BackendService } from "./services";

import { LoginModule } from "./login/login.module";
import { HomeModule } from "./home/home.module";
import { StudentHomeModule } from "./student-home/student-home.module";
import { TeacherHomeModule } from "./teacher-home/teacher-home.module";
import { TeacherStudentHomeModule } from "./teacher-student-home/teacher-student-home.module";


@NgModule({
  providers: [
    FirebaseService,
    UtilsService,
    AuthGuard,
    BackendService,
    authProviders
  ],
  imports: [
    NativeScriptModule,
    NativeScriptHttpModule,
    NativeScriptRouterModule,
    NativeScriptRouterModule.forRoot(appRoutes),
    LoginModule,
    HomeModule,
    StudentHomeModule,
    TeacherHomeModule,
    TeacherStudentHomeModule
  ],
  declarations: [
      AppComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
