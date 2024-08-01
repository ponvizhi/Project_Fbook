import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  friendsList: any[];
  allPost: any[];
  postCount: number;
  friendsCount:number;
  profileImageUrl: string = '';

  constructor(private userServie : UserService, private postService : PostService, private authService : AuthService){
    this.friendsList = [];
    this.allPost = [];
    this.postCount = 0;
    this.friendsCount = 0;
  }

  ngOnInit(){
    
    this.getConnectionCount();
    this.getPostCount();
    this.getUserProfileImage();

}

// count number of connecttions
getConnectionCount(){
  this.userServie.fetchFriendsList().subscribe({
    next: (response)=>{
      this.friendsList = response;
      this.friendsCount = this.friendsList.length// Calculate the count
    },
    error: (error) => {
      console.log('Error fetching friends list', error);
    }
  })
}
 
//count number of post
getPostCount(){

  let currentUser = this.authService.getCurrentUserSession();

  this.postService.getAllPost().subscribe({
      next: (response)=>{
        this.allPost = response;

        if(this.allPost && this.allPost.length){
          
          const userPosts = this.allPost.filter(post => post.userId === currentUser.id);
          this.postCount = userPosts.length;

        }else{
          console.log('you have zero post')
        }

      },
      error: (error)=>{
        console.log('Error fetching post list', error);
      }
  })
}

getUserProfileImage() {
  this.userServie.getProfileImageUrl().subscribe({
    next: (response) => {
      this.profileImageUrl = response;
      // console.log(response);
    },
    error: (error) => {
      console.error(error);
    }
  });
}

}