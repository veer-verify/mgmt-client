import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from 'src/services/user.service';
import { StorageService } from 'src/services/storage.service';
import { catchError, filter, switchMap, take } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<any>(null);

  constructor(
    private router: Router,
    private authSer: UserService,
    private storageService: StorageService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token: string = this.storageService.get('acTok');

    if (token) {
      request = this.addToken(request, token);
    }

    return next.handle(request).pipe(catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(request, next);
        } else {
          return throwError(() => error);
        }
      })
    );
  }


  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }



  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    let currentUser = this.storageService.get('user');

    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      // this.storageService.table_loader_sub.next(true);
      return this.authSer.getAccessforRefreshToken(currentUser).pipe(
        switchMap((res: any) => {
          // this.storageService.table_loader_sub.next(false);
          this.storageService.set('acTok', res.access_token);
          this.isRefreshing = false;
          this.refreshTokenSubject.next(res.access_token);
          return next.handle(this.addToken(request, res.access_token));
        }),
        catchError((err) => {
          // this.storageService.table_loader_sub.next(false);
          this.isRefreshing = false;
          // this.authSer.logout();
          return throwError(() => err);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(accessToken => {
          return next.handle(this.addToken(request, accessToken));
        })
      );
    }
  }
}
