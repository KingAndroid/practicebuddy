import { Component, Inject, Injectable, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { UtilsService, FirebaseService } from '../services';

import * as timer from 'timer';
import {TNSFancyAlert,TNSFancyAlertButton} from 'nativescript-fancyalert';
import * as audio from 'nativescript-audio';
import * as fs from 'file-system';
import * as appSettings from 'application-settings';
import { LoadingIndicator } from 'nativescript-loading-indicator';
var insomnia = require("nativescript-insomnia");

import { Router, ActivatedRoute } from '@angular/router';
import { StudentModel } from '../models/student.model';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import "rxjs/Rx";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  moduleId: module.id,
  selector: 'pb-student-home',
  templateUrl: 'student-home.component.html',
  styleUrls: ['student-home.css']
})
@Injectable()
export class StudentHomeComponent implements OnInit, OnDestroy {

  public student: Observable<any>;
  public editedStudent: StudentModel;
  public myStudent: StudentModel;
  id: any;
  private sub: any;
  name: string;
  practicesrequired: number;
  practicelength: number;
  practicescompleted: number;
  practiceId: string;
  instrument: number;
  teacheremail: string = "";
  reward: string;
  notifyAll: boolean;
  //timers
  isTiming: boolean;
  isPaused: boolean;
  isRecording: boolean;
  minutes: number = 0;
  seconds: number = 0;
  progress: string;
  myTimer: any;
  //for recorder
  myRecordingTimer: any;
  recorderseconds: number = 0;
  //emails
  subject: string;
  message: string;
  status: string;

  private isPlaying: Boolean = false;
  private player: any;
  private currentUrl: string;
  private recorder: any;
  private recorderOptions: any;
  //mail
  private mailgunUrl: string = "post.ladeezfirstmedia.com";
  private apiKey: string = "YXBpOmtleS00czhpbjNqY3pjNW1uMDNpYWZmejJmempxYzFjNWI5NQ==";
  //timer
  public minutes$: BehaviorSubject<number> = new BehaviorSubject(0);
  public seconds$: BehaviorSubject<number> = new BehaviorSubject(0);

  loader = new LoadingIndicator();
  
  constructor(
    private route: ActivatedRoute,
    private firebaseService: FirebaseService,
    private router: Router,
    private ngZone: NgZone,
    private http: Http
  ) {
    this.player = new audio.TNSPlayer();
    this.recorder = new audio.TNSRecorder();
    this.recorderOptions = this.recorder.AudioRecorderOptions; 
  }

  

  ngOnInit() {
      this.sub = this.route.params.subscribe((params: any) => {
        this.id = params['id'];
        this.firebaseService.getMyStudent(this.id).subscribe((student) => {
          this.ngZone.run(() => {
            for (let prop in student) {
              //props
              if (prop === "Id") {
                this.id = student[prop];
              }
              if (prop === "Name") {
                this.name = student[prop];
              }
              if (prop === "PracticesRequired") {
                this.practicesrequired = student[prop];
              }
              if (prop === "PracticesCompleted") {
                this.practicescompleted = student[prop];
              }
              if (prop === "PracticeLength") {
                this.practicelength = student[prop];
              }
              if (prop === "Reward") {
                this.reward = student[prop];
              }
              if (prop === "Instrument") {
                this.instrument = student[prop];
              }
              if (prop === "TeacherEmail") {
                this.teacheremail = student[prop];
              }
              if (prop === "NotifyAll") {
                this.notifyAll = student[prop];
              }
            }
          });
        });
      });
  }

  goToHistory(id:string) {
    this.router.navigate(["/student-history", id]);
}

editStudent(id:string){
    //edit selected student
    this.router.navigate(["/student-admin", id]);
}

deleteStudent(id:string){
    let buttons = [
    new TNSFancyAlertButton({ label: 'No', action: () => { console.log('Cancel'); } }),
    new TNSFancyAlertButton({ label: 'Yes', action: () => {
        this.firebaseService.deleteStudent(id)
          .then(() => {
             TNSFancyAlert.showSuccess('Success!', 'Student successfully deleted', 'OK!');
             this.router.navigate([""]);
          }, (err: any) => {
            alert(err);
          });
    } })
    ];
    TNSFancyAlert.showCustomButtons(buttons, 'alert.png', '#F28600', 'Delete?', `Are you sure you want to delete this student?`, 'Ok');


}

  toggleRecord(args) {
    if (!this.isTiming) {
        TNSFancyAlert.showError('Oops!', "Please start your practice session timer before starting to record.", 'OK!');
      }
    else{   
      if (!this.isRecording) {

       this.recorderOptions = {

        filename: UtilsService.documentsPath(`recording-${Date.now()}.m4a`),
    
        infoCallback: () => {
        },

        errorCallback: () => {
          alert('Error recording.');
        }
      };

      //start the recorder
      this.startRecorder(this.recorderOptions);
      //start the timer
      this.myRecordingTimer = timer.setInterval(() => {
        if (this.recorderseconds < 60 && this.recorderseconds >= 0) {
              ++this.recorderseconds;
              //console.log(this.recorderseconds)            
        }
        else{
          this.recorderseconds = 0;
          this.stopRecorder(this.recorderOptions);
        }
      }, 1000);    
    }
  }
}

  startRecorder(options){         
        console.log("start recording here")
          this.recorder.start(options).then((result) => {          
          this.isRecording = true;
        }, (err) => {
          this.isRecording = false;
          alert(err);
        });
      
  }

