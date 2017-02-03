import {Component, Inject, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Router} from '@angular/router';
import {FirebaseService, BackendService} from '../services';
import {StudentModel} from '../models/student.model';

@Component({
  moduleId: module.id,
  selector: 'pb-teacher-home',
  templateUrl: 'teacher-home.component.html',
  styleUrls: ['teacher-home.css'] 
})
export class TeacherHomeComponent implements OnInit {
  
  public teacherstudents$: Observable<any>;
  constructor(public firebaseService: FirebaseService,
              private _router: Router
            ) {}

 ngOnInit() {
    this.teacherstudents$ = <any>this.firebaseService.getTeacherStudents();
  }

 goHome() {
    this._router.navigate([""]);
  }
  goToTeacherStudentHome(student:StudentModel){
    let navigationExtras = {
      queryParams: { 'name': student.Name }
    }
    this._router.navigate(["/teacher-student-home", student.id], navigationExtras);
  }
  
  viewArchive(){
    this._router.navigate(["/teacher-student-archive"]);
  }

 
}