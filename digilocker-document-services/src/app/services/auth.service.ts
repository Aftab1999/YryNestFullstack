import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API_URL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // =====================
  // AUTH
  // =====================

  // SIGNUP
  signup(data: { email: string; password: string; name: string }) {
    return this.http.post(`${this.API_URL}/users/signup`, data);
  }

  // LOGIN

  // login(data: { email: string; password: string }) {
  //   return this.http.post<any>(`${this.API_URL}/users/login`, data).pipe(
  //     tap((res) => {
  //       if (res?.token) {
  //         localStorage.setItem('token', res.token);
  //         localStorage.setItem('user', JSON.stringify(res.user));
  //       }
  //     })
  //   );
  // }

  login(data: { email: string; password: string }) {
  return this.http.post<any>('http://localhost:3000/users/login', data).pipe(
    tap((res) => {
      console.log('LOGIN RESPONSE:', res);

      if (res && res.token) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
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
  }

  // =====================
  // AUTH HELPERS
  // =====================

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
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
    );
  }
}
