import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdvertisementsService } from 'src/services/advertisements.service';
import { AlertService } from 'src/services/alert.service';
import { AssetService } from 'src/services/asset.service';
import { MetadataService } from 'src/services/metadata.service';
import { SiteService } from 'src/services/site.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-create-faq',
  templateUrl: './create-faq.component.html',
  styleUrls: ['./create-faq.component.css'],
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
export class CreateFaqComponent {
  
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
  minDate: Date = new Date();
  
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
      'issueCategoryId': new FormControl('',Validators.required),
      'issueSubCategoryId': new FormControl('',Validators.required),
      'issueName': new FormControl('',Validators.required),
      // 'dateOfEffected': new FormControl(''),
      'issueDescription': new FormControl(''),
      'remarks': new FormControl(''),
      'issueAttachment':new FormControl(null),
      'createdBy' : new FormControl('')
    });

    this.getSitesListForUserName();
    this.onMetadataChange();
    this.category();
  };

  
  currentDeviceType: any;
  getDeviceType(data: any) {
    
    this.currentDeviceType = data.deviceTypeId;
  }

  showLoader:boolean = false;
  Active:any= [];
  inactive:any = [];
  newlistDeviceInfoData:any = [];
  listDeviceInfoData:any


  /* create Asset */
  addId:any;
  lastSubmittedItemId:any = []
  submit: boolean = false;
  


  addName:any
  createIssueForFaq() {
     if(this.addAssetForm.valid) {
      // this.alertSer.wait();
      this.showLoader=true;
      this.adver.createIssueForFaq(this.addAssetForm.value, this.selectedFile).subscribe((res: any) => {
        this.newItemEvent.emit();
        if(res?.statusCode == 200 ) {
          this.alertSer.success(res?.message)
          this.showLoader=false;
        } else {
          this.alertSer.error(res?.message)
        }
       
      },(error:any)=> {
        this.alertSer.error(error?.err?.message)
      } );
     }
  }

  newCategoryList:any = []
  categoryList:any = [];
  category() {
    this.adver.category().subscribe((res:any) => {
      console.log(res)
      this.categoryList = res.categoryList
      this.newCategoryList = this.categoryList.flatMap((item:any) => item.subCategoryList)
      console.log(this.newCategoryList)
    })
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

    let x = event.target.files[0];
   
    
    if(x.size <= 5242880){

      if(typeof(event) == 'object') {
        this.selectedFile = x.size <= 5242880 ? x : null;
      }
  
    }
    else{
      
      this.alertSer.error("File Size should be lessthan 5MB")
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


  newDeviceData:any = []
  Category:any ;
  deviceId:any = "";
  adName:any = 'All';
   subcategoryId:any;
   newSiteData: any = []
   
  subCategoryList:any=[]

  openSubcategoryList(item:any) {
    this.subCategoryList = item.subCategoryList
  }

 
  
  

}
