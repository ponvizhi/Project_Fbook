import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, find, map, mergeMap, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

const httpHeader = {
  headers : new HttpHeaders({'content-type' : 'application/json'})
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseURL : string = "http://localhost:3000/";

  isUserLoggedIn : boolean = false;

  isUser : boolean = true;

  constructor(private http : HttpClient, private authService : AuthService) { }


  registerUser(firstName: string, lastName: string, email: string, dob: string, gender: string, password: string, friends: any[]) : Observable<any>{
    const user = { firstName, lastName, email, dob, gender, password, friends };
    return this.http.post<any>(this.baseURL + 'users', user, httpHeader);
  }

  userLogin(email:string, password:string): Observable<any>{
    return this.http.get<any[]>(this.baseURL + 'users', httpHeader).pipe(
      map(users=>{
        const user = users.find(u=> u.email === email && u.password === password);

        if(user){
          // sessionStorage.setItem('currentUser', JSON.stringify(user));
          this.isUserLoggedIn = true;
          return{success : true, user}
        }else{
          throw new Error('Invalid Email / Password');
        }

      }),
        catchError(this.handleError)
    );
  }

  //Forget Password Authentication
  authUser(email: string, dob: string): Observable<any>{
      return this.http.get<any[]>(this.baseURL + 'users', httpHeader).pipe(
          map(users=>{
            const user = users.find(u=> u.email === email && u.dob === dob);
            if(user){
              // sessionStorage.setItem('authUser', JSON.stringify(user));
              this.isUser = true;
              return{success : true, user}
            }else{
              throw new Error('Invalid Email / DOB');
            }
          }),
          catchError(this.handleError)
      );
  }

//reset user password
resetPassword(password: string): Observable<any>{
  return this.http.patch<any>(this.baseURL + 'user', password);
}

//Fetch all users Name for Admin User List
getUserList(): Observable<any> {
  const currentUser = this.authService.getCurrentUserSession();
  return this.http.get<any[]>(this.baseURL + 'users', httpHeader).pipe(
    map(users=>
      users.filter(user=> user.id !== currentUser.id && !user.isAdmin).map(user=>({
        userId : user.id,
          firstName : user.firstName, 
          LastName: user.lastName,
          profileImageId: user.profileImageId,
          friends: user.friends
      }))
    )
  )
}

//Fetch all user except current logged-in user and admin
networkList(): Observable<any>{
  const currentUser = this.authService.getCurrentUserSession();

  return this.http.get<any[]>(this.baseURL + 'users', httpHeader).pipe(
    map(users => 
      users.filter(user=> user.id !== currentUser.id && !user.isAdmin).map(
        user=> ({
          userId : user.id,
          firstName : user.firstName, 
          LastName: user.lastName,
          profileImageId: user.profileImageId,
          friends: user.friends,
        })
      )
    )
  )
}

// Fetch friends list for the currently logged-in user
fetchFriendsList(): Observable<any[]>{
  const currentUser = this.authService.getCurrentUserSession();
  if(!currentUser || !currentUser.friends){
    return throwError('No friends list available for the current user');
  }
  return this.http.get<any[]>(this.baseURL + 'users', httpHeader).pipe(
    map(users => users.filter(user=> currentUser.friends.includes(user.id)))
  )
}

//Add friend to user
addFriend(userId: string, currentUserId: string): Observable<any> {
  // Retrieve the current user and update their friends list
  return this.http.get<any>(`${this.baseURL}users/${currentUserId}`).pipe(
    switchMap((user) => {
      // Ensure the friendId is not already in the friends list
      if (user.friends.includes(userId)) {
        alert('Friend already added.');
        return throwError('Friend already added.');
      }

      // Create the updated friends list
      const updatedFriendsList = [...user.friends, userId];

      // Perform the PATCH request to update the friends list
      return this.http.patch<any>(`${this.baseURL}users/${currentUserId}`, {
        friends: updatedFriendsList
      });
    }),
    catchError(error => {
      // Handle errors by showing an alert
      alert('Error updating friends list: ' + error.message);
      return throwError(error);
    })
  );
}

// Fetch image metadata based on image ID
getImageMetadata(imageId: string): Observable<any> {
  return this.http.get<any>(`${this.baseURL}files/${imageId}`);
} 

// Fetch image URL based on user ID
getProfileImageUrl(): Observable<string> {
  const currentUser = this.authService.getCurrentUserSession()
  if(!currentUser || !currentUser.profileImageId){
    return of('/assets/images/default-profile.png');
  }
  const profileImageId = currentUser.profileImageId;
  // console.log('Profile Image Id', profileImageId);

  return this.getImageMetadata(profileImageId).pipe(
    map(imageMetadata => {
      // console.log('Image Metadata:', imageMetadata); // Debugging
      return imageMetadata.url;
    }), 
    catchError(() => of('/assets/images/default-profile.png')) // Handle errors
  );
}


  private handleError(error: any): Observable<never> {
    let errorMessage: string;
  
    if (error instanceof Error) {
      // Client-side errors
      errorMessage = `Error: ${error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
  
    return throwError(errorMessage);
  }

}
