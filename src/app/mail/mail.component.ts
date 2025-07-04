import { HttpClient } from '@angular/common/http';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup,FormBuilder, FormControl,Validators,} from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { AdvertisementsService } from 'src/services/advertisements.service';
import { AlertService } from 'src/services/alert.service';

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.css']
})
export class MailComponent {
  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    public alert:AlertService,
    private http:HttpClient,
    private adver:AdvertisementsService,

  ) {

  }

  ngOnInit() {
    this.userForm = this.fb.group({
      'recipientEmails': new FormControl('', Validators.required),
      'name':new FormControl('', Validators.required),
      'Bcc': new FormControl(''),
      'Cc': new FormControl(''),
      'subject':new FormControl('',Validators.required),
      'body': new FormControl('', Validators.required),
      'files':new FormControl('', Validators.required),
      'fileName':new FormControl(''),
      'footer': new FormControl(''),
      'regardsFrom': new FormControl('', Validators.required),
      'createdBy': new FormControl('')
    })
  }

  userForm!: FormGroup;
  

  @ViewChild('mailItemsDialog') mailItemsDialog = {} as TemplateRef<any>;
  // openButton() {
  //   this.dialog.open(this.mailItemsDialog)
   
  // }

  openButton() {
   this.dialog.open(this.mailItemsDialog, {
      width:'30%',
      // height:'80%',
      height:'90vh',
      position: { right: '10px', top: '150px' }
    });
    // this.userForm.reset()
  }


  openForm:boolean = false;
  openForm2:boolean = false;
  // openFirst() {
  //   this.openForm = ! this.openForm
  //   }
    openFirst() {
      console.log(this.openForm)
      // Toggle visibility of BCC field
      this.openForm = !this.openForm;
      
      if (!this.openForm) {
        // Reset BCC field when closing
        this.userForm.get('Bcc')?.setValue('');
      }
    }
  
    openSecond() {
      this.openForm2 = !this.openForm2;
      
      if (!this.openForm2) {
        this.userForm.get('Cc')?.setValue('');  // Using optional chaining
      }
    }

  submit() {
    // console.log(this.userForm.value)
    if(this.userForm.valid) {
      // this.alert.wait();
      this.adver.postMail(this.userForm.value, this.selectedFile).subscribe((res:any)=> {
        // console.log(res)
        // this.resetFields();
        if(res.statusCode == 200) {
          this.alert.success(res.message)
        }
      },(err:any)=> {
        this.alert.error(err)
      })
    } 
   
  }


  resetFields() {
    // Reset form fields and hide BCC and CC
    // this.userForm.reset();
    this.openForm = false;   // Ensure BCC field is hidden
    this.openForm2 = false;  // Ensure CC field is hidden
  }

  selectedFile:any = [];
  fileUpload(event:any) {
    // console.log(event.target.files[0])
    this.selectedFile = event.target.files[0]
  }

}
