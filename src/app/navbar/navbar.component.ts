import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { TranslateService } from '@ngx-translate/core'
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public user: any;
  public options = false;
  public env = environment;
  constructor(private userService: UserService) { }

  ngDoCheck(): void {
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.user = JSON.parse(user);
    } else {
      this.user = '';
    }
    }
  ngOnInit() {
  }
  logOut(): void {
    this.userService.logOut();
  }
  activeOptions() {
    this.options = !this.options;
  }
}
