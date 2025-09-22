import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule, NgIf } from '@angular/common'; // <-- Ajout


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule, NgIf],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']  // <-- Assure-toi que ce fichier existe
})
export class RegisterComponent {
  registerForm: FormGroup;
  error = '';
  success = ''; // Ajout de la propriété

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  onSubmit() {
    const { username, password, confirmPassword } = this.registerForm.value;
    this.success = ''; // Réinitialise le message de succès
    if (password !== confirmPassword) {
      this.error = 'Les mots de passe ne correspondent pas';
      return;
    }
    if (this.auth.register({ username, password })) {
      this.success = 'Inscription réussie !';
      this.error = '';
      // Optionnel : redirection après un délai
      setTimeout(() => this.router.navigate(['/login']), 1500);
    } else {
      this.error = 'Nom d’utilisateur déjà utilisé';
      this.success = '';
    }
  }
}
