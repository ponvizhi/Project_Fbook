import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  errorMessage : string = '';
  successMessage : string = '';

  registerForm = new FormGroup({
    firstName : new FormControl('', Validators.required),
    lastName : new FormControl('', Validators.required),
    email : new FormControl('', [Validators.required, Validators.email]),
    dob : new FormControl('',Validators.required),
    gender : new FormControl('', Validators.required),
    password : new FormControl('', Validators.required)
  })

  constructor(private userService: UserService, private router : Router){}

  register(){ 

    if(this.registerForm.valid){
      this.errorMessage = '';
      const { firstName, lastName, email, dob, gender, password } = this.registerForm.value;
      const friends : any[] = []; 
      this.userService.registerUser(firstName!, lastName!, email!, dob!, gender!, password!, friends).subscribe({
        next: (response)=>{
          this.successMessage = 'Registered Successfully!'
          setTimeout(()=>{
            this.successMessage = '';
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error)=>{
          console.log('Error in user registration', error);
        }
      });
    }else{
      this.registerForm.markAllAsTouched();
      this.errorMessage = "One or More Fields are Missing";
    }

  }

}
