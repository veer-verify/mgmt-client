import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { StorageService } from 'src/services/storage.service';
import { UserService } from 'src/services/user.service';
import { MailComponent } from '../mail/mail.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(
    private userSer: UserService,
    private router: Router,
    public storageSer: StorageService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) { }


  user: any;
  ngOnInit(): void {
    this.user = this.storageSer.get('user');
  }

  logout() {
    this.userSer.logout();
  }

  openButton() {
    this.dialog.open(MailComponent)
  }

}
