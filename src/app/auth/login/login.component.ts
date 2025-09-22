import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule, NgIf } from '@angular/common'; // <-- Ajout

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule, NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']  // <-- Assure-toi que ce fichier existe
})
export class LoginComponent {
  loginForm: FormGroup;
  error = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    const { username, password } = this.loginForm.value;
    if (this.auth.login(username, password)) {
      this.router.navigate(['/clients']);
    } else {
      this.error = 'Nom d’utilisateur ou mot de passe incorrect';
    }
  }
}
