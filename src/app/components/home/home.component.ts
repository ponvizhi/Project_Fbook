import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  posts: any[];
  errorMessage: string;
  successMessage: string;

  createPostForm: FormGroup;

  constructor(private postService: PostService, private fb: FormBuilder, private authService: AuthService) {
    this.posts = [];
    this.errorMessage = '';
    this.successMessage = '';

    this.createPostForm = this.fb.group({
      postContent: new FormControl('', Validators.required),
      postImageUrl: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    this.fetchAllPost();
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.createPostForm.patchValue({
        postImage: file
      });
    }
  }

  createNewPost(): void {
    if (this.createPostForm.valid) {
      this.errorMessage = '';
      const newPost = this.createPostForm.value;
      const currentUser = this.authService.getCurrentUserSession();

      // Extract the image URL from the form value
      const imageUrl = newPost.postImageUrl;
      console.log('Image URL from form:', imageUrl);

      // Step 1: Simulate image upload
      this.postService.simulateImageUpload(imageUrl).subscribe({
        next: (imageResponse) => {
          // Step 2: Create the post with the image ID
          const postData = {
            userId: currentUser.id,
            content: newPost.postContent,
            imageId: imageResponse.id, // Use the simulated image ID
            timestamp: new Date().toISOString()
          };

          this.postService.addNewPost(postData).subscribe({
            next: (response) => {
              this.successMessage = 'Post created successfully';
              setTimeout(() => {
                this.successMessage = '';
              }, 2000);

              this.fetchAllPost(); // Refresh the posts list
            },
            error: (err) => {
              this.errorMessage = 'Error creating post';
              console.error(err);
            }
          });
        },
        error: (error) => {
          this.errorMessage = 'Error uploading image';
          console.error(error);
        }
      });
    } else {
      this.createPostForm.markAllAsTouched();
      this.errorMessage = 'One are More Field is Required';
    }
  }


  // createNewPost(): void {
  //   if (this.createPostForm.valid) {
  //     this.errorMessage = '';
  //     const newPost = this.createPostForm.value;
  //     const currentUser = this.authService.getCurrentUserSession();

  //     // Step 1: Simulate image upload
  //     this.postService.simulateImageUpload(newPost.postImage).subscribe({
  //       next: (imageResponse) => {
  //         // Step 2: Create the post with the image ID
  //         const postData = {
  //           userId: currentUser.id,
  //           content: newPost.postContent,
  //           imageId: imageResponse.id, // Use the simulated image ID
  //           timestamp: new Date().toISOString()
  //         };

  //         this.postService.addNewPost(postData).subscribe({
  //           next: (response) => {
  //             this.successMessage = 'Post created successfully';
  //             setTimeout(() => {
  //               this.successMessage = '';
  //             }, 2000);

  //             this.fetchAllPost(); // Refresh the posts list
  //           },
  //           error: (err) => {
  //             this.errorMessage = 'Error creating post';
  //             console.error(err);
  //           }
  //         });
  //       },
  //       error: (error) => {
  //         this.errorMessage = 'Error uploading image';
  //         console.error(error);
  //       }
  //     });
  //   } else {
  //     this.createPostForm.markAllAsTouched();
  //     this.errorMessage = 'One are More Field is Required';
  //   }
  // }

  fetchAllPost(): void {
    this.postService.getAllPost().subscribe({
      next: (response) => {
        this.posts = response;
        // console.log(response);
        this.posts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      },
      error: (error) => {
        this.errorMessage = 'Error fetching post list';
        console.error(error);
      }
    });
  }
}
