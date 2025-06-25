import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DebugElement } from '@angular/core';

import { LoginComponent } from './login.component';
import { AuthService } from '@core/auth/services/auth.service';
import { LoginResponse } from '@core/models/user.model';

// Material modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  const mockLoginResponse: LoginResponse = {
    id: 1,
    username: 'testuser',
    email: 'test@test.com',
    firstName: 'Test',
    lastName: 'User',
    gender: 'male',
    image: 'test.jpg',
    token: 'mock-token',
  };

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
      ],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize the login form with empty values', () => {
      expect(component.loginForm).toBeDefined();
      expect(component.loginForm.get('username')?.value).toBe('');
      expect(component.loginForm.get('password')?.value).toBe('');
    });

    it('should have required validators on username and password fields', () => {
      const usernameControl = component.loginForm.get('username');
      const passwordControl = component.loginForm.get('password');

      expect(usernameControl?.hasError('required')).toBeTruthy();
      expect(passwordControl?.hasError('required')).toBeTruthy();
    });

    it('should mark form as invalid when fields are empty', () => {
      expect(component.loginForm.valid).toBeFalsy();
    });

    it('should mark form as valid when both fields are filled', () => {
      component.loginForm.patchValue({
        username: 'testuser',
        password: 'testpass',
      });

      expect(component.loginForm.valid).toBeTruthy();
    });
  });

  describe('Form Validation', () => {
    it('should show error message for required username', () => {
      const usernameInput = fixture.debugElement.query(
        By.css('input[formControlName="username"]')
      );

      // Mark field as touched to trigger validation
      component.loginForm.get('username')?.markAsTouched();
      fixture.detectChanges();

      const errorElement = fixture.debugElement.query(By.css('.error-message'));
      expect(errorElement?.nativeElement.textContent.trim()).toBe(
        'Username is required'
      );
    });

    it('should show error message for required password', () => {
      const passwordInput = fixture.debugElement.query(
        By.css('input[formControlName="password"]')
      );

      // Mark field as touched to trigger validation
      component.loginForm.get('password')?.markAsTouched();
      fixture.detectChanges();

      const errorElements = fixture.debugElement.queryAll(
        By.css('.error-message')
      );
      const passwordErrorElement = errorElements.find(
        (el) => el.nativeElement.textContent.trim() === 'Password is required'
      );
      expect(passwordErrorElement?.nativeElement.textContent.trim()).toBe(
        'Password is required'
      );
    });

    it('should disable submit button when form is invalid', () => {
      const submitButton = fixture.debugElement.query(
        By.css('button[type="submit"]')
      );

      expect(submitButton.nativeElement.disabled).toBeTruthy();
    });

    it('should enable submit button when form is valid', () => {
      component.loginForm.patchValue({
        username: 'testuser',
        password: 'testpass',
      });
      fixture.detectChanges();

      const submitButton = fixture.debugElement.query(
        By.css('button[type="submit"]')
      );
      expect(submitButton.nativeElement.disabled).toBeFalsy();
    });
  });

  describe('Login Process', () => {
    beforeEach(() => {
      component.loginForm.patchValue({
        username: 'testuser',
        password: 'testpass',
      });
    });

    it('should not call authService.login when form is invalid', () => {
      component.loginForm.patchValue({
        username: '',
        password: '',
      });

      component.login();

      expect(authService.login).not.toHaveBeenCalled();
    });

    it('should call authService.login with correct credentials when form is valid', () => {
      authService.login.and.returnValue(of(mockLoginResponse));

      component.login();

      expect(authService.login).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'testpass',
      });
    });

    it('should navigate to products page on successful login', () => {
      authService.login.and.returnValue(of(mockLoginResponse));

      component.login();

      expect(router.navigate).toHaveBeenCalledWith(['/products']);
    });

    it('should clear error message before login attempt', () => {
      component.errorMessage = 'Previous error';
      authService.login.and.returnValue(of(mockLoginResponse));

      component.login();

      expect(component.errorMessage).toBeNull();
    });

    it('should mark form as pristine after login attempt', () => {
      authService.login.and.returnValue(of(mockLoginResponse));
      component.loginForm.markAsDirty();

      component.login();

      expect(component.loginForm.pristine).toBeTruthy();
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      component.loginForm.patchValue({
        username: 'testuser',
        password: 'testpass',
      });
    });

    it('should display error message when login fails with server error', () => {
      const errorResponse = {
        error: { message: 'Invalid credentials' },
      };
      authService.login.and.returnValue(throwError(() => errorResponse));

      component.login();

      expect(component.errorMessage).toBe('Invalid credentials');
    });

    it('should display default error message when login fails without specific message', () => {
      authService.login.and.returnValue(
        throwError(() => new Error('Network error'))
      );

      component.login();

      expect(component.errorMessage).toBe('Login failed. Please try again.');
    });

    it('should display error message in template when errorMessage is set', () => {
      component.errorMessage = 'Test error message';
      fixture.detectChanges();

      const errorElement = fixture.debugElement.query(By.css('.api-error'));
      expect(errorElement).toBeTruthy();
      expect(errorElement.nativeElement.textContent).toContain(
        'Test error message'
      );
    });

    it('should not display error message when errorMessage is null', () => {
      component.errorMessage = null;
      fixture.detectChanges();

      const errorElement = fixture.debugElement.query(By.css('.api-error'));
      expect(errorElement).toBeFalsy();
    });
  });

  describe('Form Submission', () => {
    it('should call login method when form is submitted', () => {
      spyOn(component, 'login');
      component.loginForm.patchValue({
        username: 'testuser',
        password: 'testpass',
      });

      const form = fixture.debugElement.query(By.css('form'));
      form.triggerEventHandler('ngSubmit', null);

      expect(component.login).toHaveBeenCalled();
    });

    it('should call login method when submit button is clicked', () => {
      spyOn(component, 'login');
      component.loginForm.patchValue({
        username: 'testuser',
        password: 'testpass',
      });
      fixture.detectChanges();

      const submitButton = fixture.debugElement.query(
        By.css('button[type="submit"]')
      );
      submitButton.nativeElement.click();

      expect(component.login).toHaveBeenCalled();
    });
  });

  describe('Template Elements', () => {
    it('should display correct form labels', () => {
      const usernameLabel = fixture.debugElement.query(
        By.css('label[for="username"]')
      );
      const passwordLabel = fixture.debugElement.query(
        By.css('label[for="password"]')
      );

      expect(usernameLabel.nativeElement.textContent).toBe('Username');
      expect(passwordLabel.nativeElement.textContent).toBe('Password');
    });

    it('should have correct input types and placeholders', () => {
      const usernameInput = fixture.debugElement.query(
        By.css('input[formControlName="username"]')
      );
      const passwordInput = fixture.debugElement.query(
        By.css('input[formControlName="password"]')
      );

      expect(usernameInput.nativeElement.type).toBe('text');
      expect(usernameInput.nativeElement.placeholder).toBe(
        'Enter your username'
      );
      expect(passwordInput.nativeElement.type).toBe('password');
      expect(passwordInput.nativeElement.placeholder).toBe(
        'Enter your password'
      );
    });

    it('should display brand title', () => {
      const brandTitle = fixture.debugElement.query(By.css('.brand-title'));
      expect(brandTitle.nativeElement.textContent).toBe('SHOPPING NOW');
    });

    it('should display welcome messages', () => {
      const welcomeTitle = fixture.debugElement.query(By.css('.welcome-title'));
      const welcomeText = fixture.debugElement.query(By.css('.welcome-text'));

      expect(welcomeTitle.nativeElement.textContent).toBe('Welcome Back');
      expect(welcomeText.nativeElement.textContent).toBe(
        'Access your intelligent shopping platform'
      );
    });
  });
});
