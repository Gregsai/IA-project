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
      this.checkLoginStatus2();
      this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkLoginStatus2();
      });
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



  checkLoginStatus2() {
    this.authenticationService.isLogin().subscribe(
      (response: any) => {
        if (response && response.authenticated) {
          this.userLoggedIn = 'connected';
        } else {
          this.userLoggedIn = 'disconnected';
        }
      },
      (error) => {
        console.error('Error checking login status:', error);
        this.userLoggedIn = 'disconnected';
      }
    );
  }

  logOut2(): void {
      this.authenticationService.logOut2().subscribe(()=> {
        this.checkLoginStatus2();
        window.location.reload();
      })
    }
}
