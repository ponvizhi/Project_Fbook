import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  errorMessage: string = '';


 constructor(private userService: UserService, private router : Router,
             private authService : AuthService
 ){}

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password : new FormControl('', Validators.required)
  })

  onLogin(){

    if(this.loginForm.valid){
        
      const{email, password} = this.loginForm.value;

      this.userService.userLogin(email!, password!).subscribe({
        next: (response)=>{
          response.user.password = ''; // Clear the password in the user object
          this.authService.storeToken(response);
          this.router.navigate(['/home']);
        },
        error: (error)=>{
          this.errorMessage = error;
        }
      })


    }else{
      this.loginForm.markAllAsTouched();
      this.errorMessage = "Email or Password is incorrect";
    }

  }

}
