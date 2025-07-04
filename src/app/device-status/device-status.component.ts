import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, inject, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/services/alert.service';
import { AssetService } from 'src/services/asset.service';
import { InventoryService } from 'src/services/inventory.service';
import { SiteService } from 'src/services/site.service';
import { StorageService } from 'src/services/storage.service';
import { CreateFormComponent } from '../utilities/create-form/create-form.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-device-status',
  templateUrl: './device-status.component.html',
  styleUrls: ['./device-status.component.css']
})
export class DeviceStatusComponent {

  fields = [
    {
      key: 'siteName',
      label: 'Site Name',
      type: '',
      sort: true
    },
    {
      key: 'unitId',
      label: 'Unit Id',
      type: '',
      sort: true
    },
    {
      key: 'status',
      label: 'Status',
      type: '',
      sort: true
    },
    {
      key: '',
      label: 'Speed Test',
      type: 'a',
      call: (data: any) => {this.openSpeedTestDialog(data)},
      sort: false
    },
    {
      key: '',
      label: 'RTSP',
      type: 'button',
      call: (data: any) => {this.openRtspDialg(data)},
      sort: false
    },
    {
      key: 'actions',
      label: 'Actions',
      actions: ['view'],
      type: 'actions',
      sort: false,
      call: (data: any, type: string) => {
        switch (type) {
          case 'view':
            this.openViewPopup(data);
            break;
          case 'edit':
            this.openEditPopup(data);
            break;
          default:
        }
      }
    }
  ]

  @Output() newItemEvent = new EventEmitter<boolean>();

  showLoader = false;
  constructor(
    private inventorySer: InventoryService,
    private assetSer: AssetService,
    private siteSer: SiteService,
    public dialog: MatDialog,
    public datePipe: DatePipe,
    public alertSer: AlertService,
    private storageSer: StorageService
  ) { }

  ngOnInit(): void {
    // this.getDeviceDetails();
    this.getStatus();
  }

  http = inject(HttpClient);
  speedTestDetail: any;
  @ViewChild('speedtestDialog') speedtestDialog!: TemplateRef<any>;
  openSpeedTestDialog(data: any) {
    this.storageSer.login_loader_sub.next(true);
    this.http.get(data.speedtestUrl).subscribe((res: any) => {
      this.storageSer.login_loader_sub.next(false);
      this.speedTestDetail = res.data;
      this.dialog.open(this.speedtestDialog)
    }, (err: any) => {
        this.storageSer.login_loader_sub.next(false);
        this.alertSer.snackError('Failed!')
    })
  }

  @ViewChild('rtspDialog') rtspDialog!: TemplateRef<any>;
  rtspUrls: any = [];
  openRtspDialg(data: any) {
    this.rtspIndex = -1;
    this.currentItem = data;
    this.rtspUrls = data.rtspUrls
    this.dialog.open(this.rtspDialog, {
      disableClose: true
    });
  }

  rtspIndex!: number;
  currentRTSPURL: any;
  editRTSP(url: any) {
    this.rtspIndex = this.rtspUrls.indexOf(url);
    this.currentRTSPURL = JSON.parse(JSON.stringify(url));
  }

  updateRTSP() {
    let obj = {
      siteId: this.currentItem.siteId,
      cameraId: this.currentRTSPURL.cameraId,
      source: this.currentRTSPURL.source
    }
    this.http.put(this.currentItem.updateLiveUrl + '/support/updateLiveUrls_1_0', obj).subscribe((res) => {
      console.log(res);
      this.getStatus();
    })
  }

  siteId: any;
  deviceId: any
  getDataForDevice: any = [];
  newGetDataForDevice: any = [];
  showLoader1: boolean = false
  getData(item: any) {
    this.showLoader1 = true;
    this.inventorySer.listSensorData(item).subscribe((res: any) => {
      this.showLoader1 = false
      this.getDataForDevice = res;
      this.newGetDataForDevice = this.getDataForDevice;
      // this.getDataForDevice = res.flatMap((item:any)=> item.devices_data);
    })
  }

  // openDialog(): void {
  //   this.getData();
  //   const dialogRef = this.dialog.open(SensorDataComponent,{
  //     width: '100%',
  //     height:'90vh'
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed');
  //   });
  // }

  @ViewChild('sensorDialog') sensorDialog = {} as TemplateRef<any>
  openSensor() {
    this.siteId = this.tableData[0].siteId
    this.getData(this.newTableData[0])
    this.dialog.open(this.sensorDialog);
  }

  /* searches */
  siteSearch: any;
  siteNg: any = 'All';
  searchSites(event: any) {
    this.siteSearch = (event.target as HTMLInputElement).value
  }

