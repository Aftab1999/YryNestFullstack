import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { AuthService } from '../../app/services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule], //  CommonModule
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  formData = {
    email: '',
    password: '',
  };

  // Track form submission state
  isSubmitting = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(form: any) {
    // Only submit if form is valid
    if (!form.valid) {
      // Mark all fields as touched to show errors
      Object.keys(form.controls).forEach(key => {
        form.controls[key].markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    
    this.authService.login(this.formData).subscribe({
      next: () => {
        alert('Login successful');
        this.isSubmitting = false;
        this.router.navigate(['/home']);
      },
      error: (err) => {
        alert(err?.error?.message || 'Login failed');
        this.isSubmitting = false;
      },
    });
  }
}