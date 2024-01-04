import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class AuthenticationService {
  private baseURL = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    ) {

    }

  validateEmailFormat(email: string): boolean{
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePasswordFormat(password: string): boolean{
    return password.length >= 4;
  }

  validateLastNameFormat(lastName: string): boolean{
    return lastName.length >= 1;
  }

  validateFirstNameFormat(firstName: string): boolean{
    return firstName.length >= 1;
  }

  emailAlreadyExists(email: string): Observable<boolean> {
    const emailAlreadyExistsUrl = `${this.baseURL}/authentication/email-already-exists`;
    const params = new HttpParams().set('email', email);
    return this.http.get<boolean>(emailAlreadyExistsUrl, { params });
  }

  emailVerified(email: string): Observable<boolean>{
    const emailVerifiedUrl = `${this.baseURL}/authentication/email-verified`;
    return this.http.get(emailVerifiedUrl, { params: { email } }) as Observable<boolean>;
  }

  signUp(signUpData: any) {
    const signUpURL = `${this.baseURL}/authentication/sign-up`;
    return this.http.post(signUpURL, signUpData);
  }

  signIn(signUpData: any) {
    const signInURL = `${this.baseURL}/authentication/sign-in`;
    return this.http.post(signInURL, signUpData);
  }

  sendVerificationEmail(email: string) {
    const sendVerificationEmailURL = `${this.baseURL}/authentication/send-verification-email`;
    return this.http.post(sendVerificationEmailURL, { email });
  }

  sendResetPasswordEmail(email: string) {
    const sendResetPasswordEmailURL = `${this.baseURL}/authentication/send-reset-password-email`;
    return this.http.post(sendResetPasswordEmailURL, { email });
  }

  resetPassword(token: string, password: string) {
    const resetPasswordURL = `${this.baseURL}/authentication/reset-password`;
    return this.http.post(resetPasswordURL, { token, password });
  }

  verifyAccount(token: string) {
    const verifyAccountURL = `${this.baseURL}/authentication/verify-account/${token}`;
    return this.http.get(verifyAccountURL);
  }
}
