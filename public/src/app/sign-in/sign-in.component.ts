import { Component } from '@angular/core';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {
  email: string = '';
  password: string = '';

  signIn() {
    console.log('Form submitted!');
    console.log('Email:', this.email);
    console.log('Password:', this.password);
  }
}
