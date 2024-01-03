import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // Importez HttpClientModule
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { VerifyAccountComponent } from './verify-account/verify-account.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { PasswordForgottenComponent } from './password-forgotten/password-forgotten.component';
import { HomeComponent } from './home/home.component';
import { SendVerificationEmailComponent } from './send-verification-email/send-verification-email.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    VerifyAccountComponent,
    SignUpComponent,
    SignInComponent,
    PasswordForgottenComponent,
    HomeComponent,
    SendVerificationEmailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
