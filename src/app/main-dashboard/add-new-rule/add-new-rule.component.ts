import { animate, style, transition, trigger } from '@angular/animations';
import { Dialog } from '@angular/cdk/dialog';
import { Component, EventEmitter, Input, Output } from '@angular/core'
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdvertisementsComponent } from 'src/app/components/advertisements/advertisements.component';
import { AdvertisementsService } from 'src/services/advertisements.service';
import { AlertService } from 'src/services/alert.service';
import { AssetService } from 'src/services/asset.service';
import { MetadataService } from 'src/services/metadata.service';
import { SiteService } from 'src/services/site.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-add-new-rule',
  templateUrl: './add-new-rule.component.html',
  styleUrls: ['./add-new-rule.component.css'],
  animations:[
    trigger("inOutPaneAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateX(100%)" }), //apply default styles before animation starts
        animate(
          "500ms ease-in-out",
          style({ opacity: 1, transform: "translateX(0)" })
        )
      ]),
      transition(":leave", [
        style({ opacity: 1, transform: "translateX(0)" }), //apply default styles before animation starts
        animate(
          "500ms ease-in-out",
          style({ opacity: 0, transform: "translateX(100%)" })
        )
      ])
    ])
  ]
})
export class AddNewRuleComponent {
  constructor(
    private dialog:Dialog,
    private router: Router,
    private fb: FormBuilder,
    private assetSer: AssetService,
    private dropDown: MetadataService,
    private alertSer: AlertService,
    private siteService: SiteService,
    private storageSer: StorageService,
    private siteSer: SiteService,
    private adver:AdvertisementsService
  ) { }

  @Input() inputData:any
  @Input() deviceInputData:any

  @Output() newItemEvent = new EventEmitter();

  addAssetForm: any = FormGroup;
  searchText: any;
  currentDate = new Date();

  personshow : boolean = false;

  toggleShowOnOff(event: any): void {
    this.personshow = !this.personshow;
      this.addAssetForm.get('modelObjectTypeId').setValue(1);
      this.addAssetForm.get('objectCount').reset();
      this.addAssetForm.get('deviceCam').reset(0);
      // this.addAssetForm.get('cameraId').reset().setValue(0);
  }
    // refreshFields(): void {
   
    //   this.addAssetForm.get('modelObjectTypeId').reset();
    //   this.addAssetForm.get('objectCount').reset();
    //   this.addAssetForm.get('deviceCam').reset();
    //   this.addAssetForm.get('cameraId').reset();
    // }
  


  objectRule:any 

  person:any = 1;

  siteId:any
  adFor: any = null;
  enableDemo: boolean = false;

  // deviceIdFromStorage: any;
  user: any;
  finalId:any
  finalName:any
  ngOnInit(): void {
    console.log(this.inputData)
    this.user = this.storageSer.get('user');
    // this.deviceIdFromStorage = this.storageSer.get('add_body');
    this.addAssetForm = this.fb.group({
        adId : new FormControl(''),
        adHours: new FormControl('true'),
        workingDays: new FormControl('true'),
        temp: new FormControl(''),
        objectRule: new FormControl(''),
        cameraId: new FormControl(''),
        modelObjectTypeId: new FormControl(''),
        objectCount: new FormControl(''),
        createdBy: new FormControl(''),

        tempFrom: new FormControl(''),
        tempTo: new FormControl(''),
        
        deviceCam: new FormControl('')
    });

    this.getSitesListForUserName();
    this.onMetadataChange()
    // this.getCamerasForSiteIdForDevice();
    
    this.adver.ruleForDevice.subscribe({
      next: (res: any)=> {
        // console.log(res)
        this.getCamerasForSiteId(res.siteId? res.siteId : this.inputData.siteId)
      }
    });


    this.adver.addIdSub.subscribe({
      next: (res: any)=> {
        console.log(res)
        this.finalId = res;
      }
    });

    this.adver.addNameSub.subscribe({
      next: (res: any)=> {
        console.log(res)
        this.finalName = res
      }
    });
  }

  

 

