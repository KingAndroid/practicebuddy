import { Injectable, Inject, NgZone } from '@angular/core';
var firebase = require("nativescript-plugin-firebase");
//var LoadingIndicator = require("nativescript-loading-indicator").LoadingIndicator;
import { LoadingIndicator } from "nativescript-loading-indicator";
import * as appSettings from 'application-settings';
import { RouterExtensions } from 'nativescript-angular/router';
import { UtilsService, BackendService } from '../services';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/find';
import { UserModel, StudentModel, PracticeModel } from '../models';

@Injectable()
export class FirebaseService {

  items: BehaviorSubject<Array<StudentModel>> = new BehaviorSubject([]);
  practiceitems: BehaviorSubject<Array<PracticeModel>> = new BehaviorSubject([]);
  teacherstudentsitems: BehaviorSubject<Array<StudentModel>> = new BehaviorSubject([]);
  practicearchiveitems: BehaviorSubject<Array<PracticeModel>> = new BehaviorSubject([]);

  loader = new LoadingIndicator();

  private _allItems: Array<StudentModel> = [];
  private _allPracticeItems: Array<PracticeModel> = [];
  private _allTeacherStudentsItems: Array<StudentModel> = [];
  private _allPracticeArchiveItems: Array<PracticeModel> = [];


  constructor(
    private ngZone: NgZone,

  ) { }

  register(user: UserModel) {
    return firebase.createUser({
      email: user.email,
      password: user.password
    }).then(
      function (result: any) {
        return JSON.stringify(result);
      },
      function (errorMessage: any) {
        alert(errorMessage);
      }
      )
  }

  login(user: UserModel) {
    this.loader.show({ message: 'Logging in...' });
    return firebase.login({
      type: firebase.LoginType.PASSWORD,
      email: user.email,
      password: user.password
    }).then((result: any) => {
      this.loader.hide();
      BackendService.token = result.uid;
      //BackendService.email = result.user.email;
      return JSON.stringify(result);
    }, (errorMessage: any) => {
      this.loader.hide();
      alert(errorMessage);
    });
  }

  logout() {
    BackendService.token = "";
    BackendService.email = "";
    firebase.logout();
  }

  resetPassword(email) {
    return firebase.resetPassword({
      email: email
    }).then((result: any) => {
      alert(JSON.stringify(result));
    },
      function (errorMessage: any) {
        alert(errorMessage);
      }
      ).catch(this.handleErrors);
  }

  //end user settings

  public getMyStudents(): Observable<any> {

    //this gets the students associated to the account
    return new Observable((observer: any) => {
      let path = 'StudentSettings';
      let listener: any;

      this.loader.show({ message: 'Finding my Students...' });

      let onValueEvent = (snapshot: any) => {
        this.ngZone.run(() => {
          let results = this.handleSnapshot(snapshot.value);
          observer.next(results);
          this.loader.hide();
        });
      };

      firebase.addValueEventListener(onValueEvent, `/${path}`).then(() => {
        this.loader.hide();
      });
    }).share();
  }

  public add(name: string) {
    return firebase.push(
      "/StudentSettings",
      {
        "Name": name,
        "Date": 0 - Date.now(),
        "PracticesRequired": 5,
        "PracticesCompleted": 0,
        "PracticeLength": 20,
        "Reward": "A special prize!",
        "AdminPassword": "",
        "TeacherEmail": "",
        "Instrument": 10,
        "NotifyAll": false,
        "UID": BackendService.token
      }
    ).then(
      function (result: any) {
        return 'Student added!';
      },
      function (errorMessage: any) {
        console.log(errorMessage);
      });
  }


  //utilities
  handleSnapshot(data: any) {
    //empty array, then refill
    this._allItems = [];
    if (data) {
      for (let id in data) {
        let result = (<any>Object).assign({ id: id }, data[id]);
        if (BackendService.token === result.UID) {
          this._allItems.push(result);
        }
      }
      this.publishUpdates();
    }
    return this._allItems;
  }



  publishUpdates() {
    // must emit a *new* value (immutability!)
    this._allItems.sort(function (a, b) {
      if (a.Date < b.Date) return -1;
      if (a.Date > b.Date) return 1;
      return 0;
    })
    this.items.next([...this._allItems]);
  }

  handleErrors(error) {
    console.log(JSON.stringify(error));
    return Promise.reject(error.message);
  }
}