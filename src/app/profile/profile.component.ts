import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  public profileForm = new FormGroup({
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required),
  });
  public user: any;
  public hide1 = true;
  public hide2 = true;
  constructor(
    private toastr: ToastrService,
    private userService: UserService,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.user = JSON.parse(user);
    } else {
      this.user = '';
    }
  }
  updatePass(): void {
    if (this.profileForm.valid) {
      if (
        this.profileForm.get('password')?.value ===
        this.profileForm.get('confirmPassword')?.value
      ) {
        this.userService
          .updatePass(this.profileForm.get('password')?.value)
          .pipe(first())
          .subscribe(
            (res: any) => {
              this.toastr.success(this.translate.instant("toastr.passSuccess"));
              this.router.navigateByUrl('/home');
            },
            (err: { status: number }) => {
              this.toastr.error(this.translate.instant('toastr.serverError'));
            }
          );
      } else {
        this.toastr.error(this.translate.instant('toastr.passMatch'));
      }
    } else {
      this.toastr.error(this.translate.instant('toastr.userPassError'));
    }
  }
  logOut() {
    this.userService.logOut();
  }
}