  filterSites(site: any) {
    if (site != 'All') {
      this.newTableData = this.tableData.filter((item: any) => item.siteId == site)
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
      if (res?.Status == 'Success') {
        this.tableData = res?.sites?.sort((a: any, b: any) => a.siteId < b.siteId ? -1 : a.siteId > b.siteId ? 1 : 0);
        this.newTableData = this.tableData;
      }
    }, (err: any) => {
      this.showLoader = false;
    });
  }

  searchText: any;
  deviceData: any = [];
  newDeviceData: any = [];
  active: any = [];
  inActive: any = [];
  getDeviceDetails() {
    this.storageSer.table_loader_sub.next(true);
    this.assetSer.getDeviceDetails().subscribe((res: any) => {
      this.storageSer.table_loader_sub.next(false);
      this.deviceData = res.deviceDetails;

    let commonObjects = this.deviceData.filter((obj1: any) => {
      return this.deviceStatusList.some((obj2: any) => {
        return obj2.UnitId == obj1.unitId;
      });
    });

    commonObjects.forEach((commonObj: any) => {
      const foundIndex = this.deviceData?.findIndex((obj: any) => {
        if(obj.unitId == commonObj.unitId) {
          return true
        } else {
          obj.status = 'Offline'
        }
        return false;
      });

      if (foundIndex !== -1) {
        this.deviceData[foundIndex].status = 'Online';
      }
    });
    
      this.newDeviceData = this.deviceData;
    })
  }

  deviceStatusList: any[] = [];
  getStatus() {
    // this.assetSer.getHealth().subscribe((res: any) => {
    //   this.upTime = res.flatMap((item: any) => item.on);
    // })
    this.storageSer.table_loader_sub.next(true);
    this.assetSer.devicesStatus().subscribe((res: any) => {
      this.storageSer.table_loader_sub.next(false);
      this.getDeviceDetails();
      this.deviceStatusList = res;
    })
  }

  getLoaderFromChild(data: boolean) {
    this.showLoader = data;
  }

  getDevicesFromChild(data: any) {
    this.newDeviceData = data;

    this.active = [];
    this.inActive = [];
    for (let item of data) {
      if (item.status == 1) {
        this.active.push(item);
      } else if (item.status == 2) {
        this.inActive.push(item);
      }
    }
  }

  getDevicesFromChild1(data: any) {
    this.newGetDataForDevice = data;
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
    let data = this.storageSer.get('metaData');;
    data?.forEach((item: any) => {
      if (item.type == 2) {
        this.deviceType = item.metadata;
      } else if (item.type == 1) {
        this.deviceMode = item.metadata;
      } else if (item.type == 6) {
        this.workingDay = item.metadata;
      } else if (item.type == 10) {
        this.tempRange = item.metadata;
      } else if (item.type == 13) {
        this.ageRange = item.metadata;
      } else if (item.type == 7) {
        this.modelObjectType = item.metadata;
      } else if (item.type == 18) {
        this.model = item.metadata;
      } else if (item.type == 19) {
        this.modelResolution = item.metadata;
      } else if (item.type == 20) {
        this.softwareVersion = item.metadata;
      } else if (item.type == 21) {
        this.weatherInterval = item.metadata;
      } else if (item.type == 4) {
        this.deviceStatus = item.metadata;
      }
    })
  }

  @ViewChild('rebootDeviceDialog') rebootDeviceDialog = {} as TemplateRef<any>;
  openRebootDevice(item: any) {
    this.currentItem = item;
    this.dialog.open(this.rebootDeviceDialog);
  }

  rebootDevice(id: any) {
    this.alertSer.wait();
    this.assetSer.updateRebootDevice(id).subscribe((res: any) => {
      // console.log(res)
      if (res) {
        this.alertSer.success(res?.message);
      }
    }, (err: any) => {
      if (err) {
        this.alertSer.error(err);
      };
    });
  }


  showAddDevice: boolean = false;
  showDeviceInfo: boolean = false;
  show(type: any) {
    if (type == 'device') { this.showAddDevice = true }
    if (type == 'device-info') { this.showDeviceInfo = true }
  }

  closenow(type: any) {
    if (type == 'device') { this.showAddDevice = false }
    if (type == 'device-info') { this.showDeviceInfo = false }
  }

  @ViewChild('editStatusDialog') editStatusDialog = {} as TemplateRef<any>;
  y: any
  openEditStatus(id: any) {
    this.y = id;
    this.dialog.open(this.editStatusDialog);
  }

  @ViewChild('viewSiteDialog') viewSiteDialog = {} as TemplateRef<any>;
  currentItem: any;
  currentWorkingDays: any;
  openViewPopup(data: any) {
    this.currentItem = data;
    this.dialog.open(CreateFormComponent, {
      data: {
        body: data,
        label: data?.deviceId
      }
    });
    // dialogRef.afterOpened().subscribe(result => {
    //   console.log(`Dialog result: ${result}`);
    // });
    // this.currentWorkingDays = JSON.parse(JSON.stringify(this.currentItem.workingDays.split(',').map((item: any) => +item)));
    // this.dialog.open(this.viewSiteDialog);
  }

  @ViewChild('editSiteDialog') editSiteDialog = {} as TemplateRef<any>;
  openEditPopup(item: any) {
    this.currentItem = item;
    this.currentWorkingDays = JSON.parse(JSON.stringify(this.currentItem.workingDays.split(',').map((item: any) => +item)));
    this.dialog.open(this.editSiteDialog);
  }


  sorted = false;
  sort(label: any) {
    this.sorted = !this.sorted;
    var x = this.newDeviceData;
    if (this.sorted == false) {
      x.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      x.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }

}
