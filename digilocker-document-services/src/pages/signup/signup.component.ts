import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Add this import
import { AuthService } from '../../app/services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule], // Add CommonModule here
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  formData = {
    name: '',
    email: '',
    password: '',
  };

  // Form submission state
  isSubmitting = false;
  
  // Add form reference for validation
  signupForm: any; // This will reference the form in template

  constructor(private authService: AuthService) {}

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
    
    this.authService.signup(this.formData).subscribe({
      next: () => {
        alert('Signup successful');
        this.isSubmitting = false;
        // Optionally reset form
        form.reset();
      },
      error: (err) => {
        alert(err?.error?.message || 'Signup failed');
        this.isSubmitting = false;
      },
    });
  }
}