import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
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
    if (typeof window !== 'undefined') {
      history.replaceState({}, '', '/reset-password');
    } else {
    }
  }

  resetPassword(): void {
    if (this.password !== this.confirmPassword) {
      this.handleErrorMessage('Passwords do not match');
      return;
    } else if (!this.authenticationService.validatePasswordFormat(this.password)) {
      this.handleErrorMessage('Password must be at least 4 characters long');
      return;
    }

    this.authenticationService.resetPassword(this.token, this.password)
      .subscribe(
        (response: any) => {
          this.handleSuccessMessage(response.message);
          this.navigateToHome();
        },
        (error) => {
          this.handleErrorMessage(error.message);
        }
      );
  }

  handleSuccessMessage(message: string): void {
    this.message = message;
    this.showMessage = true;
    setTimeout(() => {
      this.hideMessage();
      this.resetParameters();
      this.navigateToHome();
    }, 5000);
  }

  handleErrorMessage(message: string): void {
    this.errorMessage = message;
    this.showErrorMessage = true;
    setTimeout(() => {
      this.hideMessage();
      this.resetParameters();
    }, 5000);
  }

  hideMessage(): void {
    this.showMessage = false;
    this.showErrorMessage = false;
    this.message = '';
    this.errorMessage = '';
  }

  resetParameters(): void {
    this.password = '';
    this.confirmPassword = '';
  }

  navigateToHome(): void {
    this.router.navigateByUrl('', { replaceUrl: true });
  }

  redirectToHome(event: Event): void {
    event.preventDefault();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }
}

