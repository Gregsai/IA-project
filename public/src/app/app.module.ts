import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // Importez HttpClientModule
import { provideHttpClient, withFetch } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './authentication-components/auth/auth.component';
import { VerifyAccountComponent } from './authentication-components/verify-account/verify-account.component';
import { SignUpComponent } from './authentication-components/sign-up/sign-up.component';
import { SignInComponent } from './authentication-components/sign-in/sign-in.component';
import { PasswordForgottenComponent } from './authentication-components/password-forgotten/password-forgotten.component';
import { HomeComponent } from './home/home.component';
import { SendVerificationEmailComponent } from './authentication-components/send-verification-email/send-verification-email.component';
import { ResetPasswordComponent } from './authentication-components/reset-password/reset-password.component';
import { MyTournamentsComponent } from './my-tournaments/my-tournaments.component';
import { CreateTournamentComponent } from './create-tournament/create-tournament.component';
import { TournamentsComponent } from './tournaments/tournaments.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { TournamentDescriptionComponent } from './tournament-description/tournament-description.component';
import { EditTournamentComponent } from './edit-tournament/edit-tournament.component';
import { ParticipateComponent } from './participate/participate.component';
@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    VerifyAccountComponent,
    SignUpComponent,
    SignInComponent,
    PasswordForgottenComponent,
    HomeComponent,
    SendVerificationEmailComponent,
    ResetPasswordComponent,
    MyTournamentsComponent,
    CreateTournamentComponent,
    TournamentsComponent,
    TournamentDescriptionComponent,
    EditTournamentComponent,
    ParticipateComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
  ],
  providers: [provideHttpClient(withFetch()),],
  bootstrap: [AppComponent]
})
export class AppModule { }
