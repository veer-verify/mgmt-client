import { DatePipe, formatDate } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuditService {

  constructor(private http: HttpClient, private date: DatePipe, private storageSer: StorageService) { }

  listUsersByDepartment(payload: any) {
    let url = `${environment.eventsData}/listUsersByDepartment_1_0`;
    let params = new HttpParams();
    params = params.set('deptId', payload?.deptId);
    // console.log(this.http.get(url, {params}))
    return this.http.get(url, { params });
    // params.set('deptId',22);
    // let l2 = this.http.get(url, {params: params})
    // return ({...l1, ...l2});
  }

  userLoginCount(payload: any) {
    let url = `${environment.authUrl}/userLoginCount_1_0`;
    let params = new HttpParams();
    if (payload?.fromDate) {
      params = params.set('fromDate', formatDate(payload.fromDate, 'yyyy-MM-dd', 'en-US'))
    }
    if (payload?.toDate) {
      params = params.set('toDate', formatDate(payload?.toDate, 'yyyy-MM-dd', 'en-US'))
    }
    if (payload?.client) {
      params = params.set('userId', payload?.client)
    }
    if (payload?.device) {
      params = params.set('callingSystem', payload?.device)
    }

    return this.http.get(url, { params })

  }

}
