import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder,FormControl,FormControlName, Validators} from '@angular/forms';
import { publish } from 'rxjs/operators';
import { AdvertisementsService } from 'src/services/advertisements.service';
import { AlertService } from 'src/services/alert.service';
import { MetadataService } from 'src/services/metadata.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-add-second-device',
  templateUrl: './add-second-device.component.html',
  styleUrls: ['./add-second-device.component.css'],
  animations:[
    trigger("inOutPaneAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateX(100%)" }),
        animate(
          "500ms ease-in-out",
          style({ opacity: 1, transform: "translateX(0)" })
        )
      ]),
      transition(":leave", [
        style({ opacity: 1, transform: "translateX(0)" }),
        animate(
          "500ms ease-in-out",
          style({ opacity: 0, transform: "translateX(100%)" })
        )
      ])
    ])
  ]
})
export class AddSecondDeviceComponent {



@Output() newItemEvent = new EventEmitter();


constructor(private fb:FormBuilder,
  private storageSer: StorageService,
  private dropDown: MetadataService,
  private adver:AdvertisementsService,
  public alert:AlertService
) {}


userForm1!: FormGroup;
siteDataForForm:any;
user:any

ngOnInit():void {
  this.user = this.storageSer.get('user')
  this.siteDataForForm = this.storageSer.get('siteIds');
  this.getMetadata();
  this.userForm1 = this.fb.group({
    'siteId': new FormControl('', Validators.required),
    'deviceTypeId':new FormControl('',Validators.required),
    'deviceName': new FormControl('', Validators.required),
    'createdBy': new FormControl(''),
    'remarks': new FormControl('')
  })


}

finanlDeviceId:any

close() {
  this.newItemEvent.emit();
}

deviceType: any;
deviceMode: any;
workingDay: any;
tempRange: any;
ageRange: any;
modelObjectType: any;
model: any;
modelResolution: any;
softwareVersion: any;
weatherInterval: any;
deviceStatus: any;
deviceCountry: any;
getMetadata() {
  this.dropDown.getMetadata().subscribe((res: any) => {
    for(let item of res) {
      if(item.type == 2) {
        this.deviceType = item.metadata;
      } else if(item.type == 1) {
        this.deviceMode = item.metadata;
      } else if(item.type == 6) {
        this.workingDay = item.metadata;
      } else if(item.type == 10) {
        this.tempRange = item.metadata;
      } else if(item.type == 13) {
        this.ageRange = item.metadata;
      } else if(item.type == 7) {
        this.modelObjectType = item.metadata;
      } else if(item.type == 18) {
        this.model = item.metadata;
      } else if(item.type == 19) {
        this.modelResolution = item.metadata;
      } else if(item.type == 20) {
        this.softwareVersion = item.metadata;
      } else if(item.type == 21) {
        this.weatherInterval = item.metadata;
      } else if(item.type == 4) {
        this.deviceStatus = item.metadata;
      } else if(item.type == 28) {
        this.deviceCountry = item.metadata;
      }
    }
  })
}


deviceId:any 
submit(item:any) {
  if(this.userForm1.valid) {
    item.createdBy = this.user?.UserId
    this.adver.createDevice(this.userForm1.value).subscribe((res:any)=> {
      console.log(res);
      this.deviceId = res.deviceId
      this.adver.deviceId.next(res.deviceId)
      this.newItemEvent.emit();
      this.alert.wait();
      if(res?.statusCode == 200) {
        this.alert.success(res?.message)
      }
    },(error:any)=> {
      this.alert.error(error?.err?.message)
    })
  }
 
}








}
