import {Component, Inject, OnInit, NgZone} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Router, ActivatedRoute} from '@angular/router';
import {FirebaseService} from '../services';
import {StudentModel} from '../models';

@Component({
  moduleId: module.id,
  selector: 'pb-teacher-student-archive',
  templateUrl: 'teacher-student-archive.component.html',
  styleUrls: ['teacher-student-archive.css'] 
})
export class TeacherStudentArchiveComponent implements OnInit {
  
  public archivedstudentpractices$: Observable<any>;
  
  constructor(private route: ActivatedRoute,
        private firebaseService: FirebaseService,
        private _router: Router,
        private ngZone: NgZone
        ) {}

 ngOnInit() {
    this.archivedstudentpractices$ = <any>this.firebaseService.getArchivedPractices();
 }

 goHome() {
    this._router.navigate([""]);
  } 
  
 
}