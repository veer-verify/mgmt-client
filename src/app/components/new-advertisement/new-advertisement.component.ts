import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AdvertisementsService } from 'src/services/advertisements.service';
import { AlertService } from 'src/services/alert.service';
import { AssetService } from 'src/services/asset.service';
import { SiteService } from 'src/services/site.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-new-advertisement',
  templateUrl: './new-advertisement.component.html',
  styleUrls: ['./new-advertisement.component.css']
})
export class NewAdvertisementComponent {

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
  ngOnInit() {
    this.user = this.storageSer.get('user');
    this.listAdsInfo();
    // this.listAssets();
    this.adver.itemName.subscribe((res:any)=>{
      this.selectedName = res;
      if(res.siteId) {
        this.siteId = res.siteId;
        this.filter(res);
      }
      if(res.deviceId) {
        this.deviceId = res.deviceId
      }
    });

    this.adver.addIdSub.subscribe((res:any) => {
      this.newAdId = res;
      console.log(res)
    });
  }

  isHighlighted(adId: string): boolean {
    // console.log(adId)
    return this.newAdId === adId;
  }


 searchSite:any
  searchSites(event: any) {
    this.searchSite = (event.target as HTMLInputElement).value;
  }

  searchDevice:any
  searchDevices(event: any) {
    this.searchDevice = (event.target as HTMLInputElement).value;
  }

  // searchSite:any
  // searchSites(event: any) {
  //   this.searchSite = (event.target as HTMLInputElement).value;
  // }

  siteData:any=[]
  showLoader:any
  newlistAdsInfoData:any = [];
  listAdsInfoData:any;

  siteId:any = 'All';
  deviceId:any = "All";
  adName:any = 'All';
  devices:any;
  ticketStatusObj = {
    fromDate: null,
    toDate:null
  }

  filterData:any
  filter(type:any) {
    console.log(type)
    let siteId:any;
    let deviceId:any;
    let adName:any;
    let fromDate: any = this.ticketStatusObj.fromDate;
    let toDate: any = this.ticketStatusObj.toDate; 

    this.siteId == 'All' ? siteId =  null : siteId = this.siteId;
    this.deviceId == 'All'? deviceId = null : deviceId = this.deviceId;
    this.adName == 'All'? adName = null : adName = this.adName;
    

    if(type === "All") {
      this.newlistAdsInfoData = this.listAdsInfoData.flatMap((item: any) => item.ads);
    } else {
      this.adver.listAdsInfo({siteId: siteId ,deviceId:deviceId, adName:adName, fromDate:this.ticketStatusObj.fromDate, toDate:this.ticketStatusObj.toDate}).subscribe((res:any)=> {
        let x = res.sites.flatMap((item: any) => item.devices);
        this.newlistAdsInfoData = x.flatMap((item: any) => item.ads.sort((a:any, b:any)=> a.createdTime > b.createdTime ? -1 :  a.createdTime < b.createdTime ? 1 : 0));
      })
    }
  }


  listDevices(site: any) {
    this.adver.listAdsInfo(site).subscribe((res: any) => {
      this.devices = res.sites.flatMap((item:any)=>item.devices);
    })
  }

  listAdsInfo() {
    this.tableLoader = true;
    this.adver.listAdsInfo().subscribe((res:any)=> {
      // console.log(res);
      this.getMetadata();

      this.tableLoader = false
      this.siteData = res?.sites;
      this.listAdsInfoData = res.sites.flatMap((item:any)=>item.devices);
      this.devices = this.listAdsInfoData;
      this.newlistAdsInfoData = this.listAdsInfoData.flatMap((item: any) => item.ads);
      this.newlistAdsInfoData = this.newlistAdsInfoData.sort((a:any, b:any)=> a.createdTime > b.createdTime ? -1 :  a.createdTime < b.createdTime ? 1 : 0);
    })
  }




  ruleData:any
  @ViewChild('usedItemsDialog') usedItemsDialog = {} as TemplateRef<any>;
  openView(item:any) {
    this.adver.listAdsInfo(item).subscribe((res:any)=> {
      console.log(res);
      let x = res.sites[0].devices[0].ads.flatMap((item: any) => item.rules);
      console.log(x)
      x.forEach((el: any) => {
        if (el && typeof el === 'object' && 'workingDays' in el) {
          if (el.workingDays) {
            el.workingDays = el.workingDays.split(',').map(Number);
          } else {
            el.workingDays = [];
          }
          console.log(el.workingDays);
        }
       
      }
    );
      this.ruleData = x;
      // console.log(this.ruleData)
    })
    this.dialog.open(this.usedItemsDialog)
  }


currentItem:any
  openViewPopup(item:any) {
    // console.log(item)
    this.currentItem = item;
  }

