import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";


import { AppComponent } from './app.component';
import { ValidatorAuthInterceptor } from './validators/validator-auth-interceptor';
import { ContributorAuthInterceptor } from './contributors/contributor-auth-interceptor';
import { AdminAuthInterceptor } from './admin/admin-auth-interceptor';
import { NavbarComponent } from './navbar/navbar.component';
import { AdminloginComponent } from './admin/adminlogin/adminlogin.component';
import { ValidatorloginComponent } from './validators/validatorlogin/validatorlogin.component';
import { ContributorloginComponent } from './contributors/contributorlogin/contributorlogin.component';
import { ValidatorhomepageComponent } from './validators/validatorhomepage/validatorhomepage.component';
import { ContributorhomepageComponent } from './contributors/contributorhomepage/contributorhomepage.component';
import { AdminhomepageComponent } from './admin/adminhomepage/adminhomepage.component';
import { AdminAuthGuardService } from './admin/admin-auth-gaurd.service';
import { AddcontributorComponent } from './admin/adminhomepage/addcontributor/addcontributor.component';
import { AddvalidatorComponent } from './admin/adminhomepage/addvalidator/addvalidator.component';
import { AddcourseComponent } from './admin/adminhomepage/addcourse/addcourse.component';
import { ContributormoduledescriptionComponent } from './contributors/contributorhomepage/contributormoduledescription/contributormoduledescription.component';
import { ContributorquestionComponent } from './contributors/contributorhomepage/contributorquestion/contributorquestion.component';
import { ContributorAuthGuardService } from './contributors/contributor-auth-gaurd.service';
import { ValidatorAuthGuardService } from './validators/validator-auth-gaurd.service';

const routes: Routes = [
  { path: 'admin/login', component: AdminloginComponent },
  { path: 'admin/homepage', component: AdminhomepageComponent, children:[
    { path: 'addvalidators', component: AddvalidatorComponent },
    { path: 'addcourses', component: AddcourseComponent },
    { path: 'addcontributors', component: AddcontributorComponent }
  ], canActivate:[AdminAuthGuardService] },
  { path: 'validators/login', component: ValidatorloginComponent },
  { path: 'validators/homepage', component: ValidatorhomepageComponent, canActivate:[ValidatorAuthGuardService]},
  { path: 'contributors/login', component: ContributorloginComponent },
  { path: 'contributors/homepage', component: ContributorhomepageComponent, canActivate:[ContributorAuthGuardService] },
]

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ContributorloginComponent,
    ValidatorloginComponent,
    AdminloginComponent,
    ValidatorhomepageComponent,
    ContributorhomepageComponent,
    AdminhomepageComponent,
    AddcontributorComponent,
    AddvalidatorComponent,
    AddcourseComponent,
    ContributormoduledescriptionComponent,
    ContributorquestionComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: ValidatorAuthInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ContributorAuthInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: AdminAuthInterceptor, multi: true },
    AdminAuthGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
