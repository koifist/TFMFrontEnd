import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class IncidentsService {
  constructor(private http: HttpClient) {}

  getMatrix(): any {
    return this.http.get(environment.backendpoints.matrix, {
      headers: {
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
      },
    });
  }

  getIncidents(): any {
    return this.http.get(environment.backendpoints.incident, {
      headers: {
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
      },
    });
  }

  createIncident(body: object): any {
    return this.http.post(environment.backendpoints.createIncident, body, {
      headers: {
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
      },
    });
  }

  updateIncident(id: string, body: object): any {
    return this.http.put(
      environment.backendpoints.updateIncident + '/' + id,
      body,
      {
        headers: {
          'cache-control': 'no-cache',
          'Content-Type': 'application/json',
        },
      }
    );
  }

  closeIncident(id: string): any {
    return this.http.put(environment.backendpoints.closeIncident + '/' + id, {
      headers: {
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
      },
    });
  }

  deleteIncident(id: string): any {
    return this.http.delete(
      environment.backendpoints.deleteIncident + '/' + id,
      {
        headers: {
          'cache-control': 'no-cache',
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