  @ViewChild('editAssetDialog') editAssetDialog = {} as TemplateRef<any>;
  openEditPopupp(item:any) {
    console.log(item)
    this.currentItem = item
    this.dialog.open(this.editAssetDialog);
  }
  
  isStatusChanged: boolean = false;
  
  updateAd() {
    let updateData = {
      adId:this.currentItem.adId,
      modifiedBy:this.user?.UserId,
      fromDate:this.currentItem.fromDate,
      toDate:this.currentItem.toDate,
      status: (this.isStatusChanged && this.currentItem.status == 4) ? 2 :  (this.isStatusChanged && this.currentItem.status == 5) ? 3 : this.currentItem.status
      // status:this.currentItem.status == 4 ? 2 : 3
    }
    this.adver.updateAd(updateData).subscribe((res:any)=> {
      console.log(this.currentItem)
      if(res?.statusCode == 200 ) {
        this.filter(this.currentItem)
        this.alertSer.success(res?.message)
      }
    },(error:any)=> {
      this.alertSer.error(error?.err?.message)
    })
  }

  @ViewChild('deleteAssetDialog') deleteAssetDialog = {} as TemplateRef<any>;
  deleteRow: any;
  openDeletePopup(item: any) {
    this.currentItem = item;
    this.dialog.open(this.deleteAssetDialog);
  }

  confirmDeleteRow() {
    this.adver.deleteAd(this.currentItem).subscribe((res:any)=> {
      // console.log(this.currentItem)
      if(res?.statusCode == 200 ) {
        this.filter(this.currentItem);
        this.alertSer.success(res?.message)
      }
    },(error:any)=> {
      this.alertSer.error(error?.err?.message)
    })
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
      if(item.type == 2) {
        this.deviceType = item.metadata;
      } else if(item.type == 1) {
        this.deviceMode = item.metadata;
      } else if(item.type == 8) {
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

  showAddAsset(type: any , value?:any) {
    console.log(value)
   this.final =  value 
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

  /* Edit Asset Status */
  @ViewChild('editStatusDialog') editStatus = {} as TemplateRef<any>;
  openEditStatus(data: any) {
    this.currentItem = data;
    this.dialog.open(this.editStatus);
  }

  changeAssetStatus() {
    this.assetService.updateAssetStatus(this.currentItem).subscribe((res: any) => {
      this.alertSer.success(res.message);
    }, (err: any) => {
      if(err) {
        this.alertSer.error(err);
      };
    });
  }


  /* add actions */
 

  originalObject: any;
  changedKeys: any[] = [];

  onDateChange(e: any) {
    let x = e.targetElement.name;
    if(!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
    }
  }

  onSelectChange(event: any) {
    let x = event.source.ngControl.name;
    if(!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
    }
  }

  onInputChange(event: any) {
    let x = event.target['name'];
    if(!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
    }
  }

  confirmEditRow() {
    this.originalObject = {
      "id": this.currentItem.id,
      "deviceModeId": this.currentItem.deviceModeId,
      "playOrder": this.currentItem.playOrder,
      "modifiedBy": 1,
      "fromDate": this.currentItem.fromDate,
      "toDate": this.currentItem.toDate,
      "active": this.currentItem.active,
      "status": this.currentItem.status
    };

    this.originalObject.fromDate = this.datepipe.transform(this.currentItem.fromDate, 'yyyy-MM-dd');
    this.originalObject.toDate = this.datepipe.transform(this.currentItem.toDate, 'yyyy-MM-dd');
    this.assetService.modifyAssetForDevice({asset: this.originalObject, updProps: this.changedKeys}).subscribe((res: any) => {
      // console.log(res);
      this.alertSer.success(res?.message);
    }, (err: any) => {
        this.alertSer.wait();
    })
  }



  deleteRow1(item: any, i: any) {
    // console.log(item);
    setTimeout(() => {
      this.newlistAdsInfoData.splice(i, 1);
    }, 1000);
  }

  @ViewChild('addPlayerDialog') addPlayerDialog: any = ElementRef;
  openPlayerDialog(data: any) {
    console.log(data)
    this.currentItem = data;
    this.dialog.open(this.addPlayerDialog);
  }

  sorted = false;
  sort(label: any) {
    this.sorted = !this.sorted;
    var x = this.newlistAdsInfoData;
    if (this.sorted == false) {
      x.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      x.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }

}
