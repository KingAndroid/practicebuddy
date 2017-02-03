import { Injectable, Inject, NgZone } from '@angular/core';
import firebase = require("nativescript-plugin-firebase");
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

  constructor(
    private ngZone: NgZone,
    //private utils: UtilsService
  ) {}

  items: BehaviorSubject<Array<StudentModel>> = new BehaviorSubject([]);
  practiceitems: BehaviorSubject<Array<PracticeModel>> = new BehaviorSubject([]);
  teacherstudentsitems: BehaviorSubject<Array<StudentModel>> = new BehaviorSubject([]);
  practicearchiveitems: BehaviorSubject<Array<PracticeModel>> = new BehaviorSubject([]);

  loader = new LoadingIndicator();

  private _allItems: Array<StudentModel> = [];
  private _allPracticeItems: Array<PracticeModel> = [];
  private _allTeacherStudentsItems: Array<StudentModel> = [];
  private _allPracticeArchiveItems: Array<PracticeModel> = [];

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
      })
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

  public getMyStudent(id: string): Observable<any> {
    return new Observable((observer: any) => {
      observer.next(this._allItems.filter(s => s.id === id)[0]);
    }).share();
  }

  /*public saveRecording(localPath: string, file?: any): Promise<any> {
    let filename = this.utils.getFilename(localPath);
    let remotePath = `${filename}`;
    return firebase.uploadFile({
      remoteFullPath: remotePath,
      localFullPath: localPath
    });
  }*/

  public deleteStudent(id: string) {
    return firebase.remove("/StudentSettings/" + id + "")
      .then(
      //this.publishUpdates()
      )
      .catch(this.handleErrors);
  }

  public addPracticeTrack(id: string, track: string) {
    this.publishUpdates();
    return firebase.update("/Practices/" + id + "", { Track: track })
      .then(
      function (result: any) {
        return 'Practice track added!';
      },
      function (errorMessage: any) {
        console.log(errorMessage);
      });
  }

  public getDownloadUrl(remoteFilePath: string): Promise<any> {
    return firebase.getDownloadUrl({
      remoteFullPath: remoteFilePath
    })
      .then(
      function (url: string) {
        return url;
      },
      function (errorMessage: any) {
        console.log(errorMessage);
      });
  }

  public writePractice(id: string, name: string, practicelength: number, teacheremail: string, track: string) {
    this.publishUpdates();
    return firebase.push("/Practices/", { StudentId: id, Name: name, Date: firebase.ServerValue.TIMESTAMP, PracticeLength: practicelength, TeacherEmail: teacheremail, Track: track })
      .then(
      function (result: any) {
        return result;
      },
      function (errorMessage: any) {
        console.log(errorMessage);
      });
  }
  public clearPracticesCompleted(id: string) {
    //sets practices to zero
    this.publishUpdates();
    return firebase.update("/StudentSettings/" + id + "", { PracticesCompleted: 0 })
      .then(
      function (result: any) {
        return 'Congratulations! You completed a practice goal!';
      },
      function (errorMessage: any) {
        console.log(errorMessage);
      });
  }

  public incrementPracticesCompleted(id: string, currPracticesCompleted: number) {
    this.publishUpdates();
    return firebase.update("/StudentSettings/" + id + "", { PracticesCompleted: currPracticesCompleted })
      .then(
      function (result: any) {
        return 'Student information saved!';
      },
      function (errorMessage: any) {
        console.log(errorMessage);
      });
  }

  handleSnapshot(data: any) {
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