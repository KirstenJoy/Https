import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpContext } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { allBooks, allReaders } from 'app/data';
import { Reader } from "app/models/reader";
import { Book } from "app/models/book";
import { OldBook } from 'app/models/oldBook';
import { BookTrackerError } from 'app/models/bookTrackerError';
import { CACHEABLE } from './cache.interceptor';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  mostPopularBook: Book = allBooks[0];

  setMostPopularBook(popularBook: Book): void {
    this.mostPopularBook = popularBook;
  }

  getAllReaders(): Reader[] {
    return allReaders;
  }

  getReaderById(id: number): Reader {
    return allReaders.find(reader => reader.readerID === id);
  }

  getAllBooks(): Observable<Book[] | BookTrackerError> {
    return this.http.get<Book[]>('/api/books', {
      context: new HttpContext().set(CACHEABLE, false)
    })
    .pipe(
      catchError(err => this.handleHttpError(err))
    );
  }

  private handleHttpError(error: HttpErrorResponse): Observable<BookTrackerError>{
    let dataError = new BookTrackerError();
    dataError.errorNumber = 100;
    dataError.message = error.statusText;
    dataError.friendlyMessage = 'An erro occurred retrieving data.';
    return throwError(dataError);
  }

  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`/api/books/${id}`, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization' : 'my-token'
      })
    });
  }  

  getOldBookById(id:number) : Observable<OldBook>{
    return this.http.get<Book>(`/api/books/${id}`)
    .pipe(
      map(b => <OldBook>{
        bookTitle: b.title,
        year: b.publicationYear
      }),
      tap(classicBook => console.log(classicBook))
    )
  }

  addBook(newBook: Book) :Observable<Book>{
    return this.http.post<Book>('/api/books', newBook, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
}

updateBook(updatedBook: Book) :Observable<void>{
  return this.http.post<void>(`/api/books/${updatedBook.bookID}`, updatedBook, {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  });
}

deleteBook(bookID: number): Observable<void>{
  return this.http.delete<void>(`/api/books/${bookID}`)
}
}
