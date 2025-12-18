import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../app/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { switchMap, of } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: any = {
    name: '',
    email: '',
    dateOfBirth: '',
    profileImage: '',
  };

  selectedFile: File | null = null;
  loading = false;
  timestamp = new Date().getTime(); // Cache busting

  constructor(
    private authService: AuthService, 
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProfile();
  }

  // Load profile from backend
  loadProfile() {
    this.authService.getProfile().subscribe((res: any) => {
      this.user = res;
    });
  }

  // Update name, DOB & Profile Image
  updateProfile() {
    this.loading = true;

    // Define profile update observable
    const updateDetails$ = this.authService.updateProfile({
      name: this.user.name,
      dateOfBirth: this.user.dateOfBirth,
    });

    // If file is selected, upload first, then update details
    if (this.selectedFile) {
      this.authService.uploadProfileImage(this.selectedFile).pipe(
        switchMap((res: any) => {
            console.log('✅ Image uploaded:', res);
            // Continue to update text details
            return updateDetails$;
        })
      ).subscribe({
        next: (res: any) => this.handleSuccess(res),
        error: (err) => this.handleError(err),
      });
    } else {
      // Just update details
      updateDetails$.subscribe({
        next: (res: any) => this.handleSuccess(res),
        error: (err) => this.handleError(err),
      });
    }
  }

  handleSuccess(res: any) {
    console.log('✅ Profile updated:', res);
    
    // AuthService already updates the state via tap(), so we just alert and navigate
    // No need to manually set localStorage here as AuthService handles it

    alert('Profile updated successfully!');
    this.loading = false;
    
    // Navigate to home
    this.router.navigate(['/home']);
  }

  handleError(err: any) {
    console.error('❌ Update failed:', err);
    alert('Failed to update profile.');
    this.loading = false;
  }

  // Select image
  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }
}




