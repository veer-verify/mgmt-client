import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/services/alert.service';
import { AssetService } from 'src/services/asset.service';
import { InventoryService } from 'src/services/inventory.service';
import { MetadataService } from 'src/services/metadata.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private ass: AssetService,
    private inventorySer: InventoryService,
    private metaDatSer: MetadataService,
    private alertSer: AlertService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.listOrders();
    this.getVendorr();
    // this.listOrderItems();
  }

  showLoader = false;

  searchText: any;
  searchTx: any;
  ordersTable: any = [];
  newOrdersTable: any = [];
  orderItems: any = [];

  productIds: any;
  listOrders() {
    this.showLoader = true;
    this.inventorySer.listOrders().subscribe((res: any) => {
      // console.log(res);
      this.showLoader = false;
      this.ordersTable = res;
      this.newOrdersTable = this.ordersTable;
    });

    this.inventorySer.listProduct().subscribe((res: any) => {
      this.productIds = res;
    })
  }

  vendorDetail: any;
  getVendorr() {
    // this.inventorySer.listVendors().subscribe((res: any) => {
    //   this.vendorDetail = res;
    // })
  }

  listOrderItems() {
    this.showLoader = true;
    this.inventorySer.listOrderItemsById(this.orderItemsId.id).subscribe((res: any) => {
      this.showLoader = false;
      this.orderItems = res;
    });
  }

  brandNames: any;
  categoryTypes: any;
  statusVal: any;
  removeDuplicates() {
    this.brandNames = this.ordersTable.reduce((acc: any, current: any) => {
      const x = acc.find((item: any) => item.productBrand == current.productBrand);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    this.categoryTypes = this.ordersTable.reduce((acc: any, current: any) => {
      const x = acc.find((item: any) => item.productCategory == current.productCategory);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    this.statusVal = this.ordersTable.reduce((acc: any, current: any) => {
      const x = acc.find((item: any) => item.status == current.status);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);
  }

  vendorStatus: any;
  getMetadata() {
    this.metaDatSer.getMetadata().subscribe((res: any) => {
      // console.log(res);
      for(let item of res) {
        if(item.type == 'Ticket_Status') {
          this.statusVal = item.metadata;
        } else if(item.type == "Vendor_Status") {
          this.vendorStatus = item.metadata;
        }
      }
    })
  }

  ovendorId: any = '';
  oinvoiceId: any = null;
  ostartDate: any = null;
  oendDate: any = null;

  applyFilter() {
    let myObj = {
      'vendorId': this.ovendorId ? this.ovendorId : -1,
      'invoiceNo': this.oinvoiceId ? this.oinvoiceId : '',
      'startDate': this.ostartDate ? this.ostartDate : '',
      'endDate': this.oendDate ? this.oendDate : '',
    }

    this.inventorySer.filterOrders(myObj).subscribe((res: any) => {
      this.newOrdersTable = res;
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
  closenow(value: any, type: String) {
    if (type == 'vendor') {
      this.showInventory = value;
    }
  }

  show(type: string) {
    if (type == 'vendor') {
      this.showInventory = true;
    }
  }


  currentItem: any;
  originalObject: any;
  changedKeys: any = [];

  /* view inventory */

  @ViewChild('viewInventoryDialog') viewInventoryDialog = {} as TemplateRef<any>;
  openViewPopup(item: any) {
    this.currentItem = item;
    this.dialog.open(this.viewInventoryDialog, { maxWidth: '550px', maxHeight: '550px'});
    // console.log(this.currentItem);
  }


  /* update inventory */

  @ViewChild('editInventoryDialog') editInventoryDialog = {} as TemplateRef<any>;
  openEditPopup(item: any) {
    this.currentItem = item;
    this.dialog.open(this.editInventoryDialog, { maxWidth: '550px', maxHeight: '550px'});
  }

  updateOrder() {
    this.originalObject = {
      'id': this.currentItem.id,
      'invoiceNo': this.currentItem.invoiceNo,
      'by': 1,
      // 'remarks': this.currentItem.remarks
    }

    this.inventorySer.updateOrder(this.originalObject).subscribe((res: any) => {
      // console.log(res);
      if(res) {
        this.alertSer.success(res?.message);
        this.listOrders();
      }
    }, (err: any) => {
      if(err) {
        this.alertSer.error(err);
      };
    });
  }


  @ViewChild('deleteInventoryDialog') deleteInventoryDialog = {} as TemplateRef<any>;

  openDeletePopup(item: any) {
    this.currentItem = item;
    this.dialog.open(this.deleteInventoryDialog, { maxWidth: '550px', maxHeight: '550px'});
  }

  deleteInventory() {
    this.alertSer.wait();
    this.inventorySer.deleteOrder(this.currentItem).subscribe((res: any) => {
      if(res) {
        this.alertSer.success(res?.message);
        this.listOrders();
      }
    }, (err: any) => {
      if(err) {
        this.alertSer.error(err);
      };
    });
  }

  @ViewChild('orderItemsDialog') orderItemsDialog = {} as TemplateRef<any>;

  orderItemsId: any;
  openOrderItems(item: any) {
    this.orderItemsId = item;
    this.inventorySer.listOrderItemsById(this.orderItemsId.id).subscribe((res: any) => {
      this.orderItems = res;
    });
    this.dialog.open(this.orderItemsDialog, { maxWidth: '550px', maxHeight: '550px'});
    // console.log(item);
  }


  @ViewChild('createOrderDialog') createOrderDialog = {} as TemplateRef<any>;
  openCreateOrder(item: any) {
    // console.log(item)
    this.orderItemsId = item;
    this.dialog.open(this.createOrderDialog,{ maxWidth: '550px', maxHeight: '550px'});
  }

  orderItemBody = {
    orderId: null,
    productId: null,
    productQuantity: null,
    createdBy: 1,
    remarks: null
  }

  addItemToOrder() {
    this.orderItemBody.orderId = this.orderItemsId?.id;
    this.inventorySer.addItemToOrder(this.orderItemBody).subscribe((res: any) => {
      if(res) {
        this.alertSer.success(res?.message);
        this.listOrderItems();
      }
    }, (err: any) => {
      if(err) {
        this.alertSer.error(err);
      }
    })
  }

  @ViewChild('updateOrderDialog') updateOrderDialog = {} as TemplateRef<any>;

  openUpdateOrder(item: any) {
    this.currentItem = item;
    this.dialog.open(this.updateOrderDialog, { maxWidth: '550px', maxHeight: '550px'});
  }

  updateOrderItem() {
    this.originalObject = {
      'id': this.currentItem.id,
      'productQuantity': this.currentItem.productQuantity,
      'by': 1
    }

    this.alertSer.wait();
    this.inventorySer.updateOrderItem(this.originalObject).subscribe((res: any) => {
      // console.log(res);
      if(res) {
        this.alertSer.success(res?.message);
        this.listOrderItems();
      }
    }, (err: any) => {
      if(err) {
        this.alertSer.error(err);
      };
    });
  }

  @ViewChild('deleteOrderItemsDialog') deleteOrderItemsDialog = {} as TemplateRef<any>;

  opendeleteOrderItem(item: any) {
    this.currentItem = item;
    this.dialog.open(this.deleteOrderItemsDialog, { maxWidth: '250px', maxHeight: '250px'});
  }

  deleteOrderItem() {
    this.inventorySer.deleteOrderItem(this.currentItem).subscribe((res: any) => {
      if(res) {
        this.alertSer.success(res?.message);
        this.listOrderItems();
      }
    }, (err: any) => {
      if(err) {
        this.alertSer.error(err);
      };
    });
  }

  filterOrderItems() {}


  sorted = false;
  sort(label: any) {
    this.sorted = !this.sorted;
    var x = this.ordersTable;
    if (this.sorted == false) {
      x.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      x.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }

  //Show Detail
  showDetail: boolean = false;

  onShowDetail() {
    this.showDetail = !this.showDetail
  }


 /* checkbox control */

  selectedAll: any;
  selectAll() {
    for (var i = 0; i < this.ordersTable.length; i++) {
      this.ordersTable[i].selected = this.selectedAll;
    }
  }

  checkIfAllSelected() {
    this.selectedAll = this.ordersTable.every(function (item: any) {
      return item.selected == true;
    })
  }

  viewArray: any = [];
  ViewByCheckbox(itemV: any, i: any, e: any) {
    var checked = (e.target.checked);
    if (checked == true && this.viewArray.includes(itemV) == false) {
      this.viewArray.push(itemV);
      this.currentItem = this.viewArray[(this.viewArray.length - 1)];
    }
    if (checked == false && this.viewArray.includes(itemV) == true) {
      this.viewArray.splice(this.viewArray.indexOf(itemV), 1)
    }
  }

  viewBySelectedOne() {
    if (this.viewArray.length > 0) {
      this.dialog.open(this.viewInventoryDialog)
    }
  }

  editArray: any = [];
  EditByCheckbox(itemE: any, i: any, e: any) {
    var checked = (e.target.checked);
    if (checked == true && this.editArray.includes(itemE) == false) {
      this.editArray.push(itemE);
      this.currentItem = this.editArray[(this.editArray.length - 1)];
    }
    if (checked == false && this.editArray.includes(itemE) == true) {
      this.editArray.splice(this.editArray.indexOf(itemE), 1)
    }
  }

  editBySelectedOne() {
    if (this.editArray.length > 0) {
      this.dialog.open(this.editInventoryDialog)
    }
  }


  deletearray: any = [];
  deleteMultiRecords(item: any, i: any, e: any) {
    var checked = (e.target.checked);
    if (this.deletearray.length == 0) { this.deletearray.push(item) }

    this.deletearray.forEach((el: any) => {
      if (el.siteId != item.siteId && checked) {
        this.deletearray.push(item);
        this.deletearray = [...new Set(this.deletearray.map((item: any) => item))]
      }
      if (el.siteId == item.siteId && !checked) {
        var currentindex = this.deletearray.indexOf(item);
        this.deletearray.splice(currentindex, 1)
      }
    });
  }

  deleteSelected() {
    if (this.selectedAll == false) {
      this.deletearray.forEach((el: any) => {
        this.ordersTable = this.ordersTable.filter((item: any) => item.siteId !== el.siteId);
      });
      this.deletearray = []
    } else {
      this.ordersTable.forEach((el: any) => {
        this.ordersTable = this.ordersTable.filter((item: any) => item.siteId !== el.siteId);
      });
    }
  }

}
