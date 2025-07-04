import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  config: MatSnackBarConfig;

  constructor(private snackbar: MatSnackBar, private zone: NgZone) {
    this.config = new MatSnackBarConfig();
    this.config.panelClass = ["snackbar-container"];
    this.config.verticalPosition = "bottom";
    this.config.horizontalPosition = "center";
  }

  snackSuccess(data: any) {
    this.config.panelClass = ["snackbar-container", "success"];
    this.config.duration = 3000;
    this.show(data);
    
  }

  snackError(data: any) {
    this.config.panelClass = ["snackbar-container", "error"];
    this.config.duration = 10000;
    this.show(data?.error?.message ?? 'Failed');
  }

  snackWarn(data: any) {
    this.config.panelClass = ["snackbar-container", "warning"];
    this.config.duration = 10000;
    this.show(data?.message ?? 'Failed');
  }

  show(message: any) {
    this.zone.run(() => {
      this.snackbar.open(message, "x", this.config);
    });
  }


  /* sweet alert */
  error(message: any) {
    Swal.fire({
      icon: 'error',
      title: 'Failed!',
      text: message,
      showCloseButton: true
    })
  }

  success(message: any) {
    Swal.fire({
      icon: 'success',
      title: `Done!`,
      text: `${message}`,
      showCloseButton: true,
      timer: 1500
    })
  }

  ruleSubject: Subject<boolean> = new Subject();
  successMessage(message: any) {
    Swal.fire({
      icon: 'success',
      title: "Advertisement Created Successfully",
      text: `${message}`,
      // showDenyButton: true,
      showCancelButton: true,
      // denyButtonText: "Use scheduled playback",
      confirmButtonText: "Do you want to add rules for this advertisement?",
    }).then((res) => {
      if (res.isConfirmed) {
        this.ruleSubject.next(true);
      }
    });
  }

  wait() {
    Swal.fire({
      text: "Please wait",
      imageUrl: "assets/gif/ajax-loading-gif.gif",
      showConfirmButton: false,
      allowOutsideClick: false
    })
  }

  confirmDialog(message: string) {
    return Swal.fire({
      title: message,
      // text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      color: 'red',
    })
  }

}
