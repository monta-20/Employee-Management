import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { EmployeeTableComponent } from './components/employee-table/employee-table.component'
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    EmployeeTableComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
