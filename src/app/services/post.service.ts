import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

const httpHeaders = {
  headers: new HttpHeaders({'content-type' : 'application/json'})
}

const baseUrl = 'http://localhost:3000/';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) { }

  getAllPost(): Observable<any[]> {
    return this.http.get<any[]>(baseUrl + 'posts').pipe(
      mergeMap(posts => {
        const requests = posts.map(post =>
          this.getPostImageId(post.imageId).pipe(
            map(image => ({ ...post, imageUrl: image.url }))
          )
        );
        return forkJoin(requests);
      })
    );
  }

  getPostImageId(id: string): Observable<any> {
    return this.http.get<any>(`${baseUrl}files/${id}`);
  }
 
  simulateImageUpload(file: File): Observable<any> {
    // Generate a new ID for the image
    const newImageId = Math.floor(Math.random() * 10000).toString();
    const imageUrl = `/assets/images/${file.name}`;

    // Simulate adding the image metadata to the files endpoint
    return this.http.get<any[]>(`${baseUrl}files`).pipe(
      mergeMap(files => {
        const updatedFiles = [...files, { id: newImageId, type: 'image', url: imageUrl }];
        return this.http.post(`${baseUrl}files`, { id: newImageId, type: 'image', url: imageUrl }).pipe(
          map(() => ({ id: newImageId, url: imageUrl }))
        );
      })
    );
  }

  addNewPost(postData: any): Observable<any> {
    return this.http.post<any>(baseUrl + 'posts', postData, httpHeaders);
  }
}
