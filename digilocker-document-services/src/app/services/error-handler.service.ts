import { ErrorHandler, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService implements ErrorHandler {
  handleError(error: any): void {
    console.error('An error occurred:', error);
    // Add your custom error handling logic here
  }
}
