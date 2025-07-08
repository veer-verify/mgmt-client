import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  can_getdata: any = new EventEmitter();
  error$ = new BehaviorSubject<string>('');

  constructor(
    private http: HttpClient,
    private router: Router,
    private storageSer: StorageService
  ) { }

  // baseUrl = environment.authUrl;

  loginNew(payload: any) {
    let url = environment.authUrl + `/user_login_1_0`;
    let credentials = new Map();
    credentials.set('userName', payload?.userName);
    // credentials.set('password', btoa(JSON.stringify(payload?.password)));
    credentials.set('password', payload?.password);
    credentials.set('callingSystemDetail', 'mgmt');
    return this.http.post(url, Object.fromEntries(credentials));
  }

  logout() {
    this.router.navigate(['./login']);
  }

  getAuthStatus() {
    let user = this.storageSer.get('user');
    if (user == null) {
      return false;
    } else {
      return true;
    }
  }

  onHTTPerror(e: any) {
    this.error$.next(e)
    this.router.navigateByUrl('/error-page');
  }

  listUsers(userId?: number) {
    let url = environment.authUrl + '/listUsers_1_0';
    let params = new HttpParams();
    if (userId) {
      params = params.set('userId', userId)
    }
    return this.http.get(url, {params: params});
  }

  listUsersByRole() {
    let url = environment.authUrl + '/listUsersByRole_1_0';
    let params = new HttpParams().set('roleId', 30);
    return this.http.get(url, { params: params });
  }

  createUser(payload: any) {
    let url = `${environment.authUrl}/createUser_1_0`;
    // let url = 'http://192.168.0.232:8922/createUser_1_0';
    var user: any = this.storageSer.get('user');
    payload.createdBy = user.UserId;
    return this.http.post(url, payload);
  }

  getUserInfoForUserId(payload: any) {
    var user: any = this.storageSer.get('user');
    let url = `${environment.authUrl}/getUserInfoForUserId_1_0/${payload?.userId}`;
    return this.http.get(url);
  }

  updateUser(payload: any) {
    let url = `${environment.authUrl}/updateUser_1_0/${payload?.userId}`;
    return this.http.put(url, payload);
  }

  deleteUser(payload: any) {
    let url = `${environment.authUrl}/deactivateUser_1_0/${payload?.user_id}`;
    return this.http.post(url, null);
  }

  applySitesMapping(payload: any) {
    let url = `${environment.authUrl}/applySitesMapping_1_0`;
    return this.http.post(url, payload);
  }

  unassignSiteForUser(payload: any) {
    let url = `${environment.authUrl}/unassignSiteForUser_1_0`;
    return this.http.post(url, payload);
  }

  getSiteUserDetails(payload: any) {
    let url = `${environment.authUrl}/getUsersDetailsForSiteId_1_0/${payload.siteId}`;
    return this.http.get(url);
  }

  // getSitesListforUser(payload: any) {
  //   var user: any = this.storageSer.get('user');
  //   let url = `${this.baseUrl}/getSitesListforUser_1_0/${payload?.userId}`;
  //   return this.http.get(url);
  // }

  // getSitesListForUserName(payload: any) {
  //   let url = `${this.baseUrl}/getSitesListForUserName_1_0`;
  //   let params = new HttpParams().set('userName', payload?.UserName);
  //   return this.http.get(url, {params: params});
  // };


  get_roles(payload: any) {
    let url = `${environment.authUrl}/getRolesByUserId_1_0`;
    let params = new HttpParams()
    if (payload.UserId) {
      params = params.set('userId', payload.UserId)
    }
    if (payload.roleId) {
      params = params.set('roleId', payload.roleId)
    }
    // if(payload.deptId){
    //   params = params.set('deptId', payload.deptId)
    // }
    return this.http.get(url, { params: params })
  }

  getSitesListForGlobalAccountId(payload: any) {
    // let url = 'http://192.168.0.232:8922/getSitesListForGlobalAccountId_1_0/'
    let url = environment.authUrl + '/getSitesListForGlobalAccountId_1_0/';
    // var user = this.storageService.get('user');
    let params = new HttpParams();
    if (payload?.userId) {
      params = params.set('userId', payload?.userId)
    }
    if (payload?.loginId) {
      params = params.set('loginId', payload?.loginId)
    }
    if (payload?.assigned !== null) {
      params = params.set('assigned', payload?.assigned)
    }
    params = params.set('callingSystemDetail', 'mgmt')
    return this.http.get(url, { params: params });
  }

  getAccessforRefreshToken(payload: any): Observable<any> {
    let url = environment.authUrl + '/getAccessforRefreshToken';
    let params = new HttpParams().set('refresh_token', payload?.RefreshToken).set('modifiedBy', payload?.UserId);
    return this.http.post(url, null, { params: params });
  }


  createUserWithShortDetails(payload: any) {
    let url = `${environment.authUrl}/createUserWithShortDetails_1_0`;
    // var user: any = this.storageSer.get('user');
    // payload.accountId = user?.accountId ?? 0;
    // payload.createdBy = user.UserId;
    return this.http.post(url, payload);
  }

  userDetailslistRoles_1_0() {
    let url = `${environment.authUrl}/listRoles_1_0`;
    return this.http.get(url);
  }

  getDepartments(payload?: any) {
    let url = `${environment.authUrl}/getDepartments_1_0`;
    let params = new HttpParams();
    if (payload) {
      params = params.set('department', payload)
    }

    return this.http.get(url, { params: params });
  }


}
