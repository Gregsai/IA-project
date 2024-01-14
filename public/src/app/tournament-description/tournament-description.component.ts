import { Component, OnInit, ElementRef } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { defaults as defaultControls } from 'ol/control';
import { useGeographic } from 'ol/proj';
import { ActivatedRoute, Router } from '@angular/router';
import { TournamentsService } from '../tournaments.service';
import { GeocodingService } from '../geocoding.service';


import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import {Icon, Style} from 'ol/style.js';
import {OGCMapTile, Vector as VectorSource} from 'ol/source.js';
import { Vector as VectorLayer} from 'ol/layer.js';
import {fromLonLat} from 'ol/proj.js';
import { AuthenticationService } from '../authentication.service';
@Component({
  selector: 'app-tournament-description',
  templateUrl: './tournament-description.component.html',
  styleUrls: ['./tournament-description.component.css']
})
export class TournamentDescriptionComponent implements OnInit {
  private map!: Map;
  tournamentData: any;
  tournamentSponsors: any;
  tournamentParticipants: any;
  numberOfParticipants: number = 0;
  numberOfRankedPlayers: number = 0;
  address = '';
  latitude: number = 1;
  longitude: number = 1;
  displayLadder: boolean = false;
  displayMatchs: boolean = false;
  activeSection:string = 'participants';
  isLoggedIn: boolean = false;
  tournamentId:string = '';
  isParticipantOfTournament: string = '';
  isOrganizerOfTournament: string = '';
  showMessage: boolean = false;
  message: string = '';

  constructor(
    private elementRef: ElementRef,
    private route: ActivatedRoute,
    private tournamentsService: TournamentsService,
    private geocodingService: GeocodingService,
    private authService: AuthenticationService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.tournamentId = this.route.snapshot.params['id'];
    setTimeout(() => {
      const mapContainer = this.elementRef.nativeElement.querySelector('.map-container');
      if (mapContainer.clientWidth > 0 && mapContainer.clientHeight > 0) {
        const tournamentId = this.route.snapshot.params['id'];
        this.loadAllData(tournamentId);
      } else {
      }
    }, 0);
  }


  private loadAllData(tournamentId: string){
    this.getTournamentInformation(tournamentId);
    this.getTournamentSponsors(tournamentId);
    this.getTournamentParticipantsList(tournamentId);
    this.isUserAParticipantOfTournament()
    this.isUserOrganizerOfTournament()
  }

