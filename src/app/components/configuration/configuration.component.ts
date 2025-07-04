import { Dialog } from '@angular/cdk/dialog';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ConfigurationService } from 'src/services/configuration.service';
import { trigger, style, animate, transition } from '@angular/animations';
import { AlertService } from 'src/services/alert.service';
import { MatDialog } from '@angular/material/dialog';

interface Department {
  id: number;
  name: string;
  remarks: string | null;
}

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate(
          '300ms ease',
          style({ opacity: 1, transform: 'translateX(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '0ms ease',
          style({ opacity: 0, transform: 'translateX(-20px)' })
        ),
      ]),
    ]),
  ],
})
export class ConfigurationComponent {
  constructor(
    private config: ConfigurationService,
    private alert: AlertService,
    private Dialog: MatDialog
  ) {}

  fields = [
    {
      key: 'id',
      label: 'Id',
      type: '',
      sort: false,
    },
    {
      key: 'name',
      label: 'Department Name',
      type: '',
      sort: false,
    },
    // {
    //   key: 'remarks',
    //   label: 'Remarks',
    //   type: '',
    //   sort: false,
    //   // call: (data: any) => this.getCamerasForSiteId(data)
    // },
    {
      key: 'actions',
      label: 'Actions',
      actions: ['edit', 'delete'],
      type: 'actions',
      sort: false,
      call: (data: any, type: string) => {
        switch (type) {
          case 'delete':
            this.deleteDepartment(data);
            break;
          case 'edit':
            this.opendepartmentEditPopup(data);
            break;
          default:
        }
      },
    },
  ];

  fields1 = [
    {
      key: 'id',
      label: 'Id',
      type: '',
      sort: false,
    },
    {
      key: 'name',
      label: 'Role',
      type: '',
      sort: false,
    },
    // {
    //   key: 'remarks',
    //   label: 'Remarks',
    //   type: '',
    //   sort: false,

    // },
    {
      key: 'actions',
      label: 'Actions',
      actions: ['edit', 'delete'],
      type: 'actions',
      sort: false,
      call: (data: any, type: string) => {
        switch (type) {
          case 'delete':
            this.deleteRole(data);
            break;
          case 'edit':
            this.openroleEditPopup(data);
            break;
          default:
        }
      },
    },
  ];

  showForm: 'department' | 'role' | null = 'department';

  ngOnInit(): void {
    this.getDepartments();
    this.getRoles();
  }

  toggleForm(type: 'department' | 'role') {
    this.showForm = this.showForm === type ? null : type;
  }

  departmentName = '';
  departmentDescription = '';

  roleName = '';
  roleDescription = '';

  submitDepartment() {
    const dept = {
      name: this.departmentName,
      remarks: this.departmentDescription,
    };

    if (this.departmentName) {
      this.config.createDepartments(dept).subscribe(
        (res: any) => {
          if (res.statusCode == 200) {
            this.alert.success(res.message);
            this.departmentName = '';
            this.departmentDescription = '';
            this.getDepartments();
          } else {
            this.alert.error(res.message);
          }
        },
        (err) => {
          this.alert.error(err);
        }
      );
    } else {
      this.alert.error('Please fill Department');
    }
  }

  submitRole() {
    const role = {
      name: this.roleName,
      remarks: this.roleDescription,
    };

    if (this.roleName) {
      this.config.createRoles(role).subscribe(
        (res: any) => {
          if (res.statusCode == 200) {
            this.alert.success(res.message);
            this.roleName = '';
            this.roleDescription = '';
            this.getRoles();
          } else {
            this.alert.error(res.message);
          }
        },
        (err) => {
          this.alert.error(err);
        }
      );
    } else {
      this.alert.error('Please fill Role');
    }
  }

  DepartmentsAll: any = [];
  getDepartments() {
    this.config.getDepartments().subscribe((res: any) => {
      if (res.statusCode == 200) {
        this.DepartmentsAll = res.data;
      }
    });
  }
  RolesAll: any = [];
  getRoles() {
    this.config.getRoles().subscribe((res: any) => {
      if (res.statusCode == 200) {
        this.RolesAll = res.data;
      }
    });
  }

  @ViewChild('editdepartmentDialog') editdepartmentDialog = {} as TemplateRef<any>;

  @ViewChild('editroleDialog') editroleDialog = {} as TemplateRef<any>;

  currentEdititem: any;

  opendepartmentEditPopup(item: any) {

    this.currentEdititem = {...item};

    this.Dialog.open(this.editdepartmentDialog);
  }

  editDepartment(){

 if (this.currentEdititem.name) {
      this.config.editDepartment(this.currentEdititem).subscribe(
        (res: any) => {
          if (res.statusCode == 200) {
            this.alert.success(res.message);
          
            this.Dialog.closeAll();
            this.getDepartments();
          } else {
            this.alert.error(res.message);
          }
        },
        (err) => {
          this.alert.error(err);
        }
      );
    } else {
      this.alert.error('Please fill Department');
    }

  }

  openroleEditPopup(item: any) {

     this.currentEdititem = {...item};
      this.Dialog.open(this.editroleDialog);
  }

  editRole(){

    if (this.currentEdititem.name) {
      this.config.editRole(this.currentEdititem).subscribe(
        (res: any) => {
          if (res.statusCode == 200) {
            this.alert.success(res.message);
         
            this.Dialog.closeAll();
            this.getRoles();
          } else {
            this.alert.error(res.message);
          }
        },
        (err) => {
          this.alert.error(err);
        }
      );
    } else {
      this.alert.error('Please fill Role');
    }

  }

  deleteDepartment(item: any) {
    if (item) {
      this.config.deleteDepartment(item).subscribe(
        (res: any) => {
          if (res.statusCode == 200) {
            this.alert.success(res.message);
            this.getDepartments();
          } else {
            this.alert.error(res.message);
          }
        },
        (err) => {
          this.alert.error(err);
        }
      );
    }
  }

  deleteRole(item: any) {
    if (item) {
      this.config.deleteRoles(item).subscribe(
        (res: any) => {
          if (res.statusCode == 200) {
            this.alert.success(res.message);
            this.getRoles();
          } else {
            this.alert.error(res.message);
          }
        },
        (err) => {
          this.alert.error(err);
        }
      );
    }
  }
}
