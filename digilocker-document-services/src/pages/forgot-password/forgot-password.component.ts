import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Component } from '@angular/core'; // Add this import

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>Forgot Password</h2>
        <p class="subtitle">Enter your email to receive a password reset link</p>
        
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Email</label>
            <input
              type="email"
              [(ngModel)]="email"
              name="email"
              required
              placeholder="Enter your email"
            />
          </div>

          <button type="submit" class="btn-submit" [disabled]="loading">
            {{ loading ? 'Sending...' : 'Send Reset Link' }}
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
export class ForgotPasswordComponent {
  email = '';
  loading = false;

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    if (!this.email) return;
    this.loading = true;
    
    // Call backend API
    this.http.post('http://localhost:3000/users/forgot-password', { email: this.email }).subscribe({
      next: (res: any) => {
        alert('Reset link sent to your email!');
        this.loading = false;
        // Optionally navigate back to login
        // this.router.navigate(['/login']);
      },
      error: (err) => {
        alert(err?.error?.message || 'Failed to send reset link');
        this.loading = false;
      }
    });
  }
}
