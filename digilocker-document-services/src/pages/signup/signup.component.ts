import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../app/services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  formData = {
    name: '',
    email: '',
    password: '',
  };

  constructor(private authService: AuthService) {}

  onSubmit() {
    this.authService.signup(this.formData).subscribe({
      next: () => {
        alert('Signup successful');
      },
      error: (err) => {
        alert(err?.error?.message || 'Signup failed');
      },
    });
  }
}
