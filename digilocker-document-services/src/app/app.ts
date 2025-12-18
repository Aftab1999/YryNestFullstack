
// import { Component, signal, Inject, PLATFORM_ID } from '@angular/core';
// import { Router } from '@angular/router';
// import { CommonModule, isPlatformBrowser } from '@angular/common';
// import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [
//     RouterOutlet,
//     RouterLink,
//     RouterLinkActive,
//     CommonModule
//   ],
//   templateUrl: './app.html',
//   styleUrl: './app.css',
// })
// export class App {
//   protected readonly title = signal('digilocker-document-services');

//   isLoggedIn = false;
//   userName = '';
//   profileImage = '';

//   constructor(
//     private router: Router,
//     @Inject(PLATFORM_ID) private platformId: Object
//   ) {
//     this.loadUser();
//   }

//   loadUser() {
//     if (isPlatformBrowser(this.platformId)) {
//       const token = localStorage.getItem('token');
//       const user = localStorage.getItem('user');

//       this.isLoggedIn = !!token;

//       if (user) {
//         const parsedUser = JSON.parse(user);
//         this.userName = parsedUser.name || 'User';
//         this.profileImage =
//           parsedUser.profileImage
//             ? `http://localhost:3000${parsedUser.profileImage}`
//             : 'assets/default-user.png';
//       }
//     }
//   }

//   logout() {
//     if (isPlatformBrowser(this.platformId)) {
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//     }

//     this.isLoggedIn = false;
//     this.router.navigate(['/login']);
//   }
// }

import { Component, signal, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    CommonModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('digilocker-document-services');

  isLoggedIn = false;
  userName = '';
  profileImage = '';
  timestamp = new Date().getTime();

  constructor(
    private router: Router,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
      // Subscribe to user state changes
      this.authService.currentUser$.subscribe(user => {
          this.isLoggedIn = !!user;
          
          if (user) {
              this.userName = user.name || 'User';
              if (user.profileImage) {
                // Add timestamp to force reload if image changed
                this.profileImage = `http://localhost:3000${user.profileImage}?t=${new Date().getTime()}`;
              } else {
                this.profileImage = 'assets/default-user.svg';
              }
          } else {
              this.userName = '';
              this.profileImage = '';
          }
      });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}


