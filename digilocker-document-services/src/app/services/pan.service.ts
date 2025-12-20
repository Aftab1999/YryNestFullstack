import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface PanRequest {
  fullName: string;
  dateOfBirth: string;
  requestType: 'NEW' | 'CORRECTION';
  status?: string;
  documentUrl?: string;
  user?: {
    id: number;
    email: string;
    name: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class PanService {
  private apiUrl = `${environment.apiUrl}/pan`;

  constructor(private http: HttpClient) {}

  submitPanRequest(formData: PanRequest): Observable<any> {
    return this.http.post(this.apiUrl, formData).pipe(
      map(response => response)
    );
  }
}
