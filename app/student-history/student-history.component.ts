import {Component, Inject, NgZone, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {TNSFancyAlert,TNSFancyAlertButton} from 'nativescript-fancyalert';
import {Router, ActivatedRoute} from '@angular/router';
import {FirebaseService, BackendService} from '../services';
import {StudentModel} from '../models';

@Component({
    moduleId: module.id,
    selector: 'pb-student-history',
    templateUrl: 'student-history.component.html',
    styleUrls: ['student-history.css']
})
export class StudentHistoryComponent implements OnInit {

    public practices$: Observable<any>;
    id: any;
    private sub: any;
  
    
    constructor(
        private route: ActivatedRoute,
        private firebaseService: FirebaseService,
        private router: Router,
        private ngZone: NgZone,
    ) {}

ngOnInit(){
  this.sub = this.route.params.subscribe((params:any) => {
      this.id = params['id'];
      this.practices$ = <any>this.firebaseService.getMyPractices(this.id);
    });
 }

 goHome() {
    this.router.navigate([""]);
 }

 viewComment(message){
    TNSFancyAlert.showEdit('A note for you', message, 'OK!');                    
 }

 viewAward(award){
    TNSFancyAlert.showNotice('A Sticker for you!', award, 'Thanks!');                    
 }
}
