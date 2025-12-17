

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../app/services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  formData = {
    email: '',
    password: '',
  };

  constructor(
  private authService: AuthService,
  private router: Router
) {}


  // onSubmit() {

  //   this.authService.login(this.formData).subscribe({
  //     next: (res: any) => {
  //       localStorage.setItem('token', res.token);
  //       alert('Login successful');
  //       console.log(res);
  //     },
  //     error: (err) => {
  //       alert(err?.error?.message || 'Login failed');
  //     },
  //   });

  // }

  onSubmit() {
  this.authService.login(this.formData).subscribe({
    next: () => {
      alert('Login successful');
      this.router.navigate(['/profile']);
    },
    error: (err) => {
      alert(err?.error?.message || 'Login failed');
    },
  });
}



}

