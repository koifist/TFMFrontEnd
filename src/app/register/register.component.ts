import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  public registerForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required),
  });
  public hide1 = true;
  public hide2 = true;
  constructor(
    private toastr: ToastrService,
    private userService: UserService,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {}
  register(): void {
    if (this.registerForm.valid) {
      if (
        this.registerForm.get('password')?.value ===
        this.registerForm.get('confirmPassword')?.value
      ) {
        this.userService
          .register(
            this.registerForm.get('username')?.value,
            this.registerForm.get('password')?.value
          )
          .pipe(first())
          .subscribe(
            (res: any) => {
              this.toastr.success(this.translate.instant("toastr.registerSuccess"));
              this.router.navigateByUrl('/home');
            },
            (err: { status: number }) => {
              if (err.status === 400) {
                this.toastr.error(
                  this.translate.instant('toastr.registerError')
                );
              } else {
                this.toastr.error(this.translate.instant('toastr.serverError'));
              }
            }
          );
      } else {
        this.toastr.error(this.translate.instant('toastr.passMatch'));
      }
    } else {
      if (
        this.registerForm.get('username')?.errors &&
        this.registerForm.get('username')?.errors?.email
      ) {
        this.toastr.error(this.translate.instant('toastr.emailError'));
      } else {
        this.toastr.error(this.translate.instant('toastr.userPassError'));
      }
    }
  }
}
