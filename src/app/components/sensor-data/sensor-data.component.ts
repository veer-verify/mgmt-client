import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AdvertisementsService } from 'src/services/advertisements.service';
import { AlertService } from 'src/services/alert.service';
import { AssetService } from 'src/services/asset.service';
import { InventoryService } from 'src/services/inventory.service';
import { SiteService } from 'src/services/site.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-sensor-data',
  templateUrl: './sensor-data.component.html',
  styleUrls: ['./sensor-data.component.css']
})
export class SensorDataComponent {


  @Output() newItemEvent = new EventEmitter<boolean>()
  
  constructor(
    private assetService: AssetService,
    private siteSer: SiteService,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    public alertSer: AlertService,
    private storageSer: StorageService,
    private adver:AdvertisementsService
  ) { }

  searchText!: string;
  tableLoader: boolean = false;
  user: any;
  selectedName:any
  newAdId: string | null = null;
  interval: any;
  ngOnInit() {
    this.user = this.storageSer.get('user');
    this.listSensorDeviceDetails();
    this.interval = setInterval(() => {
      this.changeColor();
    }, 1000);
  }
  colors: string[] = ['#084982', '#D34135'];
  currentColorIndex: number = 0;
  changeColor(): void {
    // Cycle through the colors
    this.currentColorIndex = (this.currentColorIndex + 1) % this.colors.length;
  }

  siteData:any=[]
  showLoader:any
  newlistAdsInfoData:any = [];
  listAdsInfoData:any;
  siteId:any = 'All';
  deviceId:any = "All";
  zoneId:any = 'All';
  sensorDeviceId:any = 'All';
  filterData:any;

  filter(type:any) {
    // let siteId:any;
    // let zoneId:any;
    // let sensorDeviceId:any;
    // this.siteId == 'All' ? siteId =  null : siteId = this.siteId;
    // this.zoneId == 'All'? zoneId = null : zoneId = this.zoneId;
    // this.sensorDeviceId == 'All'? sensorDeviceId = null : sensorDeviceId = this.sensorDeviceId;
    if(this.siteId == 'All') {
      this.zones = [];
      this.sensorDevicesData = [];
    }

    // if(type == "All") {
    //   this.newSiteData = this.siteData;
    // } else {
    if(this.siteId !== 'All') {
      this.listSensorDevices({siteId: this.siteId, zoneId: this.zoneId});
      this.listZonesForSiteId({siteId: this.siteId})
    }
    // console.log(this.sensorDeviceId)
      
      this.adver.listSensorDeviceDetails({siteId: this.siteId ,zoneId: this.zoneId, sensorDeviceId: this.sensorDeviceId}).subscribe((res:any)=> {

        this.newSiteData = res.data;
      })
    // }
  }
  


     /* searches */
    siteSearch: any;
    searchSites(event: any) {
      this.siteSearch = (event.target as HTMLInputElement).value
    }
    siteSearch1: any;
    searchSites1(event: any) {
      this.siteSearch1 = (event.target as HTMLInputElement).value
    }
    

  zones: any = [];
  listZonesForSiteId(data: any) {
    this.adver.listZonesForSiteId(data).subscribe((res: any) => {
      this.zones = res.zonesList;
    })
  }

  advertisements: any = [];
  newAdvertisements: any = [];
  deviceData:any = []
  newDeviceData:any = []
  approachData: any =[]
  commentData: any = []
  commentDataArray:any=[]
  approachDataArray:any=[]
  newSiteData: any = []
  pending:any = []
  added:any = []

  listSensorDeviceDetails() {
    this.tableLoader = true;
    this.adver.listSensorDeviceDetails().subscribe((res:any)=> {
      // console.log(res)
      this.tableLoader = false
      if(res.statusCode === 200) {
        this.getMetadata();
        this.getSitesListForUserName()
        this.siteData = res.data;
        this.newSiteData = this.siteData;
  
        this.pending = [];
        this.added = [];
      
        for(let item of this.newSiteData) {
          if(item.lightStatus == 1) {
            this.pending.push(item);
          } else if(item.lightStatus == 0) {
            this.added.push(item);
          } 
        }
      } else {
        this.newSiteData = []
      }
    })
  }

  siteDataForUser: any = [];
  getSitesListForUserName() {
    this.siteSer.getSitesListForUserName().subscribe((res: any) => {
      if(res?.Status == 'Success') {
        this.siteDataForUser = res.sites?.sort((a: any, b: any) => a.siteId < b.siteId ? -1 : a.siteId > b.siteId ? 1 : 0);
        // console.log(this.siteDataForUser)
      }
    });
  }

