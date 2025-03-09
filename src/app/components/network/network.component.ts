import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css']
})
export class NetworkComponent {

  allregUsers: any[];
  isFriend: boolean;
  allPost: any[];
  postCount: number;

  constructor(private userService: UserService, private authService : AuthService, private postService : PostService){
    this.allregUsers = [];
    this.isFriend = false;
    this.allPost = [];
    this.postCount=0;
  }

  ngOnInit() {
    this.userService.networkList().subscribe({
      next: (response) => {
        this.allregUsers = response;
        console.log('network list:', response);
        this.allregUsers.forEach(user => {
          // Fetching image metadata for each user
          this.userService.getImageMetadata(user.profileImageId).subscribe({
            next: (imageResponse) => {
              user.profileImageUrl = imageResponse.url;
            },
            error: (error) => {
              console.log(`Error fetching image metadata for profileImageId ${user.profileImageId}`, error);
            }
          }); 
  
          // Initializing post count to zero for each user
          user.postCount = 0;
  
          // Fetching all posts and counting posts for each user
          this.postService.getAllPost().subscribe({
            next: (postResponse) => {
              this.allPost = postResponse;
              if (this.allPost && this.allPost.length) {
                const userPosts = this.allPost.filter(post => post.userId === user.userId);
                user.postCount = userPosts.length;
              } else {
                console.log('You have zero posts');
              }
            },
            error: (error) => {
              console.log('Error fetching posts', error);
            }
          });
        });
      },
      error: (error) => {
        console.log('Error fetching network list', error);
      }
    });
  }
  


  addFriend(userId: string): void {
    const currentUser = this.authService.getCurrentUserSession();
  
    if (!currentUser) {
      console.error('No user session found.');
      return;
    }
  
    if (currentUser.friends.includes(userId)) {
      alert('Friend already added.');
      return;
    }
  
    // Call the service to update the friend list
    this.userService.addFriend(userId, currentUser.id).subscribe({
      next: (response) => {
        // Update the friends list in the current session
        currentUser.friends.push(userId);
        sessionStorage.setItem('userInfo', JSON.stringify({ user: currentUser }));
  
        alert('Friend request sent!');
      },
      error: (error) => {
        alert('Error adding friend: ' + error.message);
      }
    });
  }
  

  isFriends(userId: string): boolean{
    return this.authService.getCurrentUserSession().friends.includes(userId);
  }

}
