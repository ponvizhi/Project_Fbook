import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent {

  allUsers: any[];
  userInfo: any[];
  allPost: any[];

  constructor(private userService: UserService, private authService: AuthService, private postService: PostService) {
    this.allUsers = [];
    this.userInfo = [];
    this.allPost = [];
  }

  ngOnInit() {
    this.userService.getUserList().subscribe({
      next: (response) => {
        // console.log('user list', response)
        this.allUsers = response;

        this.allUsers.forEach(user => {
          this.userService.getImageMetadata(user.profileImageId).subscribe({
            next: (imageResponse) => {
              user.profileImageUrl = imageResponse.url;
            },
            error: (imageError) => {
              console.log(`Error fetching user metadata for profileImageId ${user.profileImageId}`, imageError);
            }
          });
          user.postCount = 0;
          this.postService.getAllPost().subscribe({
            next: (postResponse) => {
              this.allPost = postResponse;
              if (this.allPost && this.allPost.length) {
                const userPost = this.allPost.filter(post => post.userId === user.userId);
                user.postCount = userPost.length;

              }
            },
            error: (postError) => {
              console.log('Error fetching posts', postError);
            }
          });
        });
      },
      error: (error) => {
        console.log('Error fetching user list', error);
      }
    })
  }

}