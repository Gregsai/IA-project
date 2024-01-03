import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseURL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  signUp(signUpData: any) {
    const email = signUpData.email;
    return this.http.post('http://localhost:3000/auth/signUp', signUpData)
  }
  registerUser(userData: any): Observable<any> {
    return this.http.post<any>(`${this.baseURL}/register`, userData);
  }

  confirmUser(token: string): Observable<any> {
    return this.http.get<any>(`${this.baseURL}/confirm/${token}`);
  }

  loginUser(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.baseURL}/login`, credentials);
  }

  logoutUser(): Observable<any> {
    // Vous pouvez implémenter ici la logique de déconnexion, par exemple, envoyer une requête pour supprimer le token JWT
    return this.http.get<any>(`${this.baseURL}/logout`);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.baseURL}/forgot-password`, { email });
  }
}
