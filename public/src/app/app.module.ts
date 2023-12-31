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
    MyTournamentsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [provideHttpClient(withFetch()),],
  bootstrap: [AppComponent]
})
export class AppModule { }
