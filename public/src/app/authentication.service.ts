import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private baseURL = 'http://localhost:3000';
  private tokenKey = 'auth_token';
  private expirationKey = 'auth_token_expiration';
  private redirectUrl: string = '/';

  constructor(private http: HttpClient) {}

  setRedirectUrl(url: string): void {
    this.redirectUrl = url;
  }

  getRedirectUrl(): string {
    return this.redirectUrl;
  }

  storeToken(token: string, expirationDate: Date): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.expirationKey, expirationDate.toISOString());
  }

  logOut() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.expirationKey);
  }
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getTokenExpiration(): Date | null {
    const expiration = localStorage.getItem(this.expirationKey);
    return expiration ? new Date(expiration) : null;
  }

  updateToken(token: string, expirationDate: Date): void {
    this.storeToken(token, expirationDate);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    const expiration = this.getTokenExpiration();

    if (!token || !expiration) {
      return false;
    }

    return new Date() < expiration;
  }
  validateEmailFormat(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePasswordFormat(password: string): boolean {
    return password.length >= 4;
  }

  validateLastNameFormat(lastName: string): boolean {
    return lastName.length >= 1;
  }

  validateFirstNameFormat(firstName: string): boolean {
    return firstName.length >= 1;
  }

  emailAlreadyExists(email: string): Observable<boolean> {
    const emailAlreadyExistsUrl = `${this.baseURL}/authentication/email-already-exists`;
    const params = new HttpParams().set('email', email);
    return this.http.get<boolean>(emailAlreadyExistsUrl, { params });
  }

  emailVerified(email: string): Observable<boolean> {
    const emailVerifiedUrl = `${this.baseURL}/authentication/email-verified`;
    const params = new HttpParams().set('email', email);
    return this.http.get<boolean>(emailVerifiedUrl, { params });
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
