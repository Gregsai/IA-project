import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
interface TournamentResponse {
  totalCount: number;
  tournaments: string[];
}
@Injectable({
  providedIn: 'root'
})
export class TournamentsService {

  private baseURL = 'http://localhost:3000';
  private tournamentsPerPage: number = 10;

  constructor(private http: HttpClient) {
  }




  getUpcomingTournamentsPage(startIndex: number, endIndex: number, searchTerm: string): Observable<TournamentResponse> {
    const getTournamentsUrl = `${this.baseURL}/tournaments/get-upcoming-tournaments-page`;
    const params = new HttpParams()
      .set('startIndex', startIndex.toString())
      .set('endIndex', endIndex.toString())
      .set('searchTerm', searchTerm);
    return this.http.get<TournamentResponse>(getTournamentsUrl, { params, withCredentials: true });
  }

  getTournamentInformation(id: string): Observable<any> {
    const getTournamentInformationUrl = `${this.baseURL}/tournaments/get-tournament-information/${id}`;
    return this.http.get<any>(getTournamentInformationUrl, { withCredentials: true });
  }

  getTournamentSponsors(id: string): Observable<any> {
    const getTournamentSponsorsUrl = `${this.baseURL}/tournaments/get-tournament-sponsors/${id}`;
    return this.http.get<any>(getTournamentSponsorsUrl, { withCredentials: true });
  }
  getTournamentParticipantsList(id: string): Observable<any> {
    const getTournamentParticipantsListUrl = `${this.baseURL}/tournaments/get-tournament-participants-list/${id}`;
    return this.http.get<any>(getTournamentParticipantsListUrl, { withCredentials: true });
  }

  participate(id: string): Observable<any> {
    const participateUrl = `${this.baseURL}/tournaments/participate`;
    return this.http.post(participateUrl, {id}, { withCredentials: true })
  }

  unparticipate(id: string): Observable<any> {
    const unparticipateUrl = `${this.baseURL}/tournaments/unparticipate`;
    return this.http.post(unparticipateUrl, {id}, { withCredentials: true })
  }

  isUserAParticipantOfTournament(id: string): Observable<boolean> {
    const isUserAParticipantOfTournamentUrl = `${this.baseURL}/tournaments/is-user-a-participant-of-tournament/${id}`;
    return this.http.get<boolean>(isUserAParticipantOfTournamentUrl, { withCredentials: true });
  }

  isUserOrganizerOfTournament(id: string): Observable<boolean> {
    const isUserOrganizerOfTournament = `${this.baseURL}/tournaments/is-user-organizer-of-tournament/${id}`;
    return this.http.get<boolean>(isUserOrganizerOfTournament, { withCredentials: true });
  }
}