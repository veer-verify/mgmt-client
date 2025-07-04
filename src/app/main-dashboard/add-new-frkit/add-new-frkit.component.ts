import { animate, style, transition, trigger } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/services/alert.service';
import { InventoryService } from 'src/services/inventory.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-add-new-frkit',
  templateUrl: './add-new-frkit.component.html',
  styleUrls: ['./add-new-frkit.component.css'],
  animations:[
    trigger("inOutPaneAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateX(100%)" }), //apply default styles before animation starts
        animate(
          "500ms ease-in-out",
          style({ opacity: 1, transform: "translateX(0)" })
        )
      ]),
      transition(":leave", [
        style({ opacity: 1, transform: "translateX(0)" }), //apply default styles before animation starts
        animate(
          "500ms ease-in-out",
          style({ opacity: 0, transform: "translateX(100%)" })
        )
      ])
    ])
  ]
})
export class AddNewFrkitComponent implements OnInit {

  constructor(
    private inventorySer: InventoryService,
    private router: Router,
    private fb: FormBuilder,
    public alertSer: AlertService,
    public datepipe: DatePipe,
    private storageSer: StorageService
  ) { }

  @Input() show: any;
  // @Input() ticketIdFrmFr: any;
  @Output() newItemEvent = new EventEmitter<boolean>();

  UserForm: any =  FormGroup;

  inventoryBody = {
    frId: null,
    inventorySlNo: null,
    itemCode: null,
    name: null,
    createdBy: null
  }

  ticketIdFrmFr: any;
  user: any;
  ngOnInit() {
    this.UserForm = this.fb.group({
      'frId': new FormControl('',Validators.required),
      'inventorySlNo': new FormControl('', Validators.required),
      'itemCode': new FormControl('',Validators.required),
      'name': new FormControl('', Validators.required)
    });
    this.ticketIdFrmFr = this.storageSer.get('ticketId');
    this.user = this.storageSer.get('user');
  }

  items: any = [];
  onTaskAdd(item: any) {
    let takBody = {
      'itemCode': item.itemCode,
      'quantity': item.quantity
    }

    this.items.push(takBody);
  }

  closeAddUser() {
    this.newItemEvent.emit();
  }

  itemCodes: any;
  getItemCodes(slNo: any) {
    this.inventorySer.getItemCodes(slNo).subscribe((res: any) => {
      // console.log(res);
      this.itemCodes = res;
    })
  }

  names: any;
  listInventoryByItemCode(itemCode: any) {
    this.inventorySer.listInventoryByItemCode_1_0(itemCode).subscribe((res: any) => {
      // console.log(res);
      this.names = res;
    })
  }

  submitted!: boolean;
  arr: any = [];
  warrantyDetail: any = 'No';
  submit() {
    if(this.UserForm.valid) {
      this.inventoryBody.createdBy = this.user?.UserId;
      this.inventorySer.createFRKit(this.inventoryBody).subscribe((res:any)=>{
        // console.log(res);
        this.newItemEvent.emit();
        this.alertSer.success(res?.message);
      } , (err: any) => {
        this.alertSer.error(err);
      })
    }
    // console.log(this.inventoryBody)
  }


  checkbox: boolean = false;
  onCheck() {
    this.checkbox = !this.checkbox;
  }

}
