import { Component, Inject, OnInit, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Page } from "ui/page";
import { BackendService, FirebaseService } from "../services";
import { StudentModel } from "../models";
import { RouterExtensions } from 'nativescript-angular/router/router-extensions';
import { Router } from '@angular/router';

import * as dialogs from 'ui/dialogs';
import * as frame from 'ui/frame';
import {TNSFancyAlert,TNSFancyAlertButton} from 'nativescript-fancyalert';

@Component({
    moduleId: module.id,
    selector: "pb-home",
    templateUrl: "home.html",
    styleUrls: ['home.css']
})
export class HomeComponent implements OnInit { 

    public students$: Observable<any>;

    constructor(private routerExtensions: RouterExtensions,
        private firebaseService: FirebaseService,
        private router: Router,
        private ngZone: NgZone
    ) {}
    
    ngOnInit() { 
         TNSFancyAlert.shouldDismissOnTapOutside = true;

         this.ngZone.run(() => {
             this.students$ = <any>this.firebaseService.getMyStudents();
         })
        
            if (frame.topmost().ios) {
                frame.topmost().ios.controller.visibleViewController.navigationItem.setHidesBackButtonAnimated(true, false);
             }
    } 

    
    goToStudentHome(id: string) {
        this.router.navigate(["/student-home", id]);
    }

    goToTeachersHome() {
        this.router.navigate(["/teacher-home"]);
    }

    addStudent() {
        var options = {
            title: 'Add a student',
            okButtonText: 'Save',
            cancelButtonText: 'Cancel',
            inputType: dialogs.inputType.text
        };
        dialogs.prompt(options).then((result: any) => {
            if (result.text.trim() != "") {
                this.firebaseService.add(result.text)
                    .then(() => {
                        TNSFancyAlert.showSuccess('Success!', 'Student successfully added', 'OK!');
                    }, (err: any) => {
                        alert(err);
                    });
            }
        });


        /*this.fancyalert.TNSFancyAlert.showTextField('Add', '', new this.fancyalert.TNSFancyAlertButton({ label: 'Save', action: (value: any) => { 
             console.log(`User entered ${value}`); 
             if (value.trim() != "") {
             this.firebaseService.add(value)
               .then(() => {
                 this.fancyalert.TNSFancyAlert.showSuccess('Success!', 'Student successfully added', 'OK!');    
               }, (err: any) => {
                 alert(err);
               });
             }
         } }), 'plus.png', '#F2B208', 'Add a student', undefined, undefined);*/

    }


    logout() {
        //check whether for real, then logout
        //todo keep dialog for android
        /*var options = {
          title: 'Logout?',
          okButtonText: 'Yes',
          cancelButtonText: 'Cancel'
        };
        this.dialogs.confirm(options).then((result: any) => {
          //navigate
          this._router.navigate(["/"]);
        });*/
        let buttons = [
            new TNSFancyAlertButton({ label: 'No', action: () => { console.log('Cancel'); } }),
            new TNSFancyAlertButton({
                label: 'Yes', action: () => {
                    this.firebaseService.logout();
                    this.routerExtensions.navigate(["/login"], { clearHistory: true });
                }
            })
        ];
        TNSFancyAlert.showCustomButtons(buttons, 'alert.png', '#F13030', 'Logout?', `Are you sure you want to logout?`, 'Ok');


    }      
    
    
    
}

