import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateFormComponent } from 'src/app/utilities/create-form/create-form.component';
import { EditFormComponent } from 'src/app/utilities/edit-form/edit-form.component';
import { AlertService } from 'src/services/alert.service';
import { SiteService } from 'src/services/site.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

  
  fields = [
    {
      key: 'accountId',
      label: 'Id',
      type: '',
      sort: true
    },
    {
      key: 'firstName',
      label: 'First Name',
      type: '',
      sort: true
    },
    {
      key: 'lastName',
      label: 'Last Name',
      type: '',
      sort: true,
    },
    {
      key: 'phoneNo',
      label: 'Mobile',
      type: '',
      sort: true,
    },
    {
      key: 'email',
      label: 'Email',
      type: '',
      sort: true,
      // call: (data: any) => this.listSiteServices(data)
    },
    // {
    //   key: 'accountType',
    //   label: 'Account Type',
    //   type: '',
    //   sort: true,
    // },
    {
      key: 'contactPerson',
      label: 'Contact Person',
      type: '',
      sort: true,
      // call: (data: any) => this.getCameraEventsConfigData(data)
    },
    // {
    //   key: 'leadNo',
    //   label: 'Lead No',
    //   type: '',
    //   sort: true
    // },
    // {
    //   key: 'website',
    //   label: 'Website',
    //   type: '',
    //   sort: true
    // },
    // {
    //   key: 'fax',
    //   label: 'Fax',
    //   type: '',
    //   sort: true
    // },
    {
      key: 'status',
      label: 'Status',
      type: '',
      sort: true,
      // call: (data: any) => this.getCamerasForSiteId(data)
    },
    // {
    //   key: 'createdBy',
    //   label: 'createdBy',
    //   type: '',
    //   sort: false,

    // },
    // {
    //   key: 'createdTime',
    //   label: 'createdTime',
    //   type: '',
    //   sort: false,

    // },
    {
      key: 'actions',
      label: 'Actions',
      actions: ['view', 'edit'],
      type: 'actions',
      sort: false,
      call: (data: any, type: string) => {
        switch(type) {
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



  showLoader = false;
  constructor(private http: HttpClient,
    private siteSer:SiteService,
    private storage_service: StorageService,
    private dialog: MatDialog,
    private alertSer: AlertService
  ) { }

  ngOnInit(): void {
    this.getAccountData()
  }

  getAccountDataRes:any = []
  getAccountData() {
    this.storage_service.table_loader_sub.next(true);
    this.siteSer.getAccountData().subscribe((res:any) => {
      this.storage_service.table_loader_sub.next(false);
      this.getAccountDataRes = res.accountDetails
    })
  }
  searchText: any;
  CustomerTable: any;
  CustomerReport() {
    this.http.get('assets/JSON/customerData.json').subscribe(res => {
      this.CustomerTable = res;
    });
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

  showAddCustomer = false;
  closenow(value: any, type: String) {
    if (type == 'cust') { this.showAddCustomer = value; }
    this.getAccountData();
  }

  show(type: string) {
    if (type == 'cust') { this.showAddCustomer = true; }
  }

  masterSelected: boolean = false;
  selectedAll: any;

  selectAll() {
    for (var i = 0; i < this.CustomerTable.length; i++) {
      this.CustomerTable[i].selected = this.selectedAll;
    }
  }
  checkIfAllSelected() {
    this.selectedAll = this.CustomerTable.every(function (item: any) {
      return item.selected == true;
    })
  }

  deleteRow: any;
  deleteRow1(item: any, i: any) {
    this.showLoader = true;
    setTimeout(() => {
      this.showLoader = false;
      this.CustomerTable.splice(i, 1);
    }, 1000);
  }

  deletePopup: boolean = true;
  confirmDeleteRow() {
    // console.log(this.currentItem);
    this.CustomerTable = this.CustomerTable.filter((item: any) => item.siteId !== this.currentItem.siteId);
    this.deletePopup = true;
  }

  closeDeletePopup() {
    this.deletePopup = true;
  }

  currentItem: any;
  @ViewChild('editprofileDialog') editprofileDialog: any = ElementRef;
  openEditPopup(item: any) {
    this.currentItem = JSON.parse(JSON.stringify(item));
    // this.storage_service.edit_sub.next({ data: item, dropdownData: [], updateUrl: 'camera/updateCameraData_1_0', getUrl: 'getCamerasForSiteId_1_0' });
    this.dialog.open(this.editprofileDialog,{disableClose:true});

  }

  @ViewChild('viewpopup') viewpopup: any = ElementRef;
  openViewPopup(item: any) {
    this.currentItem = item;;
   this.dialog.open(CreateFormComponent, {
           data: {
             body: item,
             label: item.accountId
           },
           disableClose: true
         });
  }

  sorted = false;
  sort(label: any) {
    this.sorted = !this.sorted;
    var x = this.CustomerTable;
    if (this.sorted == false) {
      x.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      x.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }

  updateAccount() {
    this.siteSer.updateAccountData(this.currentItem).subscribe((res: any) => {
      if(res.statusCode === 200) {
        this.alertSer.success(res.message)
        this.getAccountData();
      } else {
        this.alertSer.error(res.message)
      }
    })
  }


}
