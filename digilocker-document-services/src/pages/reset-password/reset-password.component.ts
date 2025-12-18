import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>Reset Password</h2>
        <p class="subtitle">Enter your new password below</p>
        
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>New Password</label>
            <input
              type="password"
              [(ngModel)]="newPassword"
              name="newPassword"
              required
              placeholder="Enter new password"
            />
          </div>

          <div class="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              [(ngModel)]="confirmPassword"
              name="confirmPassword"
              required
              placeholder="Confirm new password"
            />
          </div>

          <button type="submit" class="btn-submit" [disabled]="loading">
            {{ loading ? 'Resetting...' : 'Reset Password' }}
          </button>
        </form>
        
         <div class="auth-footer">
          <p><a routerLink="/login">Back to Login</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f3e5f5;
      padding: 20px;
    }
    .auth-card {
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      width: 100%;
      max-width: 450px;
      text-align: center;
    }
    h2 { margin-bottom: 8px; color: #333; }
    .subtitle { color: #666; margin-bottom: 30px; font-size: 14px; }
    .form-group { margin-bottom: 20px; text-align: left; }
    label { display: block; font-weight: 600; margin-bottom: 8px; color: #333; font-size: 14px; }
    input { width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 4px; }
    .btn-submit { width: 100%; padding: 12px; background-color: #6200ea; color: white; border: none; border-radius: 4px; cursor: pointer; }
    .btn-submit:disabled { background-color: #b388ff; cursor: not-allowed; }
     .auth-footer { margin-top: 20px; font-size: 14px; }
    .auth-footer a { color: #6200ea; text-decoration: none; font-weight: 600; }
  `]
})
export class ResetPasswordComponent implements OnInit {
  newPassword = '';
  confirmPassword = '';
  token = '';
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParams['token'];
    if (!this.token) {
      alert('Invalid or missing token!');
      this.router.navigate(['/login']);
    }
  }

  onSubmit() {
    if (this.newPassword !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    this.loading = true;
    this.http.post('http://localhost:3000/users/reset-password', {
      token: this.token,
      newPass: this.newPassword
    }).subscribe({
      next: (res) => {
        alert('Password reset successful! Please login with your new password.');
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        alert(err?.error?.message || 'Password reset failed');
        this.loading = false;
      }
    });
  }
}
