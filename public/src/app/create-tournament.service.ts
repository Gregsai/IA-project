import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CreateTournamentService {
  private baseURL = 'http://localhost:3000';
  private redirectUrl: string = '/';

  constructor(private http: HttpClient) {}

  createTournament(tournamentData: any) {
    const createTournamentURL = `${this.baseURL}/create-tournament/create-tournament`;
    return this.http.post(createTournamentURL, tournamentData, {withCredentials: true});
  }
}
