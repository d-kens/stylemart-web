import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../../auth/data-access/services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const excludedUrls = [
      { url: '/auth/register', method: null },
      { url: '/auth/login', method: null },
      { url: '/auth/refresh-token', method: null },
      { url: '/auth/logout', method: null },
      { url: '/products', method: 'GET' },
      { url: '/categories', method: 'GET'}
    ];

    const isExcludedUrl = excludedUrls.some(
      (rule) =>
        request.url.includes(rule.url) && (!rule.method || request.method === rule.method)
    );

    if (isExcludedUrl) {
      console.log("REQUEST NOT INTERCEPTED: " + request.url)
      return next.handle(request);
    }

    const accessToken = localStorage.getItem('authToken');

    if (!accessToken) {
      this.authService.logout().subscribe();
      this.router.navigate(['/auth/sign-in']);
      return throwError(() => new Error('No access token provided'));
    }

    const clonedRequest = request.clone({
      headers: request.headers.set('Authorization', `Bearer ${accessToken}`),
    });

    return next.handle(clonedRequest).pipe(
      catchError((error) => {
        if (error.status === 401) {
          return this.authService.refreshToken().pipe(
            switchMap((response) => {
              this.authService.storeAccessToken(response.accessToken);
              const retryRequest = request.clone({
                headers: request.headers.set('Authorization', `Bearer ${response.accessToken}`),
              });
              return next.handle(retryRequest);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }
}