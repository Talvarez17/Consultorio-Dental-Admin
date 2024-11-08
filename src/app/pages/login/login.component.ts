import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  ngOnInit() {
  }

  constructor(public router: Router) {}

  login() {
    this.router.navigate(['/pacientes']);
  }

}
