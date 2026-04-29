import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AuditService } from 'src/services/audit.service';

@Component({
  selector: 'app-audit-report',
  templateUrl: './audit-report.component.html',
  styleUrls: ['./audit-report.component.css']
})
export class AuditReportComponent {

  constructor(
    private audit_service: AuditService,
    private fb: FormBuilder
  ) { }

  filterForm!: FormGroup

  today = new Date()

  clientsList: any = [];

  auditData: any = [];

  noData: boolean = false;

  all: boolean = true;
  // portal: boolean = false;
  showLoader: boolean = false;
  endDate = this.today
  deviceItems = [0, 1];
  dateClick = true;
  nameClick = true;
  countClick = true;
  totalPortalCount = 0;
  totalAppCount = 0;
  totalLoginCount = 0;

  ngOnInit() {
    this.filterForm = this.fb.group({
      fromDate: [''],
      toDate: [''],
      client: [''],
      device: ['']
    })

    this.filterForm.patchValue({
      fromDate: this.today,
      toDate: this.today
    })

    this.getLogins();

    this.audit_service.listUsersByDepartment({ deptId: 21 }).subscribe((res: any) => {
      this.audit_service.listUsersByDepartment({ deptId: 22 }).subscribe((res2: any) => {
        this.clientsList = [...res.userDetails, ...res2.userDetails]
      })
    })
  }

  getLogins() {
    this.showLoader = true;
    this.totalPortalCount = 0;
    this.totalAppCount = 0;
    this.totalLoginCount = 0;
    this.audit_service.userLoginCount(this.filterForm.value).subscribe((res: any) => {
      this.auditData = res.data
      this.showLoader = false;
      for (let i = 0; i < this.auditData.length; i++) {
        this.totalPortalCount += this.auditData[i].portalCount;
        this.totalAppCount += this.auditData[i].appCount;
      }
      this.totalLoginCount = this.totalPortalCount + this.totalAppCount;
    })
  }

  sortByDate() {
    if (this.dateClick) {
      this.auditData.sort((a: any, b: any) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
    }
    else {
      this.auditData.sort((a: any, b: any) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
    }
    this.dateClick = !this.dateClick
  }

  sortByName() {
    if (this.nameClick) {
      this
      this.auditData.sort((a: any, b: any) =>
        b.userName.localeCompare(a.userName)
      );
    }
    else {
      this.auditData.sort((a: any, b: any) =>
        a.userName.localeCompare(b.userName)
      );
    }
    this.nameClick = !this.nameClick
  }

  // sortByCount() {
  //   if (this.countClick) {
  //     if (this.all) {
  //       this.auditData.sort((a: any, b: any) =>
  //         b.totalLoginCount - a.totalLoginCount
  //       );
  //     }
  //     else {
  //       if (this.portal) {
  //         this.auditData.sort((a: any, b: any) =>
  //           b.portalCount - a.portalCount
  //         );
  //       }
  //       else {
  //         this.auditData.sort((a: any, b: any) =>
  //           b.appCount - a.appCount
  //         );
  //       }
  //     }
  //   }
  //   else {
  //     if (this.all) {
  //       this.auditData.sort((a: any, b: any) =>
  //         a.totalLoginCount - b.totalLoginCount
  //       );
  //     }
  //     else {
  //       if (this.portal) {
  //         this.auditData.sort((a: any, b: any) =>
  //           a.portalCount - b.portalCount
  //         );
  //       }
  //       else {
  //         this.auditData.sort((a: any, b: any) =>
  //           a.appCount - b.appCount
  //         );
  //       }
  //     }
  //   }
  //   this.countClick = !this.countClick
  // }

  onFilterChange() {
    // if (this.filterForm.get('device')?.value !== "") {
    //   this.all = false;
    //   if (this.filterForm.get('device')?.value === "portal") this.portal = true;
    //   else this.portal = false;
    // }
    this.getLogins();
    this.endDate = this.filterForm.get('toDate')?.value;
    if (this.filterForm.get('fromDate')?.value > this.filterForm.get('toDate')?.value) {
      this.filterForm.patchValue({
        fromDate: this.endDate
      })
    }
  }

  toggleSort = false;
  sort(key: string) {
    this.toggleSort = !this.toggleSort;
    if (this.toggleSort) {
      this.auditData.sort((a: any, b: any) => a[key] > b[key] ? 1 : -1);
    } else {
      this.auditData.sort((a: any, b: any) => b[key] > a[key] ? 1 : -1)
    }
  }

}
