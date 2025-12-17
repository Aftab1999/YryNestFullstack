import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../app/services/auth.service';
import { HttpClient } from '@angular/common/http';


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

  constructor(private authService: AuthService, private http: HttpClient) {}
  

  ngOnInit() {
    this.loadProfile();
  }

  // Load profile from backend
  loadProfile() {
    this.authService.getProfile().subscribe((res: any) => {
      this.user = res;
    });
  }

  // Update name & DOB
  updateProfile() {
    this.loading = true;

    this.authService
      .updateProfile({
        name: this.user.name,
        dateOfBirth: this.user.dateOfBirth,
      })
      .subscribe({
        next: () => {
          alert('Profile updated successfully');
          this.loading = false;
        },
        error: () => {
          alert('Profile update failed');
          this.loading = false;
        },
      });
  }

  // Select image
  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }



  uploadImage() {
  if (!this.selectedFile) return;

  const formData = new FormData();
  formData.append('file', this.selectedFile);

  this.http
    .put<any>('http://localhost:3000/users/profile/image', formData)
    .subscribe({
      next: (res) => {
        console.log('✅ Upload response:', res);

        // 🔥 UPDATE localStorage user
        localStorage.setItem('user', JSON.stringify(res));

        alert('Profile image updated');

        // 🔁 Reload page state
        window.location.reload();
      },
      error: (err) => {
        console.error('❌ Upload failed:', err);
        alert('Image upload failed');
      },
    });
}


}




