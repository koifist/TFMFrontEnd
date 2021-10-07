import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AssetsService {
  constructor(private http: HttpClient) {}

  getAssetTypes(): any {
    return this.http.get(environment.backendpoints.assetType, {
      headers: {
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
      },
    });
  }

  getAssets(): any {
    return this.http.get(environment.backendpoints.asset, {
      headers: {
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
      },
    });
  }

  createAsset(body: object): any {
    return this.http.post(environment.backendpoints.createAsset, body, {
      headers: {
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
      },
    });
  }

  updateAsset(id: string, body: object): any {
    return this.http.put(
      environment.backendpoints.updateAsset + '/' + id,
      body,
      {
        headers: {
          'cache-control': 'no-cache',
          'Content-Type': 'application/json',
        },
      }
    );
  }

  deleteAsset(id: string): any {
    return this.http.delete(environment.backendpoints.deleteAsset + '/' + id, {
      headers: {
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
      },
    });
  }
}
