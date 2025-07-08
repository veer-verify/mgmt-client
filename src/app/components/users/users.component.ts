import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateFormComponent } from 'src/app/utilities/create-form/create-form.component';
import { AlertService } from 'src/services/alert.service';
import { SiteService } from 'src/services/site.service';
import { StorageService } from 'src/services/storage.service';
import { UserService } from 'src/services/user.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  @HostListener('document:mousedown', ['$event']) onGlobalClick(e: any): void {
    // this.rowIndex = -1
  }

  userCreateForm!: FormGroup;

  fields = [
    {
      key: 'user_id',
      label: 'user_id',
      type: '',
      sort: true
    },
    {
      key: 'firstName',
      label: 'firstName',
      type: '',
      sort: true
    },
    {
      key: 'email',
      label: 'email',
      type: '',
      sort: false
    },
    {
      key: 'Address',
      label: 'Address',
      type: 'button',
      sort: false,
      call: (data: any) => this.getUserInfoForUserId(data)
    },
    // {
    //   key: 'actions',
    //   label: 'Actions',
    //   actions: ['view', 'edit'],
    //   type: 'actions',
    //   sort: false,
    //   call: (data: any, type: string) => {
    //     switch(type) {
    //       case 'view':
    //         this.openViewPopup(data);
    //         break;
    //       case 'edit':
    //         this.openEditPopup(data);
    //         break;
    //       default:
    //     }
    //   }
    // }
  ]

  constructor(
    private userSer: UserService,
    private alertSer: AlertService,
    private dialog: MatDialog,
    public storageSer: StorageService,
    private siteSer: SiteService,
    private http: HttpClient,
    private fb: FormBuilder
  ) { }

  showLoader = false;
  userData: any;
  siteData: any
  ngOnInit(): void {
    this.userData = this.storageSer.get('user');
    this.siteData = this.storageSer.get('siteIds');
    this.listUsers();
    // this.userDetailslistRoles_1_0();
    this.userDepartments();
  }

  public isAdmin(data: any): boolean {
    const list: Array<any> = Array.from(data?.dept_category, (item: any) => item.category);
    return list.includes('SuperAdmin') || list.includes('Admin') ? true : false;
  }

  searchText: any;
  assignText: any = '';
  userTableData: any = [];
  listUsers() {
    let userId = null;
    if(!this.storageSer.isSuperAdmin()) {
      userId = this.userData?.UserId;
    }
    
    this.showLoader = true;
    this.userSer.listUsers(userId).pipe(map((response: any) => {
      if(response.statusCode === 200) {
        return response.users.filter((item: any) => item.status == "IVISUSA");
      }
    })).subscribe((res: any) => {
      this.showLoader = false;
        this.userTableData = res;
    }, (err) => {
      this.showLoader = false;
    })
  }

  userInfo: any;
  getUserInfoForUserId(data: any) {
    // this.rowIndex = this.userTableData.indexOf(data);
    this.userSer.getUserInfoForUserId({ userId: data?.user_id }).subscribe((res: any) => {
      if (res.Status == 'Failed') {
        this.userInfo = null;
      } else {
        this.userInfo = res;
      }
    })
  }

  currentUser: any;
  openViewProfileDialog(data: any) {
    this.storageSer.login_loader_sub.next(true);
    this.userSer.getUserInfoForUserId({ userId: data?.user_id }).subscribe((res: any) => {
      this.storageSer.login_loader_sub.next(false);
      if(res) {
        this.currentUser = res;
        this.dialog.open(CreateFormComponent, {
          data: {
            body: res,
            label: res.userName
          },
          disableClose: true
        });
      }
    }, (err) => {
      this.storageSer.login_loader_sub.next(false);
    });
  }

  @ViewChild('editprofileDialog') editprofileDialog = {} as TemplateRef<any>;
  openEditProfileDialog(data: any) {
    this.storageSer.login_loader_sub.next(true);
    this.userSer.getUserInfoForUserId({ userId: data?.user_id }).subscribe((res: any) => {
      this.storageSer.login_loader_sub.next(false);
      this.currentUser = res;
      this.dialog.open(this.editprofileDialog);
    });
  }

  mergedData: any;
  getFormData(data: any) {
    this.mergedData = data
  }

  updateUser() {
    this.currentUser.modifiedBy = this.userData?.UserId;
    delete this.currentUser.roleList;
    delete this.currentUser.verificationId;
    delete this.currentUser.modifiedTime;
    delete this.currentUser.email;
    delete this.currentUser.createdTime;
    delete this.currentUser.createdBy;

    // delete this.currentUser.country;
    // delete this.currentUser.state;
    // delete this.currentUser.city;


    this.userSer.updateUser({ ...this.currentUser, ...this.mergedData }).subscribe((res: any) => {
      if (res.statusCode == 200) {
        this.listUsers();
        this.alertSer.success(res.message);
      } else {
        this.alertSer.error(res.message);
      }
    }, (err) => {
      this.alertSer.error(err)
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

  closenow(type: String) {
    if (type == 'user') { this.showAddUser = false; }
    if (type == 'additionalSite') { this.showAddSite = false; }
  }

  userSites: any = [];
  newUserSites: any = [];
  filters = [
    {
      id: 1,
      value: null,
      label: 'All',
      call: (data: any) => data.length
    },
    {
      id: 2,
      value: true,
      label: 'Assigned',
      call: (data: any) => data.filter((item: any) => item.assigned)?.length
    },
    {
      id: 3,
      value: false,
      label: 'Not Assigned',
      call: (data: any) => data.filter((item: any) => !item.assigned)?.length
    }
  ]

  selectedFilter: any = 1;
  filterAssigned(data: any) {
    this.showLoading = true;
    this.assignText = '';
    this.userSer.getSitesListForGlobalAccountId({
      userId: this.currentItem?.user_id, loginId: this.userData?.UserId, assigned: data?.value,
    }).subscribe({
      next: (res: any) => {
        this.showLoading = false;
        if (res.Status == 'Success') {
          this.newUserSites = res.sitesList;
          this.toggleAllIndividual();
        }
      },
      error: (err) => {
        this.showLoading = false;
      }
    })
  }

  showLoading: boolean = false;
  selectAllSites: boolean = false;
  toggleAllSites() {
    for (var i = 0; i < this.searchSites().length; i++) {
      this.selectAllSites ? this.searchSites()[i].assigned = true : this.searchSites()[i].assigned = false;
    }
  }

  searchSites() {
    return this.newUserSites.filter((item: any) => Object.keys(item).some((key) => String(item[key])!.toLowerCase().includes(this.assignText!.toLowerCase())));
  }

  toggleAllIndividual() {
    this.selectAllSites = this.searchSites().every((item: any) => item.assigned == true);
  }

  @ViewChild('assignSitesDialog') assignSitesDialog = {} as TemplateRef<any>;
  getSitesListForUserName(data: any) {
    this.selectAllSites = false;
    this.assignText = '';
    this.newUserSites = [];
    this.storageSer.login_loader_sub.next(true);
    this.selectedFilter = 1;
    this.currentItem = data;
    this.dialog.open(this.assignSitesDialog);
    this.userSer.getSitesListForGlobalAccountId({ userId: data?.user_id, loginId: this.userData?.UserId, assigned: null }).subscribe({
      next: (res: any) => {
        this.storageSer.login_loader_sub.next(false);
        if (res.Status == 'Success') {
          this.userSites = res.sitesList;
          this.newUserSites = this.userSites
          // this.searchSites();
        }
      },
      error: (err) => {
        this.storageSer.login_loader_sub.next(false);
      }
    })
  }

  submitAssignSite() {
    let isChecked = this.newUserSites.some((item: any) => item.assigned)
    if (this.selectedFilter == 2) {
      if (!isChecked) return this.alertSer.error('Please select atleast one site');

      this.alertSer.confirmDialog("Would you like to unassign all the sites?").then((msg) => {
        if (msg.isConfirmed) {
          this.userSer.unassignSiteForUser({ userId: this.currentItem?.user_id, siteId: Array.from(this.searchSites().filter((el: any) => el['assigned']), (item: any) => item.siteId) }).subscribe({
            next: (res: any) => {
              if (res.statusCode === 200) {
                this.dialog.closeAll();
                this.getSitesListForUserName(this.currentItem);
                this.alertSer.snackSuccess(res.message);
              } else {
                this.alertSer.error(res.message);
              }
            },
            error: (err: any) => {
              this.alertSer.error(err)
            }
          })
        }
      })
    } else if (this.selectedFilter == 3) {
      if (!isChecked) return this.alertSer.error('Please select atleast one site');

      this.alertSer.confirmDialog("Would you like to assign all the sites?").then((msg) => {
        if (msg.isConfirmed) {
          this.userSer.applySitesMapping({ userId: this.currentItem?.user_id, siteList: Array.from(this.searchSites().filter((el: any) => el['assigned']), (item: any) => item.siteId) }).subscribe({
            next: (res: any) => {
              if (res.status === 'Success') {
                this.dialog.closeAll();
                this.getSitesListForUserName(this.currentItem);
                this.alertSer.snackSuccess(res.message);
              } else {
                this.alertSer.error(res.message);
              }
            },
            error: (err: any) => {
              this.alertSer.error(err);
            }
          })
        }
      })
    }
  }

  showAddUser: boolean = false;
  showAddSite: boolean = false;
  show(type: string) {
    if (type == 'user') {
      if (this.storageSer.isSuperAdmin()) {
        this.alertSer.confirmDialog("You're about to create an ADMIN user. Do you want to continue?").then((res) => {
          if (res.isConfirmed) {
            this.showAddUser = true;
          }
        })
      } else {
        this.showAddUser = true;
      }
    }
    if (type == 'additionalSite') { this.showAddSite = true; }
  }

  selectedAll: any;
  selectAll() {
    for (var i = 0; i < this.userTableData.length; i++) {
      this.userTableData[i].selected = !this.userTableData[i].selected;
    }
  }

  checkIfAllSelected() {
    this.selectedAll = this.userTableData.every((item: any) => {
      return item.selected == true;
    })
  }


  deleteRow: any;
  deleteRow1(item: any, i: any) {
    this.showLoader = true;
    setTimeout(() => {
      this.showLoader = false;
      this.userTableData.splice(i, 1);
    }, 1000);
  }

  deletePopup: boolean = true;
  confirmDeleteRow(data: any) {
    // this.userTableData = this.userTableData.filter((item: any) => item.siteId !== this.currentItem.siteId);
    // this.deletePopup = true;
    this.alertSer.confirmDialog("Are you sure?").then((result) => {
      if (result.isConfirmed) {
        this.userSer.deleteUser(data).subscribe({
          next: (res: any) => {
            if (res.statusCode === 200) {
              this.listUsers();
              this.alertSer.success(res.message);
            } else {
              this.alertSer.error(res.message);
            }
          },
          error: (err: HttpErrorResponse) => {
            this.alertSer.error(err);
          }
        })
      }
    });
  }

  closeDeletePopup() {
    this.deletePopup = true;
  }

  currentItem: any;
  openDeletePopup(item: any, i: any) {
    this.currentItem = item;
    this.deletePopup = false;
  }


  editPopup: boolean = true;
  confirmEditRow() {
    // console.log(this.currentItem);
    // this.userTableData= this.userTableData.filter((item:any) => item.siteId !== this.currentItem.siteId);
    this.editPopup = true;
    this.listUsers();
  }

  closeEditPopup() {
    this.editPopup = true;
  }

  openEditPopup(item: any, i: any) {
    this.currentItem = JSON.parse(JSON.stringify(item));
    this.editPopup = false;
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
      this.editPopup = false;
    }
    this.listUsers();
  }


  viewPopup: boolean = true;
  confirmViewRow() {
    this.viewPopup = true;
  }

  closeViewPopup() {
    this.viewPopup = true;
  }

  openViewPopup(item: any, i: any) {
    this.currentItem = item;
    this.viewPopup = false;
  }

  viewArray: any = [];
  ViewByCheckbox(itemV: any, i: any, e: any) {
    var checked = (e.target.checked);
    if (checked && !this.viewArray.includes(itemV)) {
      this.viewArray.push(itemV);
      this.currentItem = this.viewArray[(this.viewArray.length - 1)];
    }
    if (!checked && this.viewArray.includes(itemV)) {
      this.viewArray.splice(this.viewArray.indexOf(itemV), 1);
    }
  }

  viewBySelectedOne() {
    if (this.viewArray.length > 0) {
      this.viewPopup = false;
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
        // this.currentItem = el;
        // this.confirmDeleteRow();
        this.userTableData = this.userTableData.filter((item: any) => item.siteId !== el.siteId);
      });
      this.deletearray = []
    } else {
      this.userTableData.forEach((el: any) => {
        this.userTableData = this.userTableData.filter((item: any) => item.siteId !== el.siteId);
      });
    }
  }



  sorted = false;
  sort(label: any) {
    this.sorted = !this.sorted;
    var x = this.userTableData;
    if (this.sorted == false) {
      x.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      x.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }

  @ViewChild('createUser') createUser = {} as TemplateRef<any>;
  opencreateuser(user: any) {
    this.currentUser = user;
    this.userCreateForm = this.fb.group({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      userName: new FormControl('', Validators.required),
      department: new FormControl('', Validators.required),
      roleList: new FormControl('', Validators.required),
      emailId: new FormControl('', Validators.required),
      realm: new FormControl('IVISUSA'),
      employeeFlag: new FormControl('F'),
      empId: new FormControl(''),
      safetyEscortFlag: new FormControl('F'),
      firstTimeFlag: new FormControl('T'),
      accountId: new FormControl(null),
      createdBy: new FormControl(''),
      callingSystemDetail: new FormControl('mgmt'),
      remarks: new FormControl(''),
    });
    this.dialog.open(this.createUser);
    this.userCreateForm.get('accountId')!.setValue(user?.accountId);
    this.userCreateForm.get('createdBy')!.setValue(user?.user_id);
    if (this.storageSer.isAdmin()) {
      this.userCreateForm.get('department')?.setValue(this.storageSer.getDepartment());
      this.userDepartments1(this.userCreateForm.get('department')?.value);
    }

  }
  oncreateUserSubmit() {
    if (this.userCreateForm.valid) {
      this.userSer.createUserWithShortDetails(this.userCreateForm.value).subscribe((res: any) => {
        if (res.statusCode == 200) {
          this.dialog.closeAll();
          this.alertSer.snackSuccess(res.message);
          this.listUsers();
        }
        else {
          this.alertSer.snackError(res.message);
        }
      }, (error) => {
        this.alertSer.snackError(error)
      })
    }
  }


  userRoles: any;
  userDetailslistRoles_1_0() {
    this.userSer.userDetailslistRoles_1_0().subscribe((res: any) => {
      if (res.statusCode == 200) {
        this.userRoles = res.roleList;
      }
    }, (err: any) => {
      // this.alertSer.error(err);
    });
  }

  departmentsAll: any;
  userDepartments() {
    this.userSer.getDepartments().subscribe((res: any) => {
      if (res.statusCode === 200) {
        this.departmentsAll = Array.from(res.departments).map((item: any) => item.department);
      }
    }, (err: any) => {
      // this.alertSer.error(err);
    });
  }

  userDepartments1(data?: any) {
    this.userSer.getDepartments(data).subscribe((res: any) => {
      if (res.statusCode === 200) {
        this.userRoles = res.departments[0].categories;
      }
    }, (err: any) => {
      // this.alertSer.error(err);
    });

  }
}
