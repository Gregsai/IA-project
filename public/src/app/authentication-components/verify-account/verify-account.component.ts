import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../authentication.service';

@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.component.html',
  styleUrls: ['./verify-account.component.css']
})
export class VerifyAccountComponent {
  token: string = '';
  showMessage: boolean = false;
  message: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.token = params['token'];
    });
    this.verifyAccount();
  }

  verifyAccount(): void {
    console.log('Verification in progress');
    this.authenticationService.verifyAccount(this.token)
      .subscribe(
        (response: any) => {
          this.message = response.message;
          this.showMessage = true;
          setTimeout(() => {
            this.showMessage = false;
            this.message = '';
            this.router.navigateByUrl('', { replaceUrl: true });
          }, 5000);
        },
        (error) => {
          console.error('Error verifying account:', error);
          this.message = "Error verifying account. Please send again the account verification email.";
          this.showMessage = true;
          setTimeout(() => {
            this.showMessage = false;
            this.message = '';
          }, 5000);
        }
      );
  }


  navigateToHome(): void {
    this.router.navigateByUrl('', { replaceUrl: true });
  }
}
