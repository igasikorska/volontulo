import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../auth.service';

@Component({
  selector: 'volontulo-password-reset-confirm',
  templateUrl: './password-reset-confirm.component.html',
  styleUrls: ['./password-reset.component.scss'],
})
export class PasswordResetConfirmComponent implements OnInit {
  resetForm: FormGroup;
  uidb64: string;
  token: string;

  constructor(private activatedRoute: ActivatedRoute,
              private authService: AuthService,
              private router: Router,
              private fb: FormBuilder) {}

  ngOnInit() {
    this.activatedRoute.params
      .subscribe(params => {
        this.uidb64 = params.uidb64;
        this.token = params.token;
      });
    this.resetForm = this.fb.group({
      'passwords': this.fb.group({
        'password': this.fb.control(null, Validators.required),
        'confirmPassword': this.fb.control(null, Validators.required),
      }, {validator: this.checkPasswords})
    });
  }

  checkPasswords(group: FormGroup): {[key: string]: boolean} {
    const password = group.get('password').value;
    const confirmPassword = group.get('confirmPassword').value;
    return password === confirmPassword ? null : { notEqual: true }
  }

  onSubmit(): void {
    const password = this.resetForm.get('passwords.password').value;
    this.authService.confirmResetPassword(password, this.uidb64, this.token)
      .subscribe();
    this.router.navigate(['login']);
  }
  isFormInputInvalid(inputStringId: string): boolean {
    return this.resetForm.get(inputStringId).invalid && this.resetForm.get(inputStringId).touched;
  }
  arePasswordsNotEqual(): boolean {
    return this.resetForm.get('passwords.confirmPassword').dirty
      && this.resetForm.get('passwords').errors
      && this.resetForm.get('passwords').errors.notEqual;
  }
}
