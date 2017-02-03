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
    StudentHomeModule
  ],
  declarations: [
      AppComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
