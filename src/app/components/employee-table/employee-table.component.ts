import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EmployeeService } from 'src/app/services/employee.service';
import { Employee } from 'src/app/interfaces/Employee.intrerface';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-employee-table',
  templateUrl: './employee-table.component.html',
  styleUrls: ['./employee-table.component.css'],
})
export class EmployeeTableComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;

  newEmployee: Employee = {
    id: 0,
    age: 0,
    dob: '',
    email: '',
    salary: 0,
    address: '',
    imageUrl: '',
    lastName: '',
    firstName: '',
    contactNumber: 0,
  };
  showForm = false;
  
  constructor(private _serv: EmployeeService) {}
  
  ngOnInit(): void {
    this._serv.getEmployees().subscribe(
      data => {
        this.employees = data;
        this.filteredEmployees = [...data]; // Copiez les données pour le filtrage
        this.totalItems = this.filteredEmployees.length; // Mettez à jour le nombre total d'éléments
        console.log(this.employees); // Affichez les données dans la console
      },
      error => {
        console.error('Error fetching employees', error);
      }
    );
  }
  
  
 
  get paginatedEmployees(){
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredEmployees.slice(startIndex, startIndex + this.itemsPerPage);
  }

  changePage(page:number){
    this.currentPage = page ;
  }

  setItemsPerPage(event:Event){
    const target = event.target as HTMLSelectElement;
    const parsedCount = parseInt(target.value,10);
    if (!isNaN(parsedCount)) {
      this.itemsPerPage = parsedCount;
      this.currentPage = 1; // Reset to the first page
    }
  }


  incrementItemsPerPage() {
    this.itemsPerPage += 1; // Increase items per page
    this.currentPage = 1; // Reset to the first page
  }

  decrementItemsPerPage() {
    if (this.itemsPerPage > 1) {
      this.itemsPerPage -= 1; // Decrease items per page
      this.currentPage = 1; // Reset to the first page
    }
  }  

  toggleForm() {
    this.showForm = !this.showForm; // Toggle form visibility
  }

  deleteEmployee(id:number){
    this.filteredEmployees = this.filteredEmployees.filter(employee => employee.id !== id);
    this.employees = this.employees.filter(employee => employee.id !== id);
    this.totalItems = this.filteredEmployees.length;
  }

  addEmployee(employeeForm: NgForm) {
    const ids = this.employees.map(e => Number(e.id) || 0); // Convert to number, default to 0 if NaN

    const newId = this.employees.length > 0 ? Math.max(...ids) + 1 : 1;
  
    const employeeToAdd = { ...this.newEmployee, id: newId };
    this.employees.push(employeeToAdd);
    this.filteredEmployees.push(employeeToAdd);
    this.totalItems = this.filteredEmployees.length;
    this.resetNewEmployee();
  }
  


  resetNewEmployee() {
    this.newEmployee = {
    id: 0,
    age: 0,
    dob: '',
    email: '',
    salary: 0,
    address: '',
    imageUrl: '',
    lastName: '',
    firstName: '',
    contactNumber: 0,
    };
  }

  filterEmployees(event: Event) {
    const target = event.target as HTMLInputElement;
    const term = target.value.toLowerCase().trim(); // Trim whitespace
  
    this.filteredEmployees = this.employees.filter(employee => {
      const idMatch = employee.id?.toString().includes(term) || false;
      const firstNameMatch = employee.firstName?.toLowerCase().includes(term) || false;
      const lastNameMatch = employee.lastName?.toLowerCase().includes(term) || false;
      const emailMatch = employee.email?.toLowerCase().includes(term) || false;
      const dobMatch = employee.dob?.includes(term) || false; // Assuming dob is a string
      const ageMatch = employee.age?.toString().includes(term) || false;
      const salaryMatch = employee.salary?.toString().includes(term) || false; // Ensure salary is a number
      const addressMatch = employee.address?.toLowerCase().includes(term) || false;
      const imageUrlMatch = employee.imageUrl?.toLowerCase().includes(term) || false;
      const contactNumberMatch = employee.contactNumber?.toString().includes(term) || false;
  
      // Log for debugging
      console.log({
        term,
        idMatch, firstNameMatch, lastNameMatch, emailMatch, dobMatch, 
        ageMatch, salaryMatch, addressMatch, imageUrlMatch, contactNumberMatch
      });
  
      return idMatch || firstNameMatch || lastNameMatch || emailMatch || 
             dobMatch || ageMatch || salaryMatch || addressMatch || 
             imageUrlMatch || contactNumberMatch;
    });
  
    this.totalItems = this.filteredEmployees.length; // Update totalItems after filtering
  }
  
  
  
  sortColumn: keyof Employee = 'id'; // Set a default column to sort by
sortDirection: 'asc' | 'desc' = 'asc';

sortBy(column: keyof Employee) {
  this.sortDirection = this.sortColumn === column && this.sortDirection === 'asc' ? 'desc' : 'asc';
  this.sortColumn = column;

  this.filteredEmployees.sort((a, b) => {
    const modifier = this.sortDirection === 'asc' ? 1 : -1;

    const aValue = a[column];
    const bValue = b[column];

    // Handle numeric comparison
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return (aValue - bValue) * modifier;
    } else {
      // Handle string comparison
      if (String(aValue).toLowerCase() < String(bValue).toLowerCase()) return -1 * modifier;
      if (String(aValue).toLowerCase() > String(bValue).toLowerCase()) return 1 * modifier;
      return 0;
    }
  });
}




  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

}


 