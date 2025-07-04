import { DatePipe } from '@angular/common';
import { Component, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/services/alert.service';
import { InventoryService } from 'src/services/inventory.service';
import { MetadataService } from 'src/services/metadata.service';
import { StorageService } from 'src/services/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {


  constructor(
    private inventorySer: InventoryService,
    private metadataSer: MetadataService,
    public dialog: MatDialog,
    public datepipe: DatePipe,
    public alertSer: AlertService,
    private storageSer: StorageService
    ) { }

    user: any;
    notFr = false;
    ngOnInit(): void {
      this.user = this.storageSer.get('user');
      this.listInventory();
    }


  showLoader = false;
  searchText: any;
  searchTx: any;
  inventoryTable: any = [];
  newInventoryTable: any = [];

  inStock: any;
  dispatched: any;
  installed: any;
  purchases: any;
  others: any;
  errInfo: any = null;
  listInventory() {
    this.showLoader = true;
    this.inventorySer.listInventory().subscribe((res: any) => {
      // console.log(res);
      this.showLoader = false;
      if(res) {
        this.inventoryTable = res;
        this.newInventoryTable = this.inventoryTable;
        
        this.inStock = this.newInventoryTable.reduce((sum: any, current: any) => sum + current.inStock, 0);
        this.dispatched = this.newInventoryTable.reduce((sum: any, current: any) => sum + current.dispatched, 0);
        this.installed = this.newInventoryTable.reduce((sum: any, current: any) => sum + current.used, 0);
        this.purchases = this.newInventoryTable.reduce((sum: any, current: any) => sum + current.purchases, 0);
        this.others = this.newInventoryTable.reduce((sum: any, current: any) => sum + current.others, 0);
        this.getMetadata();
      } else {
        this.errInfo = 'No Data';
      }

      // for(let item of this.inventoryTable) {
      //   if(item.inventoryStatusId == 1) {
      //     this.inStock.push(item);
      //   } else if(item.inventoryStatusId == 2) {
      //     this.installed.push(item);
      //   } else if(item.inventoryStatusId == 3) {
      //     this.removed.push(item);
      //   } else if(item.inventoryStatusId == 4) {
      //     this.returned.push(item);
      //   } else if(item.inventoryStatusId == 5) {
      //     this.scrap.push(item);
      //   } else if(item.inventoryStatusId == 6) {
      //     this.redyToUse.push(item);
      //   }
      // }
    }, (err) => {
      // console.log(err);
      this.showLoader = false;
      this.errInfo = err.error.error;
    });
  }

  warrDetail: any
  getWarranty(id: any) {
    this.inventorySer.getWarranty(id).subscribe((res: any) => {
      // console.log(res);
      this.warrDetail = res;

    })
  }

  usedItems: any = [];
  @ViewChild('usedItemsDialog') usedItemsDialog = {} as TemplateRef<any>;
  listDetails(data: any) {
    this.dialog.open(this.usedItemsDialog);

    this.inventorySer.listDetails(data).subscribe((res: any) => {
      // console.log(res);
      this.usedItems = res;
    })
  }

  statusItems: any;
  currentStatusItem: any;
  @ViewChild('statusItemsDialog') statusItemsDialog = {} as TemplateRef<any>;
  openStatusItems(data: any, type: any) {
    this.currentStatusItem = data;
    // console.log(this.currentStatusItem)
    this.dialog.open(this.statusItemsDialog);

    this.inventorySer.listDetailsByStatus(data).subscribe((res: any) => {
      // console.log(res);
      this.statusItems = res;
    })
  }

  /* metadata methods */
  inventoryStatus: any;
  getMetadata() {
    let data = this.storageSer.get('metaData');
    for(let item of data) {
      if(item.type == 'Inventory_Status') {
        this.inventoryStatus = item.metadata;
      }
    }
  }

  filterBody = {
    // prName: null,
    // prStatus: null,
    startDate: null,
    endDate: null,
  }

  applyFilter() {
    this.inventorySer.filterInventory(this.filterBody).subscribe((res: any) => {
      // console.log(res);
      this.newInventoryTable = res;
    })
  }

  currentid = 0;
  closeDot(e: any, i: any) {
    this.currentid = i;
    var x = e.target.parentNode.nextElementSibling;
    if (x.style.display == 'none') {
      x.style.display = 'block';
    } else {
      x.style.display = 'none';
    }
  }

  showInventory: boolean = false;
  showDcInventory: boolean = false;
  closenow(type: String) {
    if (type == 'inventory') {
      this.showInventory = false;
      }
      if(type == 'showDcInventory') {
        this.showDcInventory = false
      }
  }

  show(type: string) {
    if (type == 'inventory') {
      this.showInventory = true;
    }
    if(type == 'showDcInventory') {
        this.showDcInventory = true;
    }
  }

  // items:any;
  // @ViewChild('viewDcDialog') viewDcDialog = {} as TemplateRef<any>
  // openDc1() {
  //   this.dialog.open(this.viewDcDialog);
  //   this.inventorySer.getlistByCreatedBy(1565).subscribe((res:any)=>{
  //     // console.log(res);
  //     this.items = res;
  //       this.duplicateDc = this.items.reduce((acc: any, current: any) => {
  //         const x = acc.find((item: any) => item.dcNumber == current.dcNumber);
  //         if (!x) {
  //           return acc.concat([current]);
  //         } else {
  //           return acc;
  //         }
  //       }, []);
  //   })
  // }


  // @ViewChild('dcStatusDialog') dcStatusDialog = {} as TemplateRef<any>
  addressid = 0;
  addressView(e: any, i: any) {
    this.addressid = i;
    var x = e.target.nextElementSibling;
    // console.log("AddressView:: ",x)
    if (x.style.display == 'none') {
      x.style.display = 'flex';
    } else {
      x.style.display = 'none';
    }
  }


  selectedAll: any;

  selectAll() {
    for (var i = 0; i < this.inventoryTable.length; i++) {
      this.inventoryTable[i].selected = this.selectedAll;
    }
  }

  checkIfAllSelected() {
    this.selectedAll = this.inventoryTable.every(function (item: any) {
      return item.selected == true;
    })
  }

  @ViewChild('editStatusDialog') editStatus = {} as TemplateRef<any>;

  currentStatusId: any
  openEditStatus(id: any) {
    this.dialog.open(this.editStatus);
    this.currentStatusId = id;
    // console.log(id);
  }

  statusObj = {
    statusId: null,
    slNo: null,
    modifiedBy: 1,
  }

  updateInventoryStatus() {
    // this.alertSer.wait();
    this.statusObj.slNo = this.currentStatusId?.slNo;

    this.inventorySer.updateInventoryStatus(this.statusObj).subscribe((res: any) => {
      // console.log(res);
      if(res) {
        this.alertSer.success(res?.message);
        this.listInventory();
      }
    }, (err: any) => {
      if(err) {
        this.alertSer.error(err);
      };
    });
  }


  currentItem: any;
  originalObject: any;
  changedKeys: any = [];

  /* view warranty */
  @ViewChild('viewWarrantyDialog') viewWarrantyDialog = {} as TemplateRef<any>;

  viewWarrantyPopup() {
    this.dialog.open(this.viewWarrantyDialog);
  }


  /* view inventory */
  @ViewChild('viewInventoryDialog') viewInventoryDialog = {} as TemplateRef<any>;

  openViewPopup(item: any) {
    this.currentItem = item;
    this.dialog.open(this.viewInventoryDialog);
    // console.log(this.currentItem);
  }


  /* update inventory */
  @ViewChild('editInventoryDialog') editInventoryDialog = {} as TemplateRef<any>;

  openEditPopup(item: any) {
    this.currentItem = JSON.parse(JSON.stringify(item));
    this.dialog.open(this.editInventoryDialog, { maxWidth: '550px', maxHeight: '550px'});
    // console.log(item);
  }

  onInputChange(e: any) {
    this.originalObject = {
      "id": this.currentItem.id,
      "serialNo": this.currentItem.serialNo,
      "cost": this.currentItem.cost,
      "price": this.currentItem.price,
      "modifiedBy": 1,
      "modifiedTime": null,
      "statusId": this.currentItem.statusId,
      "remarks": this.currentItem.remarks
    };

    let x = e.target['name'];

    if(!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
    }
  }

  onSelectChange(e: any) {
    this.originalObject = {
      "id": this.currentItem.id,
      "serialNo": this.currentItem.serialNo,
      "cost": this.currentItem.cost,
      "price": this.currentItem.price,
      "modifiedBy": 1,
      "modifiedTime": null,
      "statusId": this.currentItem.statusId,
      "remarks": this.currentItem.remarks
    };

    let x = e.source.ngControl.name;

    if(!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
    }
  }

  updateInventory() {
    this.originalObject = {
      "id": this.currentItem.id,
      "serialNo": this.currentItem.serialNo,
      "cost": this.currentItem.cost,
      "price": this.currentItem.price,
      "modifiedBy": 1,
      "modifiedTime": null,
      "statusId": this.currentItem.statusId,
      "remarks": this.currentItem.remarks
    }

    this.inventorySer.updateInventory({inventory: this.originalObject, updProps: this.changedKeys}).subscribe((res: any) => {
      // console.log(res);
        this.alertSer.success(res?.message);
        this.listInventory();
    }, (err: any) => {
      if(err) {
        this.alertSer.error(err);
      };
    });
  }


  @ViewChild('deleteInventoryDialog') deleteInventoryDialog = {} as TemplateRef<any>;

  openDeletePopup(item: any) {
    this.currentItem = item;
    this.dialog.open(this.deleteInventoryDialog);
    // console.log("Selected Item:: ", item);
  }

  deleteInventory() {
    this.alertSer.wait();

    this.inventorySer.deleteInventory(this.currentItem).subscribe((res: any) => {
      // console.log(res);
      if(res) {
        this.alertSer.success(res?.message);
        this.listInventory();
      }
    }, (err: any) => {
      if(err) {
        this.alertSer.error(err);
      };
    });
  }


  /* update warranty */
  @ViewChild('editWarrantyDialog') editWarrantyDialog = {} as TemplateRef<any>;
  openWarrantyPopup(item: any) {
    this.dialog.open(this.editWarrantyDialog);

    this.inventorySer.getWarranty(item.id).subscribe((res: any) => {
      this.currentItem = res;
    })
  }

  onInputChangeW(event: any) {
    this.originalObject = {
      "id": this.currentItem.id,
      "cost": this.currentItem.cost,
      "startDate": this.currentItem.startDate,
      "endDate": this.currentItem.endDate,
      "modifiedBy":  1,
      "remarks": this.currentItem.remarks
    };

    let x = event.target['name'];

    if(!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
    }
  }

  onDateChangeW(e: any) {
    this.originalObject = {
      "id": this.currentItem.id,
      "cost": this.currentItem.cost,
      "startDate": this.currentItem.startDate,
      "endDate": this.currentItem.endDate,
      "modifiedBy":  1,
      "remarks": this.currentItem.remarks
    };

    let x = e.targetElement.name;

    if(!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
    }
  }

  editWarranty() {
    this.originalObject = {
      "id": this.currentItem.id,
      "cost": this.currentItem.cost,
      "startDate": this.currentItem.startDate,
      "endDate": this.currentItem.endDate,
      "modifiedBy":  1,
      "remarks": this.currentItem.remarks
    }

    this.inventorySer.updateWarranty({warranty: this.originalObject, updProps: this.changedKeys}).subscribe((res: any) => {
      this.alertSer.success(res?.message);
      this.getWarranty(this.currentItem.id)
    }, (err: any) => {
      if(err) {
        this.alertSer.error(err);
      };
    });
  }

  @ViewChild('inventoryItemsDialog') inventoryItemsDialog = {} as TemplateRef<any>;

  inventoryItems: any = [];
  openDetailsDialog(item: any) {
    this.dialog.open(this.inventoryItemsDialog);

    this.inventorySer.listInventoryByItemCode(item).subscribe((res: any) => {
      this.inventoryItems = res;
    })
  }


  sorted = false;
  sort(label: any) {
    this.sorted = !this.sorted;
    var x = this.inventoryTable;
    var y = this.inventoryItems;

    if (this.sorted == false) {
      x.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
      y.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      x.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
      y.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }

  sort1(label: any) {
    this.sorted = !this.sorted;
    var y = this.inventoryItems;

    if (this.sorted == false) {
      y.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      y.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }


  // sortTable(label: any) {
  //   this.sorted = !this.sorted;
  //   var x = this.inventoryItems;
  //   if (this.sorted == false) {
  //     x.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
  //   } else {
  //     x.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
  //   }
  // }

  //Show Detail
  showDetail: boolean = false;

  onShowDetail() {
    this.showDetail = !this.showDetail
  }

  listDescriptionOfGoodsByDcNumberBody = {
    dcNumber:null
  }

  items:any;

  @ViewChild('viewItemsDialog') viewItemsDialog = {} as TemplateRef<any>;
  listDescriptionOfGoodsByDcNumber(item:any) {
    console.log(item);
    this.dialog.open(this.viewItemsDialog);
    this.inventorySer.listDescriptionOfGoodsByDcNumber(item).subscribe((res:any)=>{
      // console.log(res);
      this.items = res;
    })
  }


  @ViewChild('dcListDialog') dcListDialog = {} as TemplateRef<any>;

  filterDcBody_All = {
    dateOfChallan: null,
    state: null,
    createdBy: null
  }

  filterDcBody_Maintenance: any = {
    dateOfChallan: null,
    createdBy: null
  }

  newItems: any = [];
  allDc: boolean = true;

  toggleDc() {
    this.allDc = !this.allDc;
  }

  openDcDialog() {
    // this.filterDcBody_All = this.user?.UserId;
    this.dialog.open(this.dcListDialog);
    this.inventorySer.getAllDC(this.filterDcBody_All).subscribe((res: any) => {
      this.items= res;
      this.newItems = this.items;
    });
  }

  getAllDC(type: string) {
    if(type == 'allDc') {
      this.inventorySer.getAllDC(this.filterDcBody_All).subscribe((res: any) => {
        // console.log(res);
        this.items= res;
        this.newItems = this.items;
      });
    } else if(type == 'maintenance') {
      this.filterDcBody_Maintenance.createdBy = this.user?.UserId;
      this .inventorySer.getlistByCreatedBy(this.filterDcBody_Maintenance).subscribe((res: any) => {
        // console.log(res);
        this.items = res;
        this.newItems = this.items;
      });
    }
  }

  filterDc(type: string) {
    if(type == 'All') {
      this.inventorySer.getAllDC(this.filterDcBody_All).subscribe((res:any) => {
        this.items = res;
        this.newItems = this.items;
      })
    } else if(type == 'Maintenance') {
      this.inventorySer.getAllDC(this.filterDcBody_Maintenance).subscribe((res:any) => {
        this.items = res;
        this.newItems = this.items;
      })
    }
  }

  updateDcBody = {
    receiptNo:null,
    amount:null,
    dcNumber:null,
    modifiedBy:1
  }

  @ViewChild('dcUpdateDialog') dcUpdateDialog = {} as TemplateRef<any>
  openDcUpdateDialog(item:any){
    this.dialog.open(this.dcUpdateDialog)
    this.currentItem= item;
  }

  updateDC(){
    this.updateDcBody.dcNumber = this.currentItem.dcNumber
    this.inventorySer.updateDC(this.updateDcBody).subscribe((res:any)=>{
      console.log(res);
    })
  }

}
