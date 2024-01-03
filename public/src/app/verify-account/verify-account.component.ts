import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';

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
    history.replaceState({}, '', '/');
  }

  verifyAccount(): void {
    this.authenticationService.verifyAccount(this.token)
      .subscribe(
        (response : any) => {
          console.log('Account verified:', response);
          this.message = response.message;
          this.showMessage = true;
          setTimeout(() => {
            this.showMessage = false;
            this.message = '';
          }, 5000);
        },
        (error) => {
          console.error('Error verifying account:', error);
          this.message = error.message;
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
