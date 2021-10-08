import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  getDashboardInfo(): any {
    return this.http.get(environment.backendpoints.dashboard, {
      headers: {
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
      },
    });
  }
}