  sensorDevices:any = []
  sensorDevicesData:any = [];
  listSensorDevices(data:any) {
    // console.log(data)
    this.adver.listSensorDevices(data).subscribe((res:any)=> {
      this.sensorDevicesData = res.sensorDeviceIds
      // console.log(this.sensorDevicesData)
    })
  }

currentItem:any
currentcomment1:any = []
  @ViewChild('viewitemsDialog') viewitemsDialog = {} as TemplateRef<any>;
  openViewPopup(item:any) {
    // console.log(item)
    this.currentcomment1 = item;
    this.dialog.open(this.viewitemsDialog); 
  }

  listZonesForSiteIdData:any = [];
  @ViewChild('editAssetDialog') editAssetDialog = {} as TemplateRef<any>;
  openEditPopupp(item:any) {
    // console.log(item)
    this.currentItem = item
      this.adver.listZonesForSiteId(item).subscribe((res:any) => {
        // console.log(res)
        this.listZonesForSiteIdData = res.zonesList
        this.dialog.open(this.editAssetDialog);
      })
    
  }


  updateAd() {
    let updateData = {
      siteId :this.currentItem.siteId ,
      updatedBy:this.user?.UserId,
      sensorDeviceId:this.currentItem.sensorDeviceId,
      zoneId:this.currentItem.zoneId,
      sensorName: this.currentItem.sensorName,
      remarks:this.currentItem.remarks,
    }
    this.adver.updateSensorDevice(updateData).subscribe((res:any)=> {
      if(res?.statusCode == 200 ) {
        // this.filter(this.currentItem)
        this.alertSer.success(res?.message)
        this.listSensorDeviceDetails()
      }
    },(error:any)=> {
      this.alertSer.error(error?.err?.message)
    })
  }

  @ViewChild('deleteAssetDialog') deleteAssetDialog = {} as TemplateRef<any>;
  deleteRow: any;
  openDeletePopup(item: any) {
    // console.log(item)
    this.currentItem = item;
    this.dialog.open(this.deleteAssetDialog);
  }

  confirmDeleteRow() {
    this.adver.unmapSensorDevice(this.currentItem).subscribe((res:any)=> {
      if(res?.statusCode == 200 ) {
        // this.filter(this.currentItem);
        this.alertSer.success(res?.message)
        this. listSensorDeviceDetails()
      }
    },(error:any)=> {
      this.alertSer.error(error?.err?.message)
    })
  }
  
  /* file upload */
  selectedFile: any;
  // selectedFiles: any = [];

  onFileSelected(event: any) {
    // console.log(event.target.files)
    let x = event.target.files[0].type;
    if(typeof(event) == 'object') {
      this.selectedFile = event.target.files[0] ?? null;
    }
  }

  getLoaderFromChild(data: boolean) {
    this.tableLoader = data;
  }

  getAdsFromChild(data: any) {
    this.newlistAdsInfoData = data;
  }

  getSearchFromChild(data: any) {
    this.searchText = data;
  }

  deviceType: any;
  deviceMode: any;
  addStatus: any;
  workingDays: any;
  model_object_type:any
  getMetadata() {
    let data = this.storageSer.get('metaData');
    // console.log(data)
    data?.forEach((item: any) => {
      if(item.type == 84) {
        this.deviceType = item.metadata;
      } else if(item.type == 1) {
        this.deviceMode = item.metadata;
      } else if(item.type == 111) {
        this.addStatus = item.metadata;
      } else if(item.type == 6) {
        this.workingDays = item.metadata;
      }
      else if(item.type == 7) {
        this.model_object_type = item.metadata;
      }
    });
  }

  addRule:boolean = false;
  final:any
  showAsset: boolean = false;

  showAddAsset(type: any) {
    if (type == 'asset') {
      this.showAsset = true;
    }
    if (type == 'rule') {
      this.addRule = true;
    }
  }

  lastSubmittedItemId:any
  closenow(type: String) {
    if (type == 'asset') {
      this.showAsset = false;
    }
    if (type == 'rule') {
      this.addRule = false;
    }
  }

  sorted = false;
  sort(label: any) {
    this.sorted = !this.sorted;
    var x = this.newSiteData;
    if (this.sorted == false) {
      x.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      x.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }

  sorted1 = false;
  sort1(label: any) {
    this.sorted1 = !this.sorted1;
    var x = this.newSiteData;
    if (this.sorted1 == false) {
      x.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      x.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }
}
