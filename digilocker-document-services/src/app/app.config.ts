import { ApplicationConfig, ErrorHandler, isDevMode, importProvidersFrom } from '@angular/core';
import { 
  provideHttpClient, 
  withInterceptorsFromDi, 
  HTTP_INTERCEPTORS,
  withFetch,
  HttpClientModule
} from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { ErrorHandlerService } from './services/error-handler.service';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { PanEffects } from './store/pan/pan.effects';
import { reducers } from './store';
import { PanService } from './services/pan.service';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(HttpClientModule),
    provideHttpClient(
      withInterceptorsFromDi(),
      withFetch()
    ),
    provideRouter(
      routes,
      withComponentInputBinding()
    ),
    provideClientHydration(withEventReplay()),
    // NgRx Store Configuration
    provideStore(reducers, {
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictStateSerializability: true,
        strictActionSerializability: false,
        strictActionWithinNgZone: true,
        strictActionTypeUniqueness: true,
      },
    }),
    // NgRx Effects Configuration
    provideEffects([PanEffects]),
    // NgRx DevTools Configuration
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
    }),
    // Error Handling
    {
      provide: ErrorHandler,
      useClass: ErrorHandlerService
    },
    // HTTP Interceptors
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    // Services
    PanService
  ]
};

