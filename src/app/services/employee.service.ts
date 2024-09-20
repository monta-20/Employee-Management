// services/employee.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../interfaces/Employee.intrerface'

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = 'https://retoolapi.dev/HYd96h/data'; 

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }

 
}
