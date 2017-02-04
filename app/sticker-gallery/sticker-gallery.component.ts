import {Component, Inject, OnInit, NgZone} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {TNSFancyAlert,TNSFancyAlertButton} from 'nativescript-fancyalert';
import {Router, ActivatedRoute} from '@angular/router';
import {FirebaseService} from '../services';
import {PracticeModel} from '../models';

@Component({
  moduleId: module.id,
  selector: 'sd-sticker-gallery',
  templateUrl: 'sticker-gallery.component.html',
  styleUrls: ['sticker-gallery.css'] 
})
export class StickerGalleryComponent implements OnInit {
  
  stickerList = [];
  private sub:any;
  private id;
  
  constructor(private route: ActivatedRoute,
        private firebaseService: FirebaseService,
        private _router: Router,
        private ngZone: NgZone
        ) {}

ngOnInit() {
   for (var i = 1; i < 40; i++) {
      this.stickerList.push(i);
    }
    this.sub = this.route.params.subscribe((params:any) => {
      this.id = params['id'];
    });
}

selectSticker(stickerId){
  let buttons = [
      new TNSFancyAlertButton({ label: 'No', action: () => { console.log('Cancel'); } }),
      new TNSFancyAlertButton({ label: 'Yes', action: () => {
          this.firebaseService.addAward(this.id,stickerId)
          .then(() => {
              TNSFancyAlert.showSuccess('Success!', 'Sticker Added!', 'OK!');    
            }, (err: any) => {
              alert(err);
            });
      } })
      ];
      TNSFancyAlert.showCustomButtons(buttons, 'alert.png', '#1598F6', 'Add a Sticker?', `Award this sticker?`, 'Ok'); 
}

goHome(){
  this._router.navigate([""]);
}
  
  
 
}