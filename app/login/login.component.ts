import {Component} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {UserModel} from '../models/user.model';
import {FirebaseService} from '../services';
import {prompt} from "ui/dialogs";
import {Router} from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router/router-extensions';

@Component({
  moduleId: module.id,
  selector: 'pb-login',
  templateUrl: 'login.html',
  styleUrls: ['login.css'],
})
export class LoginComponent {
  user: UserModel;
  isLoggingIn = true;
  isAuthenticating = false;

  
  constructor(private firebaseService: FirebaseService,
              private routerExtensions: RouterExtensions,
              private router: Router
            ) {
              this.user = new UserModel();
              this.user.email = "";
              this.user.password = "";
            }

 
 submit() {
    this.isAuthenticating = true;
    if (this.isLoggingIn) {
      this.login();
    } else {
      this.signUp();
    }
  }

  login() {
     this.firebaseService.login(this.user)
      .then(() => {
        this.isAuthenticating = false;
        this.routerExtensions.navigate(["/"], { clearHistory: true } );

      })
      .catch((message:any) => {
        this.isAuthenticating = false;
      });
  }
  
  signUp() {
    this.firebaseService.register(this.user)
      .then((result:any) => {
        this.isAuthenticating = false;
        this.toggleDisplay();
      })
      .catch((message:any) => {
        alert(message);
        this.isAuthenticating = false;
      });
  }

  forgotPassword() {

    prompt({
      title: "Forgot Password",
      message: "Enter the email address you used to register for PracticeBuddy to reset your password.",
      defaultText: "",
      okButtonText: "Ok",
      cancelButtonText: "Cancel"
    }).then((data) => {
      if (data.result) {
        this.firebaseService.resetPassword(data.text.trim())
          .then((result:any) => {
            if(result){
              alert(result);
            }
         });
      }
    });
 }
  
toggleDisplay() {
    this.isLoggingIn = !this.isLoggingIn;
  }
}