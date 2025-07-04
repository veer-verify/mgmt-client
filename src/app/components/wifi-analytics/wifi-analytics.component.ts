import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { AlertService } from 'src/services/alert.service';
import { AssetService } from 'src/services/asset.service';
import { ChartService } from 'src/services/chart.service';
import { InventoryService } from 'src/services/inventory.service';
import { MetadataService } from 'src/services/metadata.service';
import { SiteService } from 'src/services/site.service';
import { StorageService } from 'src/services/storage.service';


@Component({
  selector: 'app-wifi-analytics',
  templateUrl: './wifi-analytics.component.html',
  styleUrls: ['./wifi-analytics.component.css']
})
export class WifiAnalyticsComponent implements OnInit {


  showLoader = false;
  constructor(
    private inventorySer: InventoryService,
    private siteSer: SiteService,
    private assetSer: AssetService,
    private metaDatSer: MetadataService,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    public alertSer: AlertService,
    private storageSer: StorageService,
    private chartService: ChartService
  ) { }


  first: boolean = true;
  second: boolean = false;
  open(type: string) {
    // this.count();
    if (type == 'data') {
      this.second = true;
      this.first = false;
    }
    else
      this.first = true;
  }

  tempSites: any;
  // siteData: any;
  user: any;
  ngOnInit(): void {
    this.user = this.storageSer.get('user');
    this.dayWiseStats();
  }

  
 

  newDayWiseData: any = [];
  dayWiseStatsData: any;
  response: any;
  dayWiseStats() {
    this.assetSer.dayWiseStats().subscribe((res: any) => {
      // console.log(res);
      this.response = res;
      this.dayWiseStatsData = res.content;
      this.newDayWiseData = this.dayWiseStatsData;
      
    })
  }

  
  currentItem: any;
  newWifiData: any;
  hourWiseStatsData: any = [];
  currentPage2: any;
  totalPages2: any;
  @ViewChild('usedItemsDialog') usedItemsDialog = {} as TemplateRef<any>;
  hourWiseStats(item: any) {
    // console.log(item);
    this.currentItem = item
    // this.inputToChild = item;
    this.assetSer.hourWiseStats({device_name: item.device_name, date_connected: item.date_connected, page: this.currentPage2}).subscribe((res: any) => {
      // console.log(res);
      this.hourWiseStatsData = res.content.sort((a:any, b:any)=> {
        const [startA, endA] = a.time_connected.split('-').map(Number);
        const [startB, endB] = b.time_connected.split('-').map(Number);
        return startA - startB || endA - endB;
      });
      this.currentPage2 = res.page;
      this.totalPages2 = res.pages;
    })
    this.dialog.open(this.usedItemsDialog);
  }

  setPagination2(item: any, current: any) {
    this.assetSer.hourWiseStats({device_name: item.device_name, date_connected: item.date_connected, page: current}).subscribe((res: any) => {
      // console.log(res);
      this.hourWiseStatsData = res.content.sort((a:any, b:any)=> {
        const [startA, endA] = a.time_connected.split('-').map(Number);
        const [startB, endB] = b.time_connected.split('-').map(Number);
        return startA - startB || endA - endB;
      });
      this.currentPage2 = res.page;
      this.totalPages2 = res.pages;
    })
  }

 


  newitem:any
  deviceWiseStatsData: any;
  currentPage3: any;
  totalPages3: any;
  @ViewChild('usedItemsDialogTwo') usedItemsDialogTwo = {} as TemplateRef<any>;
  deviceWiseStats(task: any, ) {
    this.newitem = task;
    let time = task?.time_connected.split('-');
    let time_connected = time[0];
    this.assetSer.deviceWiseStats({ deviceName: task?.device_name, time_connected: time_connected, doi: this.currentItem.date_connected, page: this.currentPage3 }).subscribe((res: any) => {
      this.deviceWiseStatsData = res?.content;
      this.currentPage3 = res.page;
      this.totalPages3 = res.pages;
    })
    this.dialog.open(this.usedItemsDialogTwo);
  }

  setPagination3(task: any, current: any) {
    let time = task?.time_connected.split('-');
    let time_connected = time[0];
    this.assetSer.deviceWiseStats({ deviceName: task?.device_name, time_connected: time_connected, doi: this.currentItem.date_connected, page: current }).subscribe((res: any) => {
      this.deviceWiseStatsData = res?.content;
      this.currentPage3 = res.page;
      this.totalPages3 = res.pages;
    })
  }

  filterDataObject = {
    device_name: '',
    doif: null,
    doit: null
  }

