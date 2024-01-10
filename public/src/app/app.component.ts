import { Component } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'public';
  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {}
  goToMyTournaments() {
    if (!this.authService.isLoggedIn()) {
      this.authService.setRedirectUrl('/my-tournaments');
      this.router.navigateByUrl('/sign-in');
    } else {
      this.router.navigateByUrl('/my-tournaments');
    }
  }
}
