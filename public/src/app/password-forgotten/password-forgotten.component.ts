import { Component } from '@angular/core';

@Component({
  selector: 'app-password-forgotten',
  templateUrl: './password-forgotten.component.html',
  styleUrl: './password-forgotten.component.css'
})
export class PasswordForgottenComponent {
  email: string = '';

  resetPassword() {
    console.log('Form submitted!');
    console.log('Email:', this.email);
  }
}
