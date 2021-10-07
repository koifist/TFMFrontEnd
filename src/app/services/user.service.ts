import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private router: Router) { }
  getUser(): any {
    return this.http.get(environment.backendpoints.getUser, {
      headers: {
        'cache-control': 'no-cache',
        'Content-Type': 'application/json'
      }
    });
  }
  login(username: string, password: string): any {
    return this.http.post(environment.backendpoints.login,
      {
        username,
        password
      }, {
        headers: {
          'cache-control': 'no-cache',
          'Content-Type': 'application/json'
        }
      });
  }
  register(username: string, password: string): any {
    return this.http.post(environment.backendpoints.register,
      {
        username,
        password
      }, {
        headers: {
          'cache-control': 'no-cache',
          'Content-Type': 'application/json'
        }
      });
  }
  updatePass(password: string): any {
    return this.http.post(environment.backendpoints.updatePass,
      {
        password
      }, {
        headers: {
          'cache-control': 'no-cache',
          'Content-Type': 'application/json'
        }
      });
  }
  deleteUser(id: string): any {
    return this.http.delete(environment.backendpoints.deleteUser + '/' + id,
      {
        headers: {
          'cache-control': 'no-cache',
          'Content-Type': 'application/json'
        }
      });
  }
  activateUser(id: string): any {
    return this.http.post(environment.backendpoints.activateUser + '/' + id,
      {
        headers: {
          'cache-control': 'no-cache',
          'Content-Type': 'application/json'
        }
      });
  }
  updateRole(id: string, role: string): any {
    return this.http.post(environment.backendpoints.updateRole + '/' + id, {
      role
    }, {
      headers: {
        'cache-control': 'no-cache',
        'Content-Type': 'application/json'
      }
    });
  }
  logOut(): any {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.router.navigateByUrl('/home');
  }
}
