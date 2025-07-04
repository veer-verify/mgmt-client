import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/services/alert.service';
import { InventoryService } from 'src/services/inventory.service';
import { MetadataService } from 'src/services/metadata.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-fr-kit',
  templateUrl: './fr-kit.component.html',
  styleUrls: ['./fr-kit.component.css']
})
export class FrKitComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private inventorySer: InventoryService,
    private metaDatSer: MetadataService,
    public alertSer: AlertService,
    private storageSer: StorageService
    ) { }

  ngOnInit(): void {
    // this.listFRSites();
    this.listFRTickets();
  }

  frTickets: any
  listFRTickets() {
    this.inventorySer.listFRCount().subscribe((res: any) => {
      // console.log(res);
      this.getMetadata();
      this.frTickets = res;
    })
  }

  assignedTo: any;
  taskStatus: any;
  sourceOfRequest: any;
  indentStatus: any;
  getMetadata() {
    let data = this.storageSer.get('metaData');
    for(let item of data) {
      if(item.type == "Assigned_To") {
        this.assignedTo = item.metadata;
      } else if(item.type == "Task_Status") {
        this.taskStatus = item.metadata;
      } else if(item.type == "Source_of_Request") {
        this.sourceOfRequest = item.metadata;
      } else if(item.type == "Indent_Status") {
        this.indentStatus = item.metadata;
      }
    }
  }

  showFrkit: boolean = false;
  show(type: string) {
    if (type == 'frKit') {
      this.showFrkit = true;
    }
  }

  closenow(type: String) {
    if (type == 'frKit') {
      this.showFrkit = false;
    }
  }

  ticketIdToFr(ticketId: any) {
    this.storageSer.set('ticketId', ticketId);
  }

  @ViewChild('ticketTaskDialog') ticketTaskDialog = {} as TemplateRef<any>;
  ticketTasks: any;
  ticketVisits: any;
  ticketComments: any = [];
  openTicketTaskDialog(item: any) {
    this.dialog.open(this.ticketTaskDialog);
    this.inventorySer.getTasks(item.ticketId).subscribe((tasks: any) => {
      this.ticketTasks = tasks;
    });
  }

  @ViewChild('viewSitesDialog') viewSitesDialog = {} as TemplateRef<any>;

  sites: any
  openSitesDialog() {
    // this.dialog.open(this.viewSitesDialog);

    this.inventorySer.listFRSites(1565).subscribe((res: any) => {
      // console.log(res);
      this.sites = res;
    })
  }


  fieldVisitEntry(item: any) {
    this.inventorySer.fieldVisitEntry(item).subscribe((res: any) => {
      // console.log(res);
      this.alertSer.success('Entry Successful');
    }, (err: any) => {
      this.alertSer.error(err);
    })
  }

  sorted = false;
  sort(label: any) {
    this.sorted = !this.sorted;
    // console.log(this.sorted);
    var x = this.frTickets;

    if (this.sorted == false) {
      x.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      x.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }

// @ViewChild('viewDcDialog') viewDcDialog = {} as TemplateRef<any>
// items:any;
// openDc() {
//   this.dialog.open(this.viewDcDialog)
//   this.inventorySer.listDC().subscribe((res:any)=>{
//     // console.log(res);
//     this.items = res;

//   })
// }

}
