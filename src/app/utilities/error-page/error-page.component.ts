import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/services/storage.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-error-page',
  template: `
    <div class="page">
    <div class="box">
      <img src="assets/icons/Logo.svg" class="logo">
      <div class="errormsg">Oops.. Something went wrong, please try again.</div>
      <button class="generateBtn btn" (click)="loginpage()">Login</button>
    </div>
  </div>
  `,
  styles: [`
    .page{
      background: rgb(255, 255, 255);
      height: 100vh;
      width: 100vw;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .oops{
      margin-top: 50px;
      font-size: 50px;
      color: #2B2942;
      font-family: 'TP',sans-serif;
      font-weight: 600;
    }
    .errormsg{
      margin-top: 16px;
      font-family: MS,sans-serif;
      color:dimgrey;
      font-size: 30px;
      font-weight: 800;
    }

    .btn{
      padding: 0 15px;
      border: 12px solid #104B86;
      margin-top: 20px !important;
      border-radius: 30px;
      background:#104B86;
      letter-spacing: 1px;
      color: #fff;
      font-size: 14px;
      -webkit-box-shadow: 2px 2px 0px 0px rgba(187,187,187,0.96);
      -moz-box-shadow: 2px 2px 0px 0px rgba(187,187,187,0.96);
      box-shadow: 2px 2px 0px 0px rgba(187,187,187,0.96);
    }
    .box{
      display: grid;
      text-align: center;
      justify-items: center;
    }
    .logo{
      margin-bottom: 40px;
      height: 40px;
      position: absolute;
      top: 25px;
      left: 35px;
    }
  `]
})
export class ErrorPageComponent implements OnInit {

  constructor(
    private router: Router,
    private userSer: UserService,
    private storageSer: StorageService
  ) { }

  httpError: any;
  ngOnInit(): void {
    this.userSer.error$.subscribe((res: any)=>{
      this.httpError = res;
    });
  }

  public loginpage(){
    this.userSer.logout();
    this.router.navigateByUrl('/login');
  }

}
