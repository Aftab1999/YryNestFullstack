import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PanService, PanRequest } from '../../app/services/pan.service';
import * as PanActions from '../../app/store/pan/pan.actions';
import { selectPanState } from '../../app/store/pan/pan.selectors';

@Component({
  selector: 'app-pan-request',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './pan-request.component.html',
  styleUrls: ['./pan-request.component.css']
})
export class PanRequestComponent implements OnInit {
  panForm: FormGroup;
  requestTypes = ['NEW', 'CORRECTION'];
  panState$: Observable<any>;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router
  ) {
    this.panForm = this.fb.group({});
    this.panState$ = this.store.select(selectPanState);
  }

  ngOnInit(): void {
    this.panForm = this.fb.group({
      fullName: ['', [
        Validators.required, 
        Validators.pattern(/^[a-zA-Z\s]+$/)
      ]],
      dateOfBirth: ['', [Validators.required]],
      requestType: ['NEW', Validators.required]
    });
  }

  onSubmit() {
    if (this.panForm.invalid) {
      // Mark all fields as touched to show validation messages
      Object.keys(this.panForm.controls).forEach(field => {
        const control = this.panForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      return;
    }

    const formData: PanRequest = {
      fullName: this.panForm.value.fullName,
      dateOfBirth: new Date(this.panForm.value.dateOfBirth).toISOString().split('T')[0],
      requestType: this.panForm.value.requestType
    };

    this.store.dispatch(PanActions.submitPanRequest({ request: formData }));
  }

  onBack() {
    this.router.navigate(['/dashboard']);
  }

  // Helper method to check if form field is invalid
  isFieldInvalid(field: string): boolean {
    const control = this.panForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
}
