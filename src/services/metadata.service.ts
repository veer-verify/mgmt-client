import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MetadataService {
  
  constructor(private http: HttpClient) { }
  
  // baseUrl = `${environment.adsAndInventoryUrl}/metadata`;

  getMetadata() {
    let url = environment.metadataUrl + '/getValuesListByType_1_0';
    return this.http.get(url);
  }

  getMetadataByType(payload: any) {
    let url = environment.metadataUrl + '/getValuesListByType_1_0';
    let params = new HttpParams().set('type', payload);
    return this.http.get(url, {params: params});
  }

  listMetadataTypes() {
    let url = environment.metadataUrl + '/listMetadataTypes_1_0';
    return this.http.get(url);
  }

  addMetadataTypes(payload: any) {
    let url = environment.metadataUrl + '/addMetadataTypes_1_0';
    return this.http.post(url, payload);
  }

  add(payload: any) {
    let url = environment.metadataUrl + '/addMetadataKeyValue_1_0';
    return this.http.post(url, payload);
  }

  updateMetadataKeyValue(payload: any) {
    let url = environment.metadataUrl + '/updateMetadataKeyValue_1_0';
    return this.http.put(url, payload);
  }
}
