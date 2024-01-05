import { Component } from '@angular/core';
import { AuthenticationService } from '../../authentication.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  userLoggedIn : string = 'none'
  authState: string = 'sign-in'

  constructor(private authenticationService: AuthenticationService) {
  }
  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.checkLoginStatus();
    } else {
    }
  }

  checkLoginStatus() {
      if (this.authenticationService.isLoggedIn()) {
        this.userLoggedIn = 'connected';
      }else{
        this.userLoggedIn = 'disconnected';
      }
    }

  logOut(): void {
    this.authenticationService.logOut();
    this.checkLoginStatus();
    window.location.reload();
  }
}
