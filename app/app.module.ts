import { NativeScriptModule } from "nativescript-angular/platform";
import { NgModule } from "@angular/core";
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { authProviders, appRoutes } from "./app.routes";
import { AppComponent } from "./app.component";
import { FirebaseService, UtilsService, BackendService } from "./services";

import { LoginModule } from "./login/login.module";
import { HomeModule } from "./home/home.module";
import { StudentHomeModule } from "./student-home/student-home.module";
import { StudentHistoryModule } from "./student-history/student-history.module";
import { StudentAdminModule } from "./student-admin/student-admin.module";

import { TeacherHomeModule } from "./teacher-home/teacher-home.module";
import { TeacherStudentHomeModule } from "./teacher-student-home/teacher-student-home.module";
import { TeacherStudentArchiveModule } from "./teacher-student-archive/teacher-student-archive.module";

import { StickerGalleryModule } from "./sticker-gallery/sticker-gallery.module";


@NgModule({
  providers: [
    FirebaseService,
    UtilsService,
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
    StudentHistoryModule,
    StudentAdminModule,
    TeacherHomeModule,
    TeacherStudentHomeModule,
    StickerGalleryModule,
    TeacherStudentArchiveModule
  ],
  declarations: [
      AppComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
