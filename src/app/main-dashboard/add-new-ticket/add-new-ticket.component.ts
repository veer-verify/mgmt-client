import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/services/alert.service';
import { InventoryService } from 'src/services/inventory.service';
import { MetadataService } from 'src/services/metadata.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-add-new-ticket',
  templateUrl: './add-new-ticket.component.html',
  styleUrls: ['./add-new-ticket.component.css'],
  animations:[
    trigger("inOutPaneAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateX(100%)", }), //apply default styles before animation starts
        animate(
          "500ms ease-in-out",
          style({ opacity: 1, transform: "translateX(0)" })
        )
      ]),
      transition(":leave", [
        style({ opacity: 1, transform: "translateX(0)", }), //apply default styles before animation starts
        animate(
          "500ms ease-in-out",
          style({ opacity: 0, transform: "translateX(100%)" })
        )
      ])
    ])
  ]
})
export class AddNewTicketComponent implements OnInit {

  @Output() newItemEvent = new EventEmitter<boolean>();

  addAssetForm: any = FormGroup;

  shortLink: string = "";
  file: File | null = null;

  constructor(
    private fb: FormBuilder,
    private inventorySer: InventoryService,
    private dropDown: MetadataService,
    public alertSer: AlertService,
    private storageSer: StorageService
  ) { }

  ticketBody = {
    ticket: {
      typeId: null,
      reasonDescription: null,
      requestedBy: 1,
      siteId: null,
      informedThrough: null,
      createdBy: null,
    },

    tasks: [
      {
        categoryId: null,
        subCategoryId: null,
        priorityId: null,
        // reasonId: null,
        createdBy: null,
      }
    ]
  }

  tasks: any = [];
  onTaskAdd(item: any) {
    // console.log(item);
    if(item?.categoryId == null || item?.subCategoryId == null || item?.priorityId == null) {
      this.alertSer.error('Please fill all fields');
    } else {
      let takBody = {
        'categoryId': item.categoryId,
        'subCategoryId': item.subCategoryId,
        'priorityId': item.priorityId,
        // 'reasonId': item.reasonId,
        'createdBy': this.user?.UserId,
      }
      this.tasks.push(takBody);
      this.addAssetForm.get('categoryId').setValue(null);
      this.addAssetForm.get('subCategoryId').setValue(null);
      this.addAssetForm.get('priorityId').setValue(null);
      // this.addAssetForm.get('reasonId').setValue(null);
    }
  }

  siteIds: any;
  user: any;
  ngOnInit(): void {
    this.siteIds = this.storageSer.get('siteIds')?.sort((a: any, b: any) => a.siteId < b.siteId ? -1 : a.siteId > b.siteId ? 1 : 0);
    this.user = this.storageSer.get('user');

    this.addAssetForm = this.fb.group({
      'typeId': new FormControl('', Validators.required),
      'reasonDescription': new FormControl('', Validators.required),
      'requestedBy': new FormControl(''),
      'siteId': new FormControl('', Validators.required),
      'informedThrough': new FormControl('', Validators.required),

      'categoryId': new FormControl(''),
      'subCategoryId': new FormControl(''),
      'priorityId': new FormControl(''),
      // 'reasonId': new FormControl('')
    });

    this.getMetadata();
  }

  /* metadata */

  deviceType: any;
  deviceMode: any;
  ticketType: any;
  sourceOfRequest: any;
  ticketPriority: any;
  ticketCategory: any;
  ticketSubCategory: any;
  taskReason: any;
  getMetadata() {
    let data = this.storageSer.get('metaData');
    for(let item of data) {
      if(item.type == 2) {
        this.deviceType = item.metadata;
      } else if(item.type == 1) {
        this.deviceMode = item.metadata;
      } 
      else if(item.type == 101) {
        this.ticketType = item.metadata;
      } else if(item.type == 57) {
        this.sourceOfRequest = item.metadata;
      } else if(item.type == 58) {
        this.ticketPriority = item.metadata;
      } else if(item.type == 59) {
        this.ticketCategory = item.metadata;
      } else if(item.type == 60) {
        this.ticketSubCategory = item.metadata;
      } else if(item.type == 37) {
        this.taskReason = item.metadata;
      }
    }
  }

  closeTicket() {
    this.newItemEvent.emit();
  }

  addNewAsset() {
    if(this.addAssetForm.valid) {
      if(this.tasks.length > 0) {
        this.alertSer.wait();
        this.ticketBody.ticket.createdBy = this.user?.UserId;
        this.ticketBody.tasks = this.tasks;
        this.inventorySer.createTicket(this.ticketBody).subscribe((res: any) => {
          // console.log(res);
          this.newItemEvent.emit();
          this.alertSer.success(res?.message);
        }, (err: any) => {
          if(err) {
            this.alertSer.error(err);
          };
        });
      } else {
        this.alertSer.error('Please add atleast one task')
      }
    }
    // console.log(this.ticketBody);
  }

}
