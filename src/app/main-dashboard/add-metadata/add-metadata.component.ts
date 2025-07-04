import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/services/alert.service';
import { MetadataService } from 'src/services/metadata.service';
import { StorageService } from 'src/services/storage.service';
import Swal from 'sweetalert2';
import swal from 'sweetalert2';
// import * as swal from 'sweetalert2';

@Component({
  selector: 'app-add-metadata',
  templateUrl: './add-metadata.component.html',
  styleUrls: ['./add-metadata.component.css'],
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
export class AddMetadataComponent implements OnInit {

  @Input() metadataDetail: any;
  // @Input() metadataTypes: any;
  @Output() newItemEvent: any = new EventEmitter<boolean>();

  metadataForm: any = FormGroup;
  ng: any;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private metaDataSer: MetadataService,
    public alertSer: AlertService,
    private storageSer: StorageService
  ) { }

  user: any;
  ngOnInit(): void {
    this.user = this.storageSer.get('user');
    this.metadataForm = this.fb.group({
      metadataTypeId: new FormControl('', Validators.required),
      value: new FormControl('', Validators.required),
      code: new FormControl(''),
      remarks: new FormControl('')
    });
    // this.getDeviceType();
    this.listMetadataTypes();
  }

  metadataTypes: any = [];
  listMetadataTypes() {
    this.metaDataSer.listMetadataTypes().subscribe((types: any) => {
      this.metadataTypes = types;
    });
  }

  closeAddCamera() {
    this.newItemEvent.emit();
  }

  // type: Array<any> = [];
  // getDeviceType() {
  //   this.metaDataSer.getMetadata().subscribe((res: any) => {
  //     // console.log(res)
  //     this.type = res;
  //   })
  // }

  sit: string = '';
  siteSer(e: Event) {
    this.sit = (e.target as HTMLInputElement).value;
  }

  showType = false;
  showValueAndRemark = false;
  openNew(type: any) {
    this.metaDataSer.getMetadata().subscribe((res: any) => {
      for(let item of res) {
        if(type == '') {
          this.showType = true
        } else {
          this.showType = false
        }
        if(type == item.type) {
          this.showValueAndRemark = true
        }
      }
    })
  }

  newList: any[] = [];
  addtoList() {
    this.metaDataBody.createdBy = this.user.UserId;
    this.newList.push(this.metaDataBody)
  }

  metaDataBody: any = {
    metadataTypesId: null,
    code: null,
    value: null,
    remarks: null,
    createdBy: null,
  }
  addMetadata() {
    if(this.metadataForm.valid) {
      this.metaDataBody.createdBy = 1;
      this.metaDataSer.add(this.metaDataBody).subscribe((res: any) => {
        // console.log(res);
        this.newItemEvent.emit();
        this.alertSer.success('Created successfully');
      }, (err: any) => {
        this.alertSer.error(err);
      });
    }
  }

}