  newFilterData: any = [];
  filterData: any;
  devicefilter() {
    if(this.filterDataObject.device_name == '') {
      this.newDayWiseData = this.dayWiseStatsData;
    } else {
      this.assetSer.dayWiseStats(this.filterDataObject).subscribe((res: any) => {
        // console.log(res);
        this.newDayWiseData = res.content;
      });
    }
  }
  showWifiDetail: boolean = false;
  closenow(type: any) {
    if (type == 'wifi') {
      this.showWifiDetail = false;
    }
  }

  inputToChild: any;
  show(type: string, data: any) {
    if (type == 'wifi') {
      this.showWifiDetail = true;
      this.inputToChild = data;
    }
  }




  getAdsFromChild(data: any) {
    // console.log(data)
    this.newDayWiseData = data;
  }

  getSearchFromChild(data: any) {
    this.searchText = data;
  }

  getLoaderFromChild(data: boolean) {
    this.showLoader = data;
  }

  getDateFromChild(data:any) {
    console.log(data)
    this.newDayWiseData = data;
  }

  frFilterBody: any = {
    p_frId: null,
    p_startdate: null,
    p_enddate: null
  }

  listSitesData: any
  reportsData: any = [];
  listFRReports() {
    this.frFilterBody.p_frId = this.user?.UserId;
    this.inventorySer.listFRReports(this.frFilterBody).subscribe((res: any) => {
      // console.log(res);
      this.reportsData = res;

    })
  }

  searchText: any;

  ticketOpen: any = [];
  ticketClose: any = [];
  ticketProgress: any = [];
  ticketRejected: any = [];


  priorityVal: any;
  statusVal: any;
  assignedTo: any;
  ticketType: any;
  sourceOfRequest: any
  getMetadata() {
    let data = this.storageSer.get('metaData');
    for (let item of data) {
      if (item.type == 'Ticket_Status') {
        this.statusVal = item.metadata;
      } else if (item.type == "Ticket_Priority") {
        this.priorityVal = item.metadata;
      } else if (item.type == "Assigned_To") {
        this.assignedTo = item.metadata;
      } else if (item.type == "Ticket_Type") {
        this.ticketType = item.metadata;
      } else if (item.type == "Source_of_Request") {
        this.sourceOfRequest = item.metadata;
      }
    }
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

  showAddSite = false;
  showAddCamera = false;
  showAddCustomer = false;
  showAddUser = false;
  showAddBusinessVertical = false;
  showSite = false;




  originalObject: any;
  changedKeys: any = [];

  @ViewChild('viewTicketDialog') viewTicketDialog = {} as TemplateRef<any>;
  ticketTasks: any;
  ticketVisits: any;
  ticketComments: any = [];
  openViewPopup(item: any) {

    this.dialog.open(this.viewTicketDialog);

    this.inventorySer.getTasks(item.ticketId).subscribe((tasks: any) => {

      this.ticketTasks = tasks;
    });

    this.inventorySer.getTicketVisits(item.ticketId).subscribe((visits: any) => {

      this.ticketVisits = visits;
    });

    this.inventorySer.getcomments(item.ticketId).subscribe((comments: any) => {
      this.ticketComments = comments;
    });
  }


  assignedObj = {
    assignedTo: ""
  }

  @ViewChild('assignedDialog') assignedDialog = {} as TemplateRef<any>;

  toAssign: any;
  openAssigned(item: any) {
    // console.log(item)
    this.toAssign = item;
    this.dialog.open(this.assignedDialog);
  }

  toAssigned() {
    let myObj = {
      'ticketId': this.toAssign.ticketId,
      'assignedTo': this.assignedObj.assignedTo,
      "assignedBy": 1
    }

    this.inventorySer.assignTicket(myObj).subscribe((res: any) => {
      // console.log(res);
      this.alertSer.success(res?.message);
    }, (err: any) => {
      if (err) {
        this.alertSer.error(err);
      }
    })
  }


  cmtValue: any;
  newComment: any = [];
  todayDate = new Date();
  createComment() {
    this.newComment.push(this.cmtValue);
    let myObj = {
      'ticketId': this.currentItem.ticketId,
      'message': this.cmtValue,
      'createdBy': this.user?.UserId
    }

    this.inventorySer.createComment(myObj).subscribe((res: any) => {
      this.inventorySer.comment$.next(res);
    });
    this.cmtValue = ''
  }

  @ViewChild('table', { static: false }) table!: ElementRef;
  generatePDF() {
    const doc = new jsPDF();
    const table = this.table.nativeElement;
    html2canvas(table).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      doc.addImage(imgData, 'PNG', 10, 10, 190, 0);
      doc.save('table-data.pdf');
    });
  }

  sorted = false;
  sort(label: any) {
    this.sorted = !this.sorted;
    var x = this.newDayWiseData;
    if (this.sorted == false) {
      x.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      x.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }

  sorted1 = false;
  sort1(label: any) {
    this.sorted = !this.sorted;
    var x = this.hourWiseStatsData;
    if (this.sorted == false) {
      x.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      x.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }

}
