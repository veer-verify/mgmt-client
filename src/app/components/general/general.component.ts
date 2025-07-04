import { DatePipe } from '@angular/common';
import { Component, EventEmitter, HostListener, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { SensorDataComponent } from 'src/app/components/sensor-data/sensor-data.component';
import { AdvertisementsService } from 'src/services/advertisements.service';
import { AlertService } from 'src/services/alert.service';
import { AssetService } from 'src/services/asset.service';
import { InventoryService } from 'src/services/inventory.service';
import { SiteService } from 'src/services/site.service';
import { StorageService } from 'src/services/storage.service';


@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent {
  @Output() newItemEvent = new EventEmitter<boolean>();

  showLoader = false;
  constructor(
    private inventorySer: InventoryService,
    private adver: AdvertisementsService,
    private assetSer: AssetService,
    private siteSer: SiteService,
    public dialog: MatDialog,
    public datePipe: DatePipe,
    public alertSer: AlertService,
    private storageSer: StorageService,
    private router: Router
  ) { }

  user:any;
  ngOnInit(): void {
    this.user = this.storageSer.get('user');
    this.getSitesData()
    // this.listDeviceInfo()

    // this.getSitesListForUserName();
    // this.getStatus();
    // this.listAdsInfo();

    this.alertSer.ruleSubject.subscribe({
      next: (res: any) => {
        if(res) {
          this.show('rule', true)
          this.close('asset')
        }
      }
    })
  }

  devicesForSite:any
  cameraDetails:any=[];
  CentralBoxDetails:any = []

  newgetSitesDataForSite:any = [];
  getSitesDataForSite:any;

  getSitesData() {
    this.showLoader = true;
    this.adver.getSitesData().subscribe((res:any)=> {
      this.showLoader = false;
      this.getMetadata();
      this.getSitesDataForSite = res.siteDetails;
      // this.newdevices = this.getSitesDataForSite
      this.newgetSitesDataForSite = this.getSitesDataForSite
      this.newdevices = this.getSitesDataForSite.flatMap((item:any)=>item.CentralBox);
      // console.log(this.CentralBoxDetails);
    })
  }
  
  newdevices:any
  listDevices(site: any) {
    this.adver.getSitesData(site).subscribe((res: any) => {
      this.newdevices = res.siteDetails.flatMap((item:any)=>item.CentralBox);
    })
  }


@ViewChild('inventoryItemsDialog') inventoryItemsDialog = {} as TemplateRef<any>;
camData:any
viewData:any
  cameraData(item:any) {
    this.adver.getSitesData(item).subscribe((res:any)=> {
      // console.log(item)
      this.camData = res.siteDetails.flatMap((item:any)=>item.CentralBox)
      this.viewData = this.camData.flatMap((item:any)=>item.cameras)
      // console.log(item)
    })
    this.dialog.open(this.inventoryItemsDialog)
  }

  filter(type:any) {
    let siteId:any
    let deviceId:any;
    let timeZone:any;

    this.siteId == 'All' ? siteId = null : siteId = this.siteId;
    this.deviceId == 'All' ? deviceId = null : deviceId = this.deviceId;
    this.timeZone == 'All' ? timeZone = null : timeZone = this.timeZone;
    this.showLoader = true;
      this.adver.getSitesData({siteId:siteId, deviceId:deviceId ,timeZone:timeZone }).subscribe((res:any)=> {
        this.showLoader = false;
        if(res.status === 'Success') {
          this.newgetSitesDataForSite = res.siteDetails
          // this.newgetSitesDataForSite = this.camData.flatMap((item:any)=>item.cameras)
        } else {
          this.newgetSitesDataForSite = []
        }
      })
  }



  devices:any
  sites:any = [];
  Active:any= [];
  inactive:any = [];
  newlistDeviceInfoData:any = [];
  listDeviceInfoData:any
  listDeviceInfo() {
    this.showLoader = true;
    this.adver.listDeviceInfo().subscribe((res:any)=> {
      // console.log(res);
      this.getMetadata();
      this.showLoader = false;
      this.sites = res?.sites
      this.listDeviceInfoData = res?.sites.flatMap((item:any) => item.Devices);
      // this.devices = this.listDeviceInfoData;
      // this.newlistDeviceInfoData = this.listDeviceInfoData.sort((a:any, b:any)=> a.createdTime > b.createdTime && a.active == 1 ? -1:  a.createdTime < b.createdTime ? 1 : 0);
      this.newlistDeviceInfoData = this.listDeviceInfoData.sort((a:any, b:any)=> a.active > b.active ? -1:  a.active < b.active ? 1 : 0);

      // console.log(this.newlistDeviceInfoData)
      this.Active = [];
      this.inactive=[];
      for(let item of this.newlistDeviceInfoData) {
        if(item.active === 1) {
          this.Active.push(item)
        }
        if(item.active === 0) {
          this.inactive.push(item)
        }
      }
    })
  }

  newlistAdsInfoData:any =[]
  listAdsInfoData:any = []
  siteData:any;
  listAdsInfo() {
    this.adver.listAdsInfo().subscribe((res:any)=> {
      // console.log(res);
      this.getMetadata();
      this.siteData = res?.sites;
      this.listAdsInfoData = res.sites.flatMap((item:any)=>item.devices);
      this.devices = this.listAdsInfoData;
      this.newlistAdsInfoData = this.listAdsInfoData.flatMap((item: any) => item.ads);

      // for(let item of this.newlistAdsInfoData) {
      //   if(item.status == 1) {
      //     this.pending.push(item)
      //   } else  if(item.status == 2) {
      //     this.addedAd.push(item)
      //   }
      //   else  if(item.status == 3) {
      //     this.removed.push(item)
      //   }
      //   else  if(item.status == 4) {
      //     this.activated.push(item)
      //   }
      //   else  if(item.status == 5) {
      //     this.Deactivated.push(item)
      //   }
      // }
    })
  }

  openadver(item:any) {
    this.adver.itemName.next(item)
    this.router.navigate(['/dashboard/new-adver'])
  }
  

  

  closenow(){
    this.newItemEvent.emit()
  }
 
  siteId:any = 'All';
  timeZone:any = 'All';
  deviceId: any = "All";
  deviceTypeId:any

  // filter(type:any) {
  //   let siteId:any
  //   let deviceId:any;
  //   this.siteId == 'All' ? siteId = null : siteId = this.siteId;
  //   this.deviceId == 'All' ? deviceId = null : deviceId = this.deviceId;
  

  //   if(type == 'All') {
  //     this.deviceId = 'All'
  //     this.newlistDeviceInfoData = this.listDeviceInfoData
  //   } else {
  //     this.adver.listDeviceInfo({siteId:siteId, deviceId:deviceId, deviceTypeId:  this.deviceTypeId}).subscribe((res:any)=> {
  //       if(res.statusCode === 200) {
  //         this.newlistDeviceInfoData = res?.sites.flatMap((item:any)=>item.Devices)
  //       } else {
  //         this.newlistDeviceInfoData = []
  //       }
  //     })
  //   }
  // }

  cameras: any = [];
  getCamerasForSiteId() {
    console.log(this.currentItem)
    this.siteSer.getCamerasForSiteId(this.currentItem).subscribe((res: any) => {
      // console.log(res);
      this.cameras = res;
    })
  }

  @ViewChild('viewSiteDialog') viewSiteDialog = {} as TemplateRef<any>;
  openViewPopup(item:any) {
    this.currentItem = item;
    this.dialog.open(this.viewSiteDialog)
  }

  
  @ViewChild('editSiteDialog') editSiteDialog = {} as TemplateRef<any>;
  openEditPopup(item: any) {
    this.cameraType = item.cameraId === '0' ? 0 : 1;
    // item.cameraId == "0" ? this.cameraType == 0 : this.cameraType = 1
    // item.cameraId !== null ? this.cameraType = 1 : this.cameraType = 0;
    item.modifiedBy = this.user?.UserId
    this.currentItem = JSON.parse(JSON.stringify(item));
    // console.log(this.currentItem)
    this.getCamerasForSiteId()
    this.dialog.open(this.editSiteDialog);
  }

  cameraType: any ;
  currentItem: any;

  getCurrentCamera(item:any) {
    this.currentItem.cameraId = item.cameraId
    this.currentItem.cameraName = item.name
    this.currentItem.cameraUrl = item.rtspUrl
  }

  updateDeviceDtl() {
    delete this.currentItem.modelObjectTypeId
    delete this.currentItem.cameraName
    delete this.currentItem.cameraUrl
    delete this.currentItem.siteName
    delete this.currentItem.deviceTypeId
    if(this.cameraType === 0 ) {
      this.currentItem.cameraId = '0'

    }
    
    this.adver.updateDeviceInfo(this.currentItem).subscribe((res:any)=> {
      // console.log(res);
      if(res?.statusCode == 200) {
        this.alertSer.success(res?.message)
      } else {
        this.alertSer.error(res?.message)
      }
      this.listDeviceInfo();
    },(error:any)=> {
      this.alertSer.error(error?.err?.message)
    })
  }

  @ViewChild('deleteSiteDialog') deleteSiteDialog = {} as TemplateRef<any>;
  DeletePopup(item:any) {
    this.currentItem = item
    this.dialog.open(this.deleteSiteDialog);
    
  }

  deleteDevice() {
    this.adver.deleteDevice(this.currentItem).subscribe((res:any)=> {
      // console.log(res);
      if(res.statusCode == 200) {
        this.alertSer.success(res?.message)
      }
      this.listDeviceInfo()
    },(error:any)=> {
      this.alertSer.error(error?.err?.message)
    })
  }

  showMore:boolean = false;
  showMore1:boolean = false;
  openMore(type:any) {
    if(type == 'more') {
      this.showMore = true
    }
    
  }

  openMore1(type:any) {
    if(type == 'more') {
      this.showMore1 = true
    }
    
  }

  @ViewChild('rebootDeviceDialog') rebootDeviceDialog = {} as TemplateRef<any>;
  openRebootDevice(item: any) {
    this.currentItem = item;
    this.dialog.open(this.rebootDeviceDialog);
  }

  rebootDevice(id: any) {
    this.alertSer.wait();
    this.adver.updateRebootDevice(id).subscribe((res: any) => {
      // console.log(res)
      if(res) {
        this.alertSer.success(res?.message);
      }
    }, (err: any) => {
      if(err) {
        this.alertSer.error(err);
      };
    });
  }


  openView:boolean = false;
  openAdver(type:any) {
    if(type == 'view') {
      this.openView = true;
    }
  }




   /* searches */
    siteSearch: any;
    siteNg: any = 'All'
    searchSites(event: any) {
    this.siteSearch = (event.target as HTMLInputElement).value
    }

    filterSites(site: any) {
    if(site != 'All') {
      this.newTableData =  this.tableData.filter((item: any) => item.siteId == site)
    } else {
      this.newTableData = this.tableData;
    }
  }

  tableData: any = [];
  newTableData: any = [];

  getSitesListForUserName() {
    this.showLoader = true;
    this.siteSer.getSitesListForUserName().subscribe((res: any) => {
      // console.log(res);
      this.showLoader = false;
      if(res?.Status == 'Success') {
        this.tableData = res?.sites?.sort((a: any, b: any) => a.siteId < b.siteId ? -1 : a.siteId > b.siteId ? 1 : 0);
        this.newTableData = this.tableData;
      }
      }, (err: any) => {
        this.showLoader = false;
    });
  }

  searchText: any;
 

  upTime: any;
  getStatus() {
    this.assetSer.getHealth().subscribe((res: any) => {
      this.upTime = res.flatMap((item: any) => item.on);
      // console.log(this.upTime[0]?.firstConnected.this.da - this.upTime[0]?.lastConnected)
    })
  }

  getLoaderFromChild(data: boolean) {
    this.showLoader = data;
  }

  getDevicesFromChild(data: any) {
    this.newlistDeviceInfoData = data;

   
  }

  getDevicesFromChild1(data: any) {
    // this.newGetDataForDevice = data;
    // console.log(data)
  }

  getSearchFromChild(data: any) {
    this.searchText = data;
  }

  /* metadata */
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
  getMetadata() {
    let data = this.storageSer.get('metaData');
    data?.forEach((item: any) => {
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
        // console.log(this.deviceStatus)
      }
    })
  }



  deviceSiteId:any
  data:any
  showAddDevice: boolean = false;
  showDeviceInfo: boolean = false;
  addRule: boolean = false;
  show(type: any, value:any) {

    this.data = value;
    if(type == 'asset') {
       this.showAddDevice = true 
      }
    if(type == 'device') {
       this.showDeviceInfo = true 
      }
    if(type == 'rule') {
      this.addRule = true 
    }
  }

  sendSite(site: any) {
    this.adver.ruleForDevice.next(site);
  }

  close(type: any) {
    if(type == 'asset') {
      this.showAddDevice = false
    }
    if(type == 'device') {
      this.showDeviceInfo = false
    }
    if(type == 'rule') {
      this.addRule = false
    }
  }

  @ViewChild('editStatusDialog') editStatusDialog = {} as TemplateRef<any>;
  y: any
  openEditStatus(id: any) {
    this.y = id;
    this.dialog.open(this.editStatusDialog);
  }

  
  currentWorkingDays: any;
  // @ViewChild('viewSiteDialog') viewSiteDialog = {} as TemplateRef<any>;
  // openViewPopup(item: any) {
  //   this.currentItem = item;
  //   this.currentWorkingDays = JSON.parse(JSON.stringify(this.currentItem.workingDays.split(',').map((item: any) => +item)));
  //   this.dialog.open(this.viewSiteDialog);
  // }



  sorted = false;
  sort(label: any) {
    this.sorted = !this.sorted;
    var x = this.newlistDeviceInfoData;
    if (this.sorted == false) {
      x.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      x.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }


 
  deviceSearch: any;
  searchDevices(event: any) {
    this.deviceSearch = (event.target as HTMLInputElement).value;
  }
  

  deviceTypeSearch: any;
  searchTypeDevices(event: any) {
    this.deviceTypeSearch = (event.target as HTMLInputElement).value;
  }

  // searchTableData() {
  //   this.searchFromChild.emit(this.searchText);
  // }

}
