import { Component } from '@angular/core';
import { AuthenticationService } from '../../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  displayErrorMessage: boolean = true;
  disableButton: boolean = false;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  signIn() {
    this.disableButton = true;
    setTimeout(() => {
      this.disableButton = false;
    }, 5000);

    const signInData = {
      email: this.email,
      password: this.password,
    };

    if (!this.authenticationService.validateEmailFormat(this.email)) {
      this.errorMessage =
        'Please enter a valid email (eg.. john.doe@gmail.com)';
    } else if (
      !this.authenticationService.validatePasswordFormat(this.password)
    ) {
      this.errorMessage =
        'Please enter a valid password (at least 4 characters)';
    } else {
      this.authenticationService.emailAlreadyExists(this.email).subscribe(
        (response: any) => {
          if (!response.exists) {
            this.errorMessage = 'This email is not affiliated with any account';
          } else {
            this.authenticationService.emailVerified(this.email).subscribe(
              (response: any) => {
                if (!response.verified) {
                  this.router.navigateByUrl(
                    `/verify-account/${this.email}/send-email`,
                    { replaceUrl: true }
                  );
                  return;
                } else {
                  this.attemptSignIn(signInData);
                }
              },
              (error) => {
                console.error(
                  'Error while checking email verification:',
                  error
                );
                this.errorMessage = 'Error while checking email verification.';
              }
            );
          }
        },
        (error) => {
          console.error('Error while checking email existence:', error);
          this.errorMessage = 'Error while checking email existence.';
        }
      );
    }

    if (this.errorMessage !== '') {
      this.displayErrorMessage = true;
      setTimeout(() => {
        this.displayErrorMessage = false;
        this.errorMessage = '';
      }, 5000);
      return;
    }
  }

  redirectToPasswordForgotten(event: Event) {
    event.preventDefault();
    this.router.navigateByUrl('/password-forgotten', { replaceUrl: true });
  }
  redirectToSignUp(event: Event) {
    event.preventDefault();
    this.router.navigateByUrl('/sign-up', { replaceUrl: true });
  }


  attemptSignIn(signInData: any) {
    this.authenticationService.signIn(signInData).subscribe(
      (response: any) => {
        if (response && response.token) {
          console.log(response.token);
          const redirectUrl = this.authenticationService.getRedirectUrl();
          this.router.navigateByUrl(redirectUrl, { replaceUrl: true }).then(() => {
            window.location.reload();
          });
        }
      },
      (error) => {
        console.error('Error during sign in:', error);
        this.errorMessage = 'Password is incorrect';
        this.displayErrorMessage = true;
        setTimeout(() => {
          this.displayErrorMessage = false;
          this.errorMessage = '';
        }, 5000);
      }
    );
  }
}
