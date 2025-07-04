import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/services/alert.service';
import { MetadataService } from 'src/services/metadata.service';
import { SiteService } from 'src/services/site.service';
import { StorageService } from 'src/services/storage.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private userSer: UserService,
    private siteSer: SiteService,
    private fb: FormBuilder,
    private router: Router,
    private alertSer: AlertService,
    private metaDataSer: MetadataService,
    private storageSer: StorageService
  ) { }

  user = null;
  showLoader: boolean = false;
  loginForm!: FormGroup;

  ngOnInit() {
    this.storageSer.clearData();
    
    this.loginForm = this.fb.group({
      userName: this.fb.control('', Validators.required),
      password: this.fb.control('', Validators.required),
      callingSystemDetail: ['mgmt']
    });
  }

  showPassword: boolean = false;
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  forgotPassVisible: boolean = false;
  userData:any 
  loginNew() {
    if(this.loginForm.valid) {
      this.showLoader = true;
      this.userSer.loginNew(this.loginForm.value).subscribe((res: any) => {
        this.showLoader = false;
        if(res.Status == 'Success') {
          this.storageSer.set('user', res);
          this.storageSer.set('acTok', res.AccessToken ?? '')
          this.router.navigate(['/dashboard/devices']);
          this.userData = res;
          this.getSitesListForUserName();
          this.get_roles()
          this.getMetadata();
        } else if(res.Status == 'Failed') {
          this.alertSer.snackWarn(res);
        }
      }, (err: any) => {
        this.showLoader = false;
        this.alertSer.snackError(err);
      })
    }
  }
  
  getSitesListForUserName() {
    this.siteSer.getSitesListForUserName().subscribe((res: any) => {
      if(res.Status == 'Success') {
        this.storageSer.set('siteIds', res.sites);
      }
    }, (err: any) => {
      // console.log(err)
    })
  }
  
  getMetadata() {
    this.metaDataSer.getMetadata().subscribe((res: any) => {
      this.storageSer.set('metaData', res);
      this.userSer.can_getdata.emit('dasndkjs')
    })
  }

  rolesDetailsData:any = [];
  get_roles() {
    this.userSer.get_roles(this.userData).subscribe((res: any) => {
      this.rolesDetailsData = res.rolesDetails;
      // console.log(this.rolesDetailsData)
      if(res.status == 'Success'){
        this.storageSer.set('role', res.rolesDetails)
      }
    })
  }


}