  siteData: any = [];
  getSitesListForUserName() {
    this.siteSer.getSitesListForUserName().subscribe((res: any) => {
      if(res?.Status == 'Success') {
        this.siteData = res.sites?.sort((a: any, b: any) => a.siteId < b.siteId ? -1 : a.siteId > b.siteId ? 1 : 0);
      }
    });
    
  }

  filteredDevices: any = [];
  filterAdvertisements() {
    this.assetSer.listDeviceBySiteId({siteId: this.siteId}).subscribe((res: any) => {
      this.filteredDevices = res.flatMap((item: any) => item.adsDevices);
    });
  }

  /* searches */
  siteSearch: any;
  searchSites(event: any) {
    this.siteSearch = (event.target as HTMLInputElement).value
  }

  data: any;
  siteIdList: any;
  deviceIdList: any;
  getRes() {
    this.siteService.getSitesListForUserName().subscribe((res: any) => {
      // console.log(res);
      this.siteIdList = res.sites;
    })

    this.assetSer.listDeviceAdsInfo().subscribe((res: any) => {
      const assets = res.flatMap((item: any) => item.adsDevices);
      // console.log(assets);
      this.deviceIdList = assets;
    })
  }

  /* file upload */
  selectedFile: any;
  // selectedFiles: any = [];
  onFileSelected(event: any) {
    if(typeof(event) == 'object') {
      this.selectedFile = event.target.files[0] ?? null;
    }
  }

  


