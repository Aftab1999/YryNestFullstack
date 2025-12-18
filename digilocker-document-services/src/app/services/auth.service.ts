import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API_URL = 'http://localhost:3000';
  
  // 🔥 State Management for Current User
  private currentUserSubject = new BehaviorSubject<any>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Helper to get initial state from localStorage
  private getUserFromStorage() {
    if (typeof localStorage !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }
  
  // Update state helper
  public updateUserState(user: any) {
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(user));
    }
    this.currentUserSubject.next(user);
  }

  // =====================
  // AUTH
  // =====================

  // SIGNUP
  signup(data: { email: string; password: string; name: string }) {
    return this.http.post(`${this.API_URL}/users/signup`, data);
  }

  // LOGIN
  login(data: { email: string; password: string }) {
    return this.http.post<any>('http://localhost:3000/users/login', data).pipe(
      tap((res) => {
        console.log('LOGIN RESPONSE:', res);

        if (res && res.token) {
          if (typeof localStorage !== 'undefined') {
             localStorage.setItem('token', res.token);
          }
          this.updateUserState(res.user); // Update state
        } else {
          console.error('Token missing in response');
        }
      })
    );
  }

  // LOGOUT
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null); // Clear state
  }

  // =====================
  // AUTH HELPERS
  // =====================

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getUser() {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private authHeaders() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.getToken()}`,
      }),
    };
  }

  // =====================
  // PROFILE (NEW)
  // =====================

  // GET PROFILE
  getProfile() {
    return this.http.get(`${this.API_URL}/users/profile`, this.authHeaders());
  }

  // UPDATE PROFILE (name, dob)
  updateProfile(data: { name?: string; dateOfBirth?: string }) {
    return this.http.put(
      `${this.API_URL}/users/profile`,
      data,
      this.authHeaders()
    ).pipe(
        tap((updatedUser: any) => {
            this.updateUserState(updatedUser); // Update state
        })
    );
  }

  // UPLOAD PROFILE IMAGE
  uploadProfileImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(
      `${this.API_URL}/users/profile/image`,
      formData,
      this.authHeaders()
    ).pipe(
        tap((updatedUser: any) => {
            this.updateUserState(updatedUser); // Update state
        })
    );
  }
}
