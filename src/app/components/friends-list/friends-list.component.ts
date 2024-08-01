import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, map } from 'rxjs';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.css']
})
export class FriendsListComponent {

  friendsList: any[];
  allPost: any[];

  constructor(private userService: UserService, private router : Router, private postService: PostService){
    this.friendsList = [];
    this.allPost = [];
  }

  ngOnInit(): void {
    this.userService.fetchFriendsList().subscribe({
      next: (response) => {
        console.log('Friends List', response);
        this.friendsList = response;
  
        // Create an array of observables for fetching image metadata
        const imageMetadataObservables = this.friendsList.map(friend =>
          this.userService.getImageMetadata(friend.profileImageId).pipe(
            map(imageResponse => ({
              ...friend,
              profileImageUrl: imageResponse.url
            }))
          )
        );
  
        // Fetch image metadata for all friends in parallel
        forkJoin(imageMetadataObservables).subscribe({
          next: (updatedFriendsList) => {
            this.friendsList = updatedFriendsList;
            
            // Fetch all posts once
            this.postService.getAllPost().subscribe({
              next: (postResponse) => {
                this.allPost = postResponse;
  
                // Count posts for each friend
                this.friendsList.forEach(friend => {
                  friend.postCount = this.allPost.filter(post => post.userId === friend.id).length;
                });
              },
              error: (err) => {
                console.log('Error fetching posts', err);
              }
            });
          },
          error: (error) => {
            console.log('Error fetching image metadata', error);
          }
        });
      },
      error: (error) => {
        console.log('Error fetching friends list', error);
      }
    });
  }
  

  toNetwork(){
    this.router.navigate(['/network']);
  }

}
