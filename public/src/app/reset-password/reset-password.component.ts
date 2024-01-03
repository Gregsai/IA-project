import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  token: string = '';
  showMessage: boolean = false;
  message: string = '';
  showErrorMessage: boolean = false;
  errorMessage: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.token = params['token'];
    });
    history.replaceState({}, '', '/');
  }

  resetPassword(): void {
    const PasswordData = {
      password: this.password,
      confirmPassword: this.confirmPassword
    }
    if (this.password !== this.confirmPassword) {
      this.resetParameters();
      this.showErrorMessage = true;
      this.errorMessage = 'Passwords do not match';
      setTimeout(() => {
        this.showErrorMessage = false;
        this.errorMessage = '';
      }, 5000);
      return;
    }
    else if (!this.authenticationService.validatePasswordFormat(this.password)){
      this.resetParameters();
      this.showErrorMessage = true;
      this.errorMessage = 'Password must be at least 4 characters long';
      setTimeout(() => {
        this.showErrorMessage = false;
        this.errorMessage = '';
      }, 5000);
      return;
    }
    this.authenticationService.resetPassword(this.token, this.password)
      .subscribe(
        (response : any) => {
          console.log('Password reset:', response);
          this.message = response.message;
          this.showMessage = true;
          setTimeout(() => {
            this.showMessage = false;
            this.message = '';
            this.resetParameters();
            this.navigateToHome();
          }, 5000);
        },
        (error) => {
          this.resetParameters();
          console.error('Error resetting password:', error);
          this.message = error.message;
          this.showMessage = true;
          setTimeout(() => {
            this.showMessage = false;
            this.message = '';
          }, 5000);
        }
      );
  }

  resetParameters():void {
    this.password = '';
    this.confirmPassword = '';
  }

  navigateToHome(): void {
    this.router.navigateByUrl('', { replaceUrl: true });
  }
}
