import { Component } from '@angular/core';
import { AuthenticationService } from '../../authentication.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  userLoggedIn : string = 'none'
  authState: string = 'sign-in'

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
    ) {
  }
  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.checkLoginStatus();
      this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkLoginStatus();
      });
    } else {
    }
  }


  checkLoginStatus() {
    this.authenticationService.isLoggedIn().subscribe(
      (response: any) => {
        if (response && response.authenticated) {
          this.userLoggedIn = 'connected';
        } else {
          this.userLoggedIn = 'disconnected';
        }
      },
      (error) => {
        this.userLoggedIn = 'disconnected';
      }
    );
  }

  logOut(): void {
      this.authenticationService.logOut().subscribe(()=> {
        this.checkLoginStatus();
        window.location.reload();
      })
    }
}