  private initializeMap(targetElement: HTMLElement) {
    const rome = new Feature({
      geometry: new Point(fromLonLat([parseFloat(this.longitude.toString()), parseFloat(this.latitude.toString())])),
    });

    rome.setStyle(
      new Style({
        image: new Icon({
          crossOrigin: 'anonymous',
          src: './../../assets/images/marker.svg',
          scale: 0.05
        }),
      })
    );
    const vectorSource = new VectorSource({
      features: [rome],
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    const rasterLayer = new TileLayer({
      source: new OSM(),
    });
    this.map = new Map({
      layers: [rasterLayer, vectorLayer],
      target: targetElement,
      controls: defaultControls({ attribution: false, zoom: true, rotate: false }),
      view: new View({
        center: fromLonLat([parseFloat(this.longitude.toString()), parseFloat(this.latitude.toString())]),
        zoom: 13,
      }),
    });
  }

  private getTournamentInformation(tournamentId: string) {
    this.tournamentsService.getTournamentInformation(tournamentId).subscribe(
      (data) => {
        this.tournamentData = data;
        this.address = this.tournamentData.address;
        this.tournamentData.dateOnly = this.getDateFromISOString(this.tournamentData.date);
        this.tournamentData.timeOnly = this.getTimeFromISOString(this.tournamentData.date);
        this.tournamentData.deadlineDateOnly = this.getDateFromISOString(this.tournamentData.applicationdeadline);
        this.tournamentData.deadlineTimeOnly = this.getTimeFromISOString(this.tournamentData.applicationdeadline);
        const currentDate = new Date().toISOString();
        if(currentDate >= this.tournamentData.date) {
          this.displayLadder = true;
          this.displayMatchs = true;
        }
        this.geocodeAddress();
      },
      (error) => {
        console.error('Error fetching tournament information:', error);
      }
    );
  }
  private getTournamentSponsors(tournamentId: string) {
    this.tournamentsService.getTournamentSponsors(tournamentId).subscribe(
      (data) => {
        this.tournamentSponsors = data;
      },
      (error) => {
        console.error('Error fetching tournament sponsors:', error);
      }
    );
  }

  private getTournamentParticipantsList(tournamentId: string) {
    this.tournamentsService.getTournamentParticipantsList(tournamentId).subscribe(
      (data) => {
        this.tournamentParticipants = data;
        this.numberOfParticipants = this.tournamentParticipants.length;
        this.numberOfRankedPlayers = this.tournamentParticipants.filter((participant: any) => participant.rank !== null && participant.rank !== undefined && participant.rank !== 0).length;
      },
      (error) => {
        console.error('Error fetching tournament participants:', error);
      }
    );
  }

  geocodeAddress() {
    this.geocodingService.geocode(this.address).subscribe(
      (data: any) => {
        if (data.length > 0) {
          this.latitude = data[0].lat;
          this.longitude = data[0].lon;
        } else {
          console.error('Geocoding result is empty');
        }
        this.initializeMap(this.elementRef.nativeElement.querySelector('.map-container'));
      },
      (error) => {
        console.error('Error during geocoding:', error);
      }
    );
  }

  getDateFromISOString(date:string) {
    const dateObject = new Date(date);
    const year = dateObject.getFullYear();
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObject.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getTimeFromISOString(date:string) {
    const dateObject = new Date(date);
    const hours = dateObject.getUTCHours().toString().padStart(2, '0');
    const minutes = dateObject.getUTCMinutes().toString().padStart(2, '0');
    const seconds = dateObject.getUTCSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  participate(){
    this.authService.isLoggedIn().subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
      if(!this.isLoggedIn) {
        this.authService.setRedirectUrl(`/tournament-description/${this.tournamentId}`);
        this.router.navigateByUrl('/sign-in');
      }
      this.tournamentsService.participate(this.tournamentId).subscribe(
        (data) => {
          this.router.navigateByUrl(`/tournament-description/${this.tournamentId}`);
          this.loadAllData(this.tournamentId)
          this.message = "You are now participating to the tournament";
          this.showMessage = true;
          setTimeout(() => {
            this.showMessage = false;
            this.message = ""
          }, 5000);
        },
        (error) => {
          console.error('Error fetching tournament sponsors:', error);
        }
      );
    });
  }

  unparticipate(){
    this.authService.isLoggedIn().subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
      if(!this.isLoggedIn) {
        this.authService.setRedirectUrl(`/tournament-description/${this.tournamentId}`);
        this.router.navigateByUrl('/sign-in');
      }
      this.tournamentsService.unparticipate(this.tournamentId).subscribe(
        (data) => {
          this.router.navigateByUrl(`/tournament-description/${this.tournamentId}`);
          this.loadAllData(this.tournamentId)
          this.message = "You are not participating to the tournament anymore";
          this.showMessage = true;
          setTimeout(() => {
            this.showMessage = false;
            this.message = ""
          }, 5000);
        },
        (error) => {
          console.error('Error fetching tournament sponsors:', error);
        }
      );
    });
  }

  private isUserAParticipantOfTournament(){
    this.authService.isLoggedIn().subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
      if(!this.isLoggedIn) {
        this.isParticipantOfTournament = "false";
        return;
      }
      this.tournamentsService.isUserAParticipantOfTournament(this.tournamentId).subscribe(
        (data:any) => {
          if(data.isParticipant){
            this.isParticipantOfTournament = "true";
          }else{
            this.isParticipantOfTournament = "false";
          }
        },
        (error) => {
          this.isParticipantOfTournament = "false";
          console.error('Error fetching tournament sponsors:', error);
        }
      );
    });
  }

  private isUserOrganizerOfTournament(){
    this.authService.isLoggedIn().subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
      if(!this.isLoggedIn) {
        this.isOrganizerOfTournament = "false";
        return;
      }
      this.tournamentsService.isUserOrganizerOfTournament(this.tournamentId).subscribe(
        (data:any) => {
          if(data.isOrganizer){
            this.isOrganizerOfTournament = "true";
          }else{
            this.isOrganizerOfTournament = "false";
          }
        },
        (error) => {
          this.isOrganizerOfTournament = "false";
          console.error('Error fetching tournament sponsors:', error);
        }
      );
    });
  }

  editTournament(){
    this.authService.setRedirectUrl(`/tournament-description/${this.tournamentId}`);
    this.router.navigateByUrl(`/edit-tournament/${this.tournamentId}`);
  }
}
