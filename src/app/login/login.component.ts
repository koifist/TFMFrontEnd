import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public loginForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });
  public hide = true;
  constructor(
    private toastr: ToastrService,
    private userService: UserService,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit() {}

  login(): void {
    if (this.loginForm.valid) {
      this.userService
        .login(
          this.loginForm.get('username')?.value,
          this.loginForm.get('password')?.value
        )
        .pipe(first())
        .subscribe(
          (res: { token: string; currentUser: any }) => {
            localStorage.setItem('token', res.token);
            localStorage.setItem(
              'currentUser',
              JSON.stringify(res.currentUser)
            );
            this.toastr.success(this.translate.instant("toastr.loginSuccess"));
            this.router.navigateByUrl('/dashboard');
          },
          (err: { status: number }) => {
            if (err.status === 405) {
              this.toastr.error(this.translate.instant("toastr.loginError"));
            } else {
              this.toastr.error(this.translate.instant("toastr.serverError"));
            }
          }
        );
    } else {
      if (
        this.loginForm.get('username')?.errors &&
        this.loginForm.get('username')?.errors?.email
      ) {
        this.toastr.error(this.translate.instant("toastr.emailError"));
      } else {
        this.toastr.warning(this.translate.instant("toastr.userPassError"));
      }
    }
  }
}
