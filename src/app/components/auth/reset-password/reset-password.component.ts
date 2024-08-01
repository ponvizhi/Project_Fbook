import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {

  resetForm: FormGroup;

  errorMessage: string = '';

  successMessage : string = '';

  constructor(private fb: FormBuilder, private userService : UserService, private authService :AuthService, private http: HttpClient, private router : Router){
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(3)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup){
    return form.get('newPassword')?.value === form.get('confirmPassword')?.value ? null : {mismatch: true};
  }

  onSubmit(){
    const newPasword = this.resetForm.value.confirmPassword;
    const authUser = this.authService.getCurrentAuthUserSession();
    authUser.password = newPasword;

    console.log(authUser);
    // Update in session storage
    this.authService.storeAuthUserToken({authUser});

    // Update in backend
    this.http.patch(`http://localhost:3000/users/${authUser.id}`, { password: newPasword }).subscribe({
      next: (response)=>{
        console.log('User info updated successfully', response);
        this.successMessage = 'Password updated successfully!';
        setTimeout(()=>{
          this.successMessage = '';
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error)=>{
        console.error('Error updating user info', error);
      }
    })
  }

}
