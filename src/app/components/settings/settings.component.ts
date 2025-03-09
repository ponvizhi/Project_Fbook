import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {

  userForm: FormGroup;

  errorMessage: string = '';

  successMessage : string = '';

  resetForm: FormGroup;

  profileImageUrl: string = '';

  constructor(private authService :AuthService, private http: HttpClient, private fb : FormBuilder, private router : Router, private postService : PostService, private userService : UserService){
    this.userForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      gender: [''],
      dob: [''],
      email: [''],
      profileImageUrl: [''] 
    });

    //reset password
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(3)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });

  } 

  ngOnInit(): void{
    this.patchUserInfo();
    this.getUserProfileImage();
  }

  patchUserInfo(): void{
    const currentUser = this.authService.getCurrentUserSession();
    if(currentUser){
      this.userForm.patchValue({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        gender: currentUser.gender,
        dob: currentUser.dob,
        email: currentUser.email,
        profileImageUrl : currentUser.profileImageUrl
      })
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.userForm.patchValue({
        profileImage: file
      });
    }
  }

  onSave(): void {
    if (this.userForm.valid) {
      this.errorMessage = '';
      const formValue = this.userForm.value;
  
      // Simulate image upload if profileImageUrl is provided
      let imageUploadObservable: Observable<any> = of({ id: null, url: formValue.profileImageUrl });
  
      if (formValue.profileImageUrl) {
        imageUploadObservable = this.postService.simulateImageUpload(formValue.profileImageUrl);
      }
  
      imageUploadObservable.subscribe({
        next: (imageResponse) => {
          const updatedUser = { ...this.authService.getCurrentUserSession(), ...this.userForm.value };
          
          const userData = {
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            gender: updatedUser.gender,
            dob: updatedUser.dob,
            email: updatedUser.email,
            profileImageId: imageResponse.id // Use the simulated image ID
          };
  
          // Update in session storage
          this.authService.storeToken({ user: { ...updatedUser, ...userData } });
  
          // Update in backend
          this.http.patch(`http://localhost:3000/users/${updatedUser.id}`, userData).subscribe({
            next: (response) => {
              this.successMessage = 'Profile Updated Successfully!';
              this.getUserProfileImage();
              setTimeout(() => {
                this.successMessage = '';
              }, 2000);
            },
            error: (error) => {
              this.errorMessage = 'Error updating profile. Please try again later.';
              console.error('Error updating user info', error);
            }
          });
        },
        error: (error) => {
          this.errorMessage = 'Error uploading image. Please try again later.';
          console.error('Error uploading image', error);
        }
      });
    } else {
      this.userForm.markAllAsTouched();
      this.errorMessage = 'Please fill out all required fields.';
    }
  }
  

  // onSave(): void {
  //   if (this.userForm.valid) {
  //     this.errorMessage = '';
  //     const updatedUser = { ...this.authService.getCurrentUserSession(), ...this.userForm.value };
      
  //     // Simulate image upload
  //     this.postService.simulateImageUpload(this.userForm.value.profileImage).subscribe({
  //       next: (imageResponse) => {
  //         // Update user profile with the image ID
  //         const userData = {
  //           firstName: updatedUser.firstName,
  //           lastName: updatedUser.lastName,
  //           gender: updatedUser.gender,
  //           dob: updatedUser.dob,
  //           email: updatedUser.email,
  //           profileImageId: imageResponse.id // Use the simulated image ID
  //         };
  
  //         // Update in session storage
  //         this.authService.storeToken({ user: { ...updatedUser, ...userData } });
  
  //         // Update in backend
  //         this.http.patch(`http://localhost:3000/users/${updatedUser.id}`, userData).subscribe({
  //           next: (response) => {
  //             this.successMessage = 'Profile Updated Successfully!';
  //             this.getUserProfileImage();
  //             setTimeout(() => {
  //               this.successMessage = '';
  //             }, 2000);
  //           },
  //           error: (error) => {
  //             this.errorMessage = 'Error updating profile. Please try again later.';
  //             console.error('Error updating user info', error);
  //           }
  //         });
  //       },
  //       error: (error) => {
  //         this.errorMessage = 'Error uploading image. Please try again later.';
  //         console.error('Error uploading image', error);
  //       }
  //     });
  //   } else {
  //     this.userForm.markAllAsTouched();
  //     this.errorMessage = 'Please fill out all required fields.';
  //   }
  // }
  

  passwordMatchValidator(form: FormGroup){
    return form.get('newPassword')?.value === form.get('confirmPassword')?.value ? null : {mismatch: true};
  }

  onSubmit() {
    const newPassword = this.resetForm.value.confirmPassword;
    const authUser = this.authService.getCurrentUserSession();
    // Check if authUser is defined and has an id property
    if (authUser && authUser.id) {
      // authUser.password = newPassword;
  
      // console.log(authUser);
  
      // Update in session storage
      this.authService.storeAuthUserToken({ authUser });
  
      // Update in backend
      this.http.patch(`http://localhost:3000/users/${authUser.id}`, { password: newPassword }).subscribe({
        next: (response) => {
          // console.log('User info updated successfully', response);
          this.successMessage = 'Password updated successfully!';
          setTimeout(() => {
            this.successMessage = '';
            this.router.navigate(['/login']);
            this.authService.removeToken();
          }, 2000);
        },
        error: (error) => {
          console.error('Error updating user info', error);
        }
      });
    } else {
      console.error('User not found or invalid user session.');
    }
  }


  getUserProfileImage() {
    this.userService.getProfileImageUrl().subscribe({
      next: (response) => {
        this.profileImageUrl = response;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

}
