import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {

  authForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private userService : UserService, private router: Router, private authService: AuthService) {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      dob: ['', [Validators.required, Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)]]
    });
  }

  onSubmit() {
    if(this.authForm.valid){

      const{email, dob} = this.authForm.value;

      this.userService.authUser(email!, dob!).subscribe({
        next: (response)=>{
          this.authService.storeAuthUserToken(response);
          this.router.navigate(['/reset-password']);
        },
        error: (error)=>{
          this.errorMessage = error;
        }
      })

    }else{
      this.authForm.markAllAsTouched();
      this.errorMessage = "Email or Password is incorrect";
    }
  }

}
