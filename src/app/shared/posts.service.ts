import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

import { Post, FirebaseCreateResponse } from './interfaces';

@Injectable({ providedIn: 'root' })
export class PostsService {
  constructor(private http: HttpClient) {}

  create(post: Post): Observable<Post> {
    return this.http.post(`${environment.firebaseDbUrl}/posts.json`, post).pipe(
      map((response: FirebaseCreateResponse) => {
        return {
          ...post,
          id: response.name,
          date: new Date(post.date),
        };
      })
    );
  }

  getAllPosts(): Observable<Post[]> {
    return this.http.get(`${environment.firebaseDbUrl}/posts.json`).pipe(
      map((response: { [key: string]: any }) => {
        return Object.entries(response).map(([key, item]) => ({
          ...item,
          id: key,
          date: new Date(item.date),
        }));
      })
    );
  }

  getPostById(id: string): Observable<Post> {
    return this.http
      .get<Post>(`${environment.firebaseDbUrl}/posts/${id}.json`)
      .pipe(
        map((post: Post) => {
          return {
            ...post,
            id,
            date: new Date(post.date),
          };
        })
      );
  }

  updatePost(post: Post): Observable<Post> {
    return this.http.patch<Post>(
      `${environment.firebaseDbUrl}/posts/${post.id}.json`,
      post
    );
  }

  deletePost(postId: string): Observable<void> {
    return this.http.delete<void>(
      `${environment.firebaseDbUrl}/posts/${postId}.json`
    );
  }
}
