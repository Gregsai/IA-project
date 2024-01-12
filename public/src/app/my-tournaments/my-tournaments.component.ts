import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-tournaments',
  templateUrl: './my-tournaments.component.html',
  styleUrls: ['./my-tournaments.component.css']
})
export class MyTournamentsComponent implements OnInit {
  isLoggedIn: boolean = false;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    ) {}

  ngOnInit() {
    this.authService.isLoggedIn().subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
      if(!this.isLoggedIn) {
        this.authService.setRedirectUrl('/my-tournaments');
        this.router.navigateByUrl('/sign-in');
      }
    });
  }

}
