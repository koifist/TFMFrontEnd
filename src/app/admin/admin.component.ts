import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  public users = [];
  public loading = true;
  public env = environment;
  constructor(
    private toastr: ToastrService,
    private userService: UserService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.getUsers();
  }
  getUsers() {
    this.loading = true;
    this.userService
      .getUser()
      .pipe(first())
      .subscribe(
        (res: any) => {
          this.users = res;
          this.loading = false;
        },
        (err: { status: number }) => {
          this.toastr.error(this.translate.instant('toastr.serverError'));
        }
      );
  }
  changeUserRol(userId: string, rol: string) {
    this.userService
      .updateRole(userId, rol)
      .pipe(first())
      .subscribe(
        (res: any) => {
          this.toastr.success(this.translate.instant('toastr.userrolSuccess'));
          this.getUsers();
        },
        (err: { status: number }) => {
          this.toastr.error(this.translate.instant('toastr.serverError'));
        }
      );
  }

  activateUser(userId: string) {
    this.userService
      .activateUser(userId)
      .pipe(first())
      .subscribe(
        (res: any) => {
          this.toastr.success(this.translate.instant('toastr.useractivationSuccess'));
          this.getUsers();
        },
        (err: { status: number }) => {
          this.toastr.error(this.translate.instant('toastr.serverError'));
        }
      );
  }

  desactivateUser(userId: string) {
    this.userService
      .deleteUser(userId)
      .pipe(first())
      .subscribe(
        (res: any) => {
          this.toastr.success(this.translate.instant('toastr.userdesactivationSuccess'));
          this.getUsers();
        },
        (err: { status: number }) => {
          this.toastr.error(this.translate.instant('toastr.serverError'));
        }
      );
  }

}
