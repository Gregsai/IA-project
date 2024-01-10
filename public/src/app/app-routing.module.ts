import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerifyAccountComponent } from './authentication-components/verify-account/verify-account.component';
import { AuthComponent } from './authentication-components/auth/auth.component';
import { SignUpComponent } from './authentication-components/sign-up/sign-up.component';
import { SignInComponent } from './authentication-components/sign-in/sign-in.component';
import { PasswordForgottenComponent } from './authentication-components/password-forgotten/password-forgotten.component';
import { HomeComponent } from './home/home.component';
import { SendVerificationEmailComponent } from './authentication-components/send-verification-email/send-verification-email.component';
import { ResetPasswordComponent } from './authentication-components/reset-password/reset-password.component';
import { MyTournamentsComponent } from './my-tournaments/my-tournaments.component';
import { TournamentsComponent } from './tournaments/tournaments.component';
import { CreateTournamentComponent } from './create-tournament/create-tournament.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'sign-up', component: SignUpComponent},
  {path: 'sign-in', component: SignInComponent},
  {path: 'password-forgotten', component: PasswordForgottenComponent},
  {path: 'reset-password/:token', component: ResetPasswordComponent},
  {path: 'verify-account/:email/:send-email', component: SendVerificationEmailComponent },
  {path: 'verify-account/:token', component: VerifyAccountComponent },
  {path: 'my-tournaments', component: MyTournamentsComponent},
  {path: 'tournaments', component: TournamentsComponent},
  {path: 'create-tournament', component: CreateTournamentComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