  stopRecorder(options){
    timer.clearInterval(this.myRecordingTimer);
    if (this.isRecording) {
      this.recorder.stop(options).then(() => {
        this.isRecording = false;
        this.loader.show({ message: 'Saving your recording!' });
        console.log(options.filename);
        this.firebaseService.saveRecording(options.filename).then((uploadedFile: any) => {
          this.loader.hide();          
          let practiceId = appSettings.getString('practiceId');
          let track = uploadedFile.name;
                this.firebaseService.getDownloadUrl(track).then((downloadUrl: string) => {
                  //if there is a practice already logged, edit the record
                  if(practiceId!=null){
                  this.firebaseService.addPracticeTrack(practiceId,downloadUrl).then((result:any) => {
                    console.log("practice written")
                      }, 
                      (error: any) => {
                        alert(error);
                  });
                  } 
                  //otherwise, save the downloadpath
                  else {
                    appSettings.setString('downloadUrl',downloadUrl)
                  }              
                })   
        }, (error: any) => {
          this.loader.hide();
          alert('File upload error: ' + error);
        });      
      }, (ex) => {
        console.log(ex);
        this.isRecording = true;
    });
  }
  this.isRecording = false;   
}


  startTimer() {
    //if it's not already timing
    //keep awake
    insomnia.keepAwake().then(function() {});
    //clear appsettings
     appSettings.clear();
    if (!this.isTiming) {
        this.isTiming = true;
        this.myTimer = timer.setInterval(() => {
          if (this.seconds < 60 && this.seconds >= 0) {
            ++this.seconds;
            this.ngZone.run(() => {
              this.seconds$.next(this.seconds);
            });
          }
          else {
            this.seconds = 0;
            ++this.minutes;
            this.ngZone.run(() => {
              this.minutes$.next(this.minutes);
              //when this.minutes is the same as the student minutes, stop everything and write to db.
              if (this.minutes == this.practicelength) {
                //stop timer
                this.stopTimer();
                //increment practicescompleted, reset if required = completed
                ++this.practicescompleted;
                
                if(this.practicesrequired == this.practicescompleted){
                  this.status = "done";
                  this.practicescompleted = 0;
                }
                let track = appSettings.getString('downloadUrl');
                this.firebaseService.writePractice(this.id,this.name,this.practicelength, this.teacheremail, track).then((result:any) => {
                  appSettings.setString('practiceId',result.key)
                    this.testForDone(this.id, this.status);
                  }, (error: any) => {
                    alert(error);
                  });
              }
            });
          }

        }, 1000);
      }
    
  }

  resetTimer() {
    this.isTiming = false;
    this.isPaused = false;
    this.stopTimer();
  }

  goHome() {
    this.router.navigate([""]);
  }


  sendEmail(mode) {
    if (this.teacheremail) {
      let headers = new Headers(
        {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": "Basic " + this.apiKey
        }
      );
      let options = new RequestOptions({ headers: headers });
      if(mode == "goal")
        {
          this.subject = "Your student just completed a goal on the Practice Buddy app!";
          this.message = "Your student, "+this.name+", completed a goal on the Practice Buddy app, and has qualified for a reward: "+this.reward+". Login to the app to view the practice details and give feedback!";
        }
      else {
          this.subject = "Your student just completed a session on the Practice Buddy app!";       
          this.message = "Your student, "+this.name+", just logged a practice on the Practice Buddy app. Login to the app to view the practice details and give feedback!";
      }
      let body = "from=yourfriends@practicebuddyapp.com&to=" + this.teacheremail + "&subject=" + this.subject + "&text=" + this.message;
      this.http.post("https://api.mailgun.net/v3/" + this.mailgunUrl + "/messages", body, options)
        .map(result => result.json())
        .do(result => console.log("RESULT: ", JSON.stringify(result)))
        .subscribe(result => {
          console.log("SENT!");
        }, error => {
          console.log(error);
        });
    }
  }
  pauseTimer() {
    this.isTiming = false;
    this.isPaused = true;
    timer.clearInterval(this.myTimer);
  }

  stopTimer() {
    insomnia.allowSleepAgain().then(function() {});
      //todo - warn if you're stopping early
      this.isTiming = false;
      this.isPaused = false;
      timer.clearInterval(this.myTimer);
      this.minutes = 0;
      this.seconds = 0;
      this.ngZone.run(() => {
        this.seconds$.next(this.seconds);
        this.minutes$.next(this.minutes);
      });
  }


  testForDone(id: string, status: string) {
    var msg;
    if (this.status == "done") {
      //reset practicesCompleted, show alert, and send email
      msg = "Congratulations! You completed a practice goal!";
      this.sendEmail("goal");
      this.firebaseService.clearPracticesCompleted(id);
    }
    else {
      msg = "Congratulations! You completed a practice session!";
      if (this.notifyAll){
        this.sendEmail("session");                     
      }
      //increment practices completed
      this.firebaseService.incrementPracticesCompleted(this.id, this.practicescompleted);
    }
    TNSFancyAlert.showSuccess('Success!', msg, 'OK!');
  }

  ngOnDestroy() {
      this.stopTimer();
      this.stopRecorder(this.recorderOptions);
      if (this.sub) this.sub.unsubscribe();
      if (this.player) this.player.dispose();
  }


}