  closenow() {
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
  temp_ranges: any;
  onMetadataChange() {
    let data = this.storageSer.get('metaData');
    data?.forEach((item: any) => {
      if(item.type == 2) {
        this.deviceType = item.metadata;
      } else if(item.type == 1) {
        this.deviceMode = item.metadata;
      } else if(item.type == 6) {
        this.workingDay = item.metadata;
        console.log(this.workingDay)
      } else if(item.type == 11) {
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
      } else if(item.type == 96) {
        this.temp_ranges = item.metadata;
      }
    })
  }


  /* Search for Get Site and Device Id's */
  sit: string = '';
  dev: string = '';
  siteSearchh(e: Event) {
    this.sit = (e.target as HTMLInputElement).value;
  }

  deviceSer(e: Event) {
    this.dev = (e.target as HTMLInputElement).value;
  }

  /* create Asset */
  submit: boolean = false;





  currentItem:any;
  cameras: any = [];
  getCamerasForSiteId(site: any) {
    this.siteSer.getCamerasForSiteId(site).subscribe((res: any) => {
      // console.log(res);
      this.cameras = res.cameras;
    })
  }

  

  // camerass: any = [];
  // getCamerasForSiteIdForDevice() {
  //   this.siteSer.getCamerasForSiteId(this.deviceInputData?.siteId).subscribe((res: any) => {
  //     console.log(res);
  //     this.camerass = res.cameras;
  //   })
  // }


  


  adTimes: any = {
    name: 'All',
    completed: true,
    subtasks: [
      {name: '00', completed: true},
      {name: '01', completed: true},
      {name: '02', completed: true},
      {name: '03', completed: true},
      {name: '04', completed: true},
      {name: '05', completed: true},
      {name: '06', completed: true},
      {name: '07', completed: true},
      {name: '08', completed: true},
      {name: '09', completed: true},
      {name: '10', completed: true},
      {name: '11', completed: true},
      {name: '12', completed: true},
      {name: '13', completed: true},
      {name: '14', completed: true},
      {name: '15', completed: true},
      {name: '16', completed: true},
      {name: '17', completed: true},
      {name: '18', completed: true},
      {name: '19', completed: true},
      {name: '20', completed: true},
      {name: '21', completed: true},
      {name: '22', completed: true},
      {name: '23', completed: true}
    ],
  };

  adDays: any = {
    name: 'All',
    completed: true,
    subtasks: [
      {first:'Sun', name: '0', completed: true},
      {first:'Mon', name: '1', completed: true},
      {first:'Tue', name: '2', completed: true},
      {first:'Wed', name: '3', completed: true},
      {first:'Thu', name: '4', completed: true},
      {first:'Fri', name: '5', completed: true},
      {first:'Sat', name: '6', completed: true},
    ],
  };

  selectAllAddTimes: boolean = true;
  selectAllAddDays: boolean = true;
  
  updateAllComplete() {
    this.selectAllAddTimes = this.adTimes.subtasks.every((t: any) => t.completed);
  }

  updateAllComplete1() {
    this.selectAllAddDays = this.adDays.subtasks.every((t: any) => t.completed);
  }

  setAll(completed: boolean) {
    this.selectAllAddTimes = completed;
    this.adTimes.subtasks.forEach((t: any) => (t.completed = completed));
  }

  setAll1(completed: boolean) {
    this.selectAllAddDays = completed;
    this.adDays.subtasks.forEach((t: any) => (t.completed = completed));
  }

  camera:any = this.addAssetForm.value
  deviceCam:any= 0;

  // addNewAsset() {
  //   let times = this.adTimes.subtasks.filter((item: any)=> item.completed);
  //   let finalTimes = times.map((task: any) => task.name);
  //   this.addAssetForm.value.adHours = finalTimes.join(',')
  //   console.log(finalTimes.join(','));

  //   let days = this.adDays.subtasks.filter((item: any)=> item.completed);
  //   let finalDays = days.map((task: any) => task.name);
  //   this.addAssetForm.value.workingDays = finalDays.join(',')
  //   console.log(finalDays.join(','))
  //   this.addAssetForm.value.createdBy = this.user?.UserId
    
  //   if(this.deviceCam == 0 ) {
  //     this.addAssetForm.value.cameraId = this.deviceCam.toString()
  //   } else {
  //     this.addAssetForm.value.cameraId = this.addAssetForm.value.cameraId
  //   }
  //   this.addAssetForm.value.adId = this.inputData?.adId,
  //   this.objectRule == true ? this.addAssetForm.value.objectRule = 2 : this.addAssetForm.value.objectRule = 1
  //   delete this.addAssetForm.value.deviceCam


  //   this.adver.createRule(this.addAssetForm.value).subscribe((res:any)=> {
  //     console.log(res)
  //     this.newItemEvent.emit();
  //     if(res?.statusCode == 200) {
  //       this.alertSer.success(res?.message)
  //     } else {
  //       this.alertSer.error(res?.message)
  //     }
  //   },(error:any)=> {
  //     this.alertSer.error(error?.err?.message)
  //   }
  // )
  // }

  addNewAsset() {
    if(this.addAssetForm.valid) {
      if(this.objectRule == true) {
        let times = this.adTimes.subtasks.filter((item: any)=> item.completed);
        console.log(times)
          let finalTimes = times.map((task: any) => task.name);
          console.log(finalTimes)
          this.addAssetForm.value.adHours = finalTimes.join(',')
      
          let days = this.adDays.subtasks.filter((item: any)=> item.completed);
          let finalDays = days.map((task: any) => task.name);
          this.addAssetForm.value.workingDays = finalDays.join(',')

          this.addAssetForm.value.createdBy = this.user?.UserId
  
          let formValue = this.addAssetForm.value;

          // Combine 'tempFrom' and 'tempTo' into a single 'temp' string
          formValue.temp = `${formValue.tempFrom.toString()}to${formValue.tempTo.toString()}`;
          
          if(this.deviceCam == 0 ) {
            this.addAssetForm.value.cameraId = this.deviceCam.toString()
          } else {
            this.addAssetForm.value.cameraId = this.addAssetForm.value.cameraId
          }
  
          this.addAssetForm.value.objectCount = this.addAssetForm.value.objectCount ? this.addAssetForm.value.objectCount : 1
          this.addAssetForm.value.adId = this.inputData?.adId ? this.inputData?.adId :this.finalId
          this.objectRule == true ? this.addAssetForm.value.objectRule = 2 : this.addAssetForm.value.objectRule = 1
          delete this.addAssetForm.value.deviceCam
          delete this.addAssetForm.value.tempFrom
          delete this.addAssetForm.value.tempTo
      
      
          this.adver.createRule(this.addAssetForm.value).subscribe((res:any)=> {
            console.log(res)
            this.newItemEvent.emit();
            if(res?.statusCode == 200) {
              this.alertSer.success(res?.message)
              this.adver.addIdSub.next(this.inputData?.adId ? this.inputData?.adId :this.finalId)
              this.router.navigate(['/dashboard/new-adver']);
              
            } else {
              this.alertSer.error(res?.message)
            }
            this.listAdsInfo()
          },(error:any)=> {
            this.alertSer.error(error?.err?.message)
          }
        )
      } else {
        let times = this.adTimes.subtasks.filter((item: any)=> item.completed);
          let finalTimes = times.map((task: any) => task.name);
          this.addAssetForm.value.adHours = finalTimes.join(',')
          // console.log(finalTimes.join(','));
      
          let days = this.adDays.subtasks.filter((item: any)=> item.completed);
          let finalDays = days.map((task: any) => task.name);
          this.addAssetForm.value.workingDays = finalDays.join(',')
          // console.log(finalDays.join(','))
          this.addAssetForm.value.createdBy = this.user?.UserId
  
          let formValue = this.addAssetForm.value;
  
          // Combine 'tempFrom' and 'tempTo' into a single 'temp' string
          formValue.temp = `${formValue.tempFrom.toString()}to${formValue.tempTo.toString()}`;
          
          // if(this.deviceCam == 0 ) {
          //   this.addAssetForm.value.cameraId = this.deviceCam.toString()
          // } else {
          //   this.addAssetForm.value.cameraId = this.addAssetForm.value.cameraId
          // }
          // this.addAssetForm.value.adId = this.inputData?.adId,
          
          this.addAssetForm.value.adId = this.inputData?.adId ? this.inputData?.adId :this.finalId
          this.objectRule == true ? this.addAssetForm.value.objectRule = 2 : this.addAssetForm.value.objectRule = 1
          delete this.addAssetForm.value.deviceCam
          delete this.addAssetForm.value.modelObjectTypeId
          delete this.addAssetForm.value.objectCount
          delete this.addAssetForm.value.cameraId
          delete this.addAssetForm.value.tempFrom
          delete this.addAssetForm.value.tempTo
      
      
          this.adver.createRule(this.addAssetForm.value).subscribe((res:any)=> {
            console.log(res)
            this.newItemEvent.emit();
            if(res?.statusCode == 200) {
              this.alertSer.success(res?.message)
              this.adver.addIdSub.next(this.inputData?.adId ? this.inputData?.adId :this.finalId)
              this.router.navigate(['/dashboard/new-adver']);

            } else {
              this.alertSer.error(res?.message)
            }
            this.listAdsInfo()
          },(error:any)=> {
            this.alertSer.error(error?.err?.message)
          }
        )
      }
    }
    

  }

  pending:any =[]
  addedAd:any = []
  activated:any = []
  removed:any = []
  Deactivated:any = []

  showLoader:any
  newlistAdsInfoData:any = [];
  listAdsInfoData:any;
  devices:any

  listAdsInfo() {
    this.adver.listAdsInfo().subscribe((res:any)=> {
      // console.log(res);
      this.siteData = res?.sites;
      this.listAdsInfoData = res.sites.flatMap((item:any)=>item.devices);
      this.devices = this.listAdsInfoData;
      this.newlistAdsInfoData = this.listAdsInfoData.flatMap((item: any) => item.ads);
      this.newlistAdsInfoData = this.newlistAdsInfoData.sort((a:any, b:any)=> a.createdTime > b.createdTime && a.active == 1 ? -1:  a.createdTime < b.createdTime ? 1 : 0);

      for(let item of this.newlistAdsInfoData) {
        if(item.status == 1 || item.status == 2 || item.status == 3) {
          this.pending.push(item)
        } 
        
        // else  if(item.status == 3) {
        //   this.removed.push(item)
        // }
        else  if(item.status == 4) {
          this.activated.push(item)
        }
        else  if(item.status == 5) {
          this.Deactivated.push(item)
        }
      }
    })
  }



}
