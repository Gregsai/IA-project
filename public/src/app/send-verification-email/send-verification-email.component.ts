import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-send-verification-email',
  templateUrl: './send-verification-email.component.html',
  styleUrl: './send-verification-email.component.css'
})

export class SendVerificationEmailComponent implements OnInit {
  email: string = '';
  showMessage: boolean = false;
  disableButton: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.email = params['email'];
    });
    history.replaceState({}, '', '/verify-account');
  }



  sendEmail(): void {
    this.disableButton = true;
    setTimeout(() => {
      this.disableButton = false;
    }, 5000);
    this.authenticationService.sendVerificationEmail(this.email)
      .subscribe(
        (response) => {
          this.showMessage = true;
          setTimeout(() => {
            this.showMessage = false;
          }, 5000);
        },
        (error) => {
          console.error('Error sending confirmation email:', error);
        }
      );
  }

  navigateToHome(): void {
    this.router.navigateByUrl('', { replaceUrl: true });
  }
}
