import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-test',
  template: `
    <button (click)="sendRequest()">Envoyer la requête</button>
    <p *ngIf="serverResponse">{{ serverResponse | json }}</p>
    <div *ngIf="serverResponse && serverResponse.length > 0">
      <ul>
        <li *ngFor="let item of serverResponse">{{ item.nom }}</li>
      </ul>
    </div>
  `,
})
export class TestComponent {
  serverResponse: any;

  constructor(private http: HttpClient) {}

  sendRequest() {
    this.http.get<any[]>('http://localhost:3000/endpoint').subscribe(
      (response) => {
        this.serverResponse = response;
      },
      (error) => {
        console.error('Erreur lors de la requête : ', error);
      }
    );
  }
}
