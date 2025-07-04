import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/services/alert.service';
import { AssetService } from 'src/services/asset.service';
import { SiteService } from 'src/services/site.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-advertisements',
  templateUrl: './advertisements.component.html',
  styleUrls: ['./advertisements.component.css']
})
export class AdvertisementsComponent implements OnInit {

  constructor(
    private assetService: AssetService,
    private siteSer: SiteService,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    public alertSer: AlertService,
    private storageSer: StorageService
  ) { }

  searchText!: string;
  tableLoader: boolean = false;
  user: any;
  ngOnInit() {
    this.user = this.storageSer.get('user');
    this.listAssets();
  }

  advertisements: any = [];
  newAdvertisements: any = [];
  pending: any = [];
  added: any = [];
  sycedAfterAddition: any = [];
  sycedAfterRemoval: any = [];
  removed: any = [];
  listAssets() {
    this.tableLoader = true;
    this.assetService.listAssets().subscribe((res: any) => {
      this.tableLoader = false;
      this.getMetadata();
      let x = res.flatMap((item: any) => item.assets);
      this.advertisements = x.sort((a: any, b: any) => a.deviceModeId > b.deviceModeId ? -1 : a.deviceModeId < b.deviceModeId ? 1 : 0);;
      this.newAdvertisements = this.advertisements;

      this.pending = [];
      this.added = [];
      this.sycedAfterAddition = [];
      this.sycedAfterRemoval = [];
      this.removed = [];
      for(let item of this.newAdvertisements) {
        if(item.status == 1) {
          this.pending.push(item);
        } else if(item.status == 2) {
          this.added.push(item);
        } else if(item.status == 4) {
          this.sycedAfterAddition.push(item);
        } else if(item.status == 5) {
          this.sycedAfterRemoval.push(item);
        } else if(item.status == 3) {
          this.removed.push(item);
        }
      }
    })
  }

  getLoaderFromChild(data: boolean) {
    this.tableLoader = data;
  }

  getAdsFromChild(data: any) {
    this.newAdvertisements = data;
    
    this.pending = [];
    this.added = [];
    this.sycedAfterAddition = [];
    this.sycedAfterRemoval = [];
    this.removed = [];
    for(let item of data) {
      if(item.status == 1) {
        this.pending.push(item);
      } else if(item.status == 2) {
        this.added.push(item);
      } else if(item.status == 4) {
        this.sycedAfterAddition.push(item);
      } else if(item.status == 5) {
        this.sycedAfterRemoval.push(item);
      } else if(item.status == 3) {
        this.removed.push(item);
      }
    }
  }

  getSearchFromChild(data: any) {
    this.searchText = data;
  }

  deviceType: any;
  deviceMode: any;
  addStatus: any;
  getMetadata() {
    let data = this.storageSer.get('metaData');
    data?.forEach((item: any) => {
      if(item.type == 2) {
        this.deviceType = item.metadata;
      } else if(item.type == 1) {
        this.deviceMode = item.metadata;
      } else if(item.type == 8) {
        this.addStatus = item.metadata;
      }
    });
  }

  showAsset: boolean = false;
  showAddAsset(type: any) {
    if (type == 'asset') {
      this.showAsset = true;
    }
  }

  closenow(type: String) {
    if (type == 'asset') {
      this.showAsset = false;
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
      this.listAssets();
      this.alertSer.success(res.message);
    }, (err: any) => {
      if(err) {
        this.alertSer.error(err);
      };
    });
  }


  /* add actions */
  @ViewChild('editAssetDialog') editAssetDialog = {} as TemplateRef<any>;
  openEditPopupp(item: any) {
    this.currentItem = JSON.parse(JSON.stringify(item));
    this.dialog.open(this.editAssetDialog);
  }

  originalObject: any;
  changedKeys: any[] = [];
  currentItem: any;
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

  @ViewChild('deleteAssetDialog') deleteAssetDialog = {} as TemplateRef<any>;
  deleteRow: any;
  openDeletePopup(item: any) {
    this.currentItem = item;
    this.dialog.open(this.deleteAssetDialog);
  }

  deleteRow1(item: any, i: any) {
    // console.log(item);
    setTimeout(() => {
      this.advertisements.splice(i, 1);
    }, 1000);
  }

  confirmDeleteRow() {
    // console.log(this.currentItem);
    // this.assetTable = this.assetTable.filter((item: any) => item.siteId !== this.currentItem.siteId);
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
    var x = this.newAdvertisements;
    if (this.sorted == false) {
      x.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      x.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }

}
