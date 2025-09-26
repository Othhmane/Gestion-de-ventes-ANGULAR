import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule, NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  error = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      identifier: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    const { identifier, password } = this.loginForm.value;
    if (this.auth.login(identifier, password)) {
      if (this.auth.isAdmin()) {
        this.router.navigate(['/clients']);
      } else {
        const userId = this.auth.getUserId();
        this.router.navigate([`/clients/${userId}/transactions`]);
      }
    } else {
      this.error = 'email ou utilisateur ou mot de passe incorrect';
    }
  }
}