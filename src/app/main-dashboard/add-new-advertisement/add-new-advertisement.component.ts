import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AssetService } from 'src/services/asset.service';
import { AlertService } from 'src/services/alert.service';
import { SiteService } from 'src/services/site.service';
import { MetadataService } from 'src/services/metadata.service';
import { formatDate } from '@angular/common';
import { StorageService } from 'src/services/storage.service';
import { AdvertisementsComponent } from 'src/app/components/advertisements/advertisements.component';
import { AdvertisementsService } from 'src/services/advertisements.service';

@Component({
  selector: 'app-add-new-advertisement',
  templateUrl: './add-new-advertisement.component.html',
  styleUrls: ['./add-new-advertisement.component.css'],
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
export class AddNewAdvertisementComponent {



  constructor(
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



  @Output() newItemEvent = new EventEmitter<any>();
  @Input() newData:any;

  addAssetForm: any = FormGroup;
  searchText: any;
  currentDate = new Date();

  /* Asset Object */
  siteId: any;

  personshow : boolean = false;
  toggleShowOnOff() {
    this.personshow = !this.personshow;
  }


  adFor: any = null;
  enableDemo: boolean = false;

  // deviceIdFromStorage: any;
  user: any;
  ngOnInit(): void {
    this.user = this.storageSer.get('user');
    // this.deviceIdFromStorage = this.storageSer.get('add_body');
    this.addAssetForm = this.fb.group({
      'file': new FormControl('', Validators.required),
      'deviceId': new FormControl(''),
      'adName': new FormControl(''),
      'fromDate': new FormControl(''),
      'toDate': new FormControl(''),
      'remarks': new FormControl(''),
    });

    this.getSitesListForUserName();
    this.onMetadataChange()

    // this.listAdsInfo();
    this.listDeviceInfo()

    
  };

  
  currentDeviceType: any;
  getDeviceType(data: any) {
    // console.log(data)
    this.currentDeviceType = data.deviceTypeId;
  }

  showLoader:boolean = false;
  Active:any= [];
  inactive:any = [];
  newlistDeviceInfoData:any = [];
  listDeviceInfoData:any
  listDeviceInfo() {
    this.showLoader = true;
    this.adver.listDeviceInfo().subscribe((res:any)=> {
      // console.log(res);
      this.showLoader = false
      this.listDeviceInfoData = res?.sites.flatMap((item:any)=>item.Devices)
      this.newlistDeviceInfoData = this.listDeviceInfoData
      // console.log(this.newlistDeviceInfoData);
    })
  }

  /* create Asset */
  addId:any;
  lastSubmittedItemId:any = []
  submit: boolean = false;
  // addNewAsset() {
  //   if(this.addAssetForm.valid) {
  //     this.alertSer.wait();
  //     if(this.newData !== null) {
  //       this.addAssetForm.value.deviceId = this.newData.deviceId
  //     }
  //     this.adver.createAd(this.addAssetForm.value, this.selectedFile).subscribe((res: any) => {
  //       console.log(res);
  //       this.addId = res.adId
  //       this.adver.addIdSub.next(this.addId)
  //       this.newItemEvent.emit(this.addId);
  //       if(res?.statusCode == 200 ) {
  //         this.alertSer.successMessage(res?.message)
  //       } else {
  //         this.alertSer.error(res?.message)
  //       }
  //     },(error:any)=> {
  //       this.alertSer.error(error?.err?.message)
  //     });
  //   }
  // }


  addName:any
  addNewAsset() {
    if(this.addAssetForm.valid) {
      this.alertSer.wait();
      if(this.newData !== null) {
        this.addAssetForm.value.deviceId = this.newData.deviceId
      }
      this.adver.createAd(this.addAssetForm.value, this.selectedFile).subscribe((res: any) => {
        console.log(res);

        this.adver.addIdSub.next(res.adId)
        this.adver.addNameSub.next(res.adName)

        this.newItemEvent.emit(res.adId);

       if(!this.newData) {
        if(res?.statusCode == 200 ) {
          this.alertSer.success(res?.message)
        } else {
          this.alertSer.error(res?.message)
        }
       } else  {
        if(res?.statusCode == 200 ) {
          this.alertSer.successMessage(res?.message)
        } else {
          this.alertSer.error(res?.message)
        }
       }
      },(error:any)=> {
        this.alertSer.error(error?.err?.message)
      } );
    }
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
  isAudio: boolean = false;
  onFileSelected(event: any) {
    console.log(event.target.files)
    let x = event.target.files[0].type;
    
    if(this.currentDeviceType === 1 || this.newData?.deviceTypeId == 1) {
      if(x === 'audio/mpeg' || x === 'video/mp4' || x === 'video/avi' || x == 'audio/wav' || x == 'audio/vnd.dlna.adts') {
        this.isAudio = false
      } else {
        this.isAudio = true;
      }
    } else if(this.currentDeviceType === 2 || this.newData?.deviceTypeId == 2 || this.currentDeviceType === 3 || this.newData?.deviceTypeId == 3) {
      if(x === 'audio/mpeg' || x === 'audio/vnd.dlna.adts') {
        this.isAudio = true
      } else {
        this.isAudio = false;
      }
    } 

    if(typeof(event) == 'object') {
      this.selectedFile = event.target.files[0] ?? null;
    }
  }

  deleteFile() {
    this.isAudio = false
    this.selectedFile = null;
    // this.assetData.file = null;
  }

  closeForm() {
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
  adsTime: any;
  onMetadataChange() {
    let data = this.storageSer.get('metaData');
    data?.forEach((item: any) => {
      if(item.type == 2) {
        this.deviceType = item.metadata;
      } else if(item.type == 1) {
        this.deviceMode = item.metadata;
      } else if(item.type == 6) {
        this.workingDay = item.metadata;
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
      } else if(item.type == 9) {
        this.adsTime = item.metadata;
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

  
  

}
