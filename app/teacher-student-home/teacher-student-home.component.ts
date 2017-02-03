import {Component, Inject, OnInit, NgZone} from '@angular/core';
import * as audio from 'nativescript-audio';
import {TNSFancyAlert,TNSFancyAlertButton} from 'nativescript-fancyalert';
import {Observable} from 'rxjs/Observable';
import {Router, ActivatedRoute} from '@angular/router';
import {FirebaseService} from '../services';
import {StudentModel, PracticeModel} from '../models';

@Component({
  moduleId: module.id,
  selector: 'sd-teacher-student-home',
  templateUrl: 'teacher-student-home.component.html',
  styleUrls: ['teacher-student-home.css'] 
})
export class TeacherStudentHomeComponent implements OnInit {
  
  public student: Observable<any>;
  public studentpractices$: Observable<any>;
  private sub: any;
  public name: string;
  public id: string;
  public isPlaying: boolean;
  public player: any;
  private currentUrl: string;


  constructor(private route: ActivatedRoute,
        private firebaseService: FirebaseService,
        private _router: Router,
        private ngZone: NgZone
        ) {          
          this.player = new audio.TNSPlayer();    
        }

 ngOnInit() {
   //get the student's base info and the specific practice we are showign
 
  this.name = this.route.snapshot.queryParams['name']
  this.sub = this.route.params.subscribe((params:any) => {
      this.id = params['id'];
      console.log(this.id)
      this.studentpractices$ = <any>this.firebaseService.getMyPractices(this.id);
    });
  }

 goHome() {
    this._router.navigate([""]);
  } 

  addComment(practiceId){
     TNSFancyAlert.showTextField('Comment', '', new TNSFancyAlertButton({ label: 'Save', action: (value: any) => { 
        console.log(`User entered ${value}`); 
        if (value.trim() != "") {
        this.firebaseService.addComment(practiceId,value)
          .then(() => {
            TNSFancyAlert.showSuccess('Success!', 'Comment successfully added', 'OK!');    
          }, (err: any) => {
            alert(err);
          });
        }
    } }), 'pen.png', '#1598F6', 'Add a comment', undefined, undefined);
  }

  addAward(practiceId){
    this._router.navigate(["/sticker-gallery", practiceId]);
  }
  markComplete(practiceId){
    let buttons = [
    new TNSFancyAlertButton({ label: 'No', action: () => { console.log('Cancel'); } }),
    new TNSFancyAlertButton({ label: 'Yes', action: () => {
        this.firebaseService.markComplete(practiceId)
        .then(() => {
            TNSFancyAlert.showSuccess('Success!', 'Archived!', 'OK!');    
          }, (err: any) => {
            alert(err);
          });
    } })
    ];
    TNSFancyAlert.showCustomButtons(buttons, 'alert.png', '#1598F6', 'Archive?', `Archive this practice?`, 'Ok');  
  }

  public playAudio(filepath: string, fileType: string) {

    try {
      var playerOptions = {
        audioFile: filepath,
          completeCallback: () => {
          this.player.dispose().then(() => {
            this.isPlaying = false;
            console.log('DISPOSED');
          }, (err) => {
            console.log('ERROR disposePlayer: ' + err);
          });
        },

        errorCallback: (err: any) => {
          console.log(JSON.stringify(err));
          this.isPlaying = false;
        },

        infoCallback: (info: any) => {
          alert('Info callback: ' + info.msg);
        }
      };

      this.isPlaying = true;


      this.player.playFromUrl(playerOptions).then(() => {
        this.isPlaying = true;
      }, (err: any) => {
        console.log(err);
        this.isPlaying = false;
      });

    } catch (ex) {
      console.log(ex);
    }
  }

  public playTrack(item:any) {
    let url = item.Track;
    this.playAudio(url, 'remoteFile');
  }


public stopTrack(args) {
  console.log(this.isPlaying)
    if (this.isPlaying) {
      this.player.dispose().then(() => {
      }, (err) => {
        console.log(err);
      });
    }
}


  

 
}