import { Injectable } from '@angular/core';
import { Alert } from './../classes/alert';
import { AlertService } from './alert.service';
import { Observable, from } from 'rxjs';
import {AlertType } from './../enums/alert-type.enum';
import { Router } from '@angular/router';
import { User } from '../interfaces/user';
import { of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { switchMap } from 'rxjs/operators';
import 'firebase/firestore';
import { fromPromise } from 'rxjs/internal/observable/fromPromise';
import { Address } from '../classes/address';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public currentUser: Observable<User | null>;
  public currentUserSnapshot: User | null;

  constructor(
    private router: Router,
    private alertService: AlertService,
    private afAuth: AngularFireAuth,
    private db: AngularFirestore
  ) {
    this.currentUser = this.afAuth.authState
    .pipe((
      switchMap((user: any) => {
        if (user) {
          return this.db.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    ));

    this.setCurrentUserSnapshot();
  }

  public signup(firstname: string, lastname: string, email: string, idNumber: string, age: string, gender: string,
                qualification: string, employmentStatus: string, address: Address, votingStation: string,
                password: string): Observable<boolean> {
    return fromPromise(
      this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((user) => {

        const userRef: AngularFirestoreDocument<User> = this.db.doc(`users/${user.user.uid}`);
        const updatedUser = {
          id: user.user.uid,
          email: user.user.email,
          firstname,
          lastname,
          idNumber,
          age,
          gender,
          qualification,
          employmentStatus,
          address,
          votingStation,
          // tslint:disable-next-line: max-line-length
          photoUrl: 'https://firebasestorage.googleapis.com/v0/b/chat-1ca42.appspot.com/o/default-pic.png?alt=media&token=c5d9e207-48c7-44d0-9289-f3e7ba4604ea',
          quote: 'Life is like a box of chocolates, you never know what you are gonna get!',
          bio: 'Bio is under construction...'
        };
        userRef.set(updatedUser);
        return true;
      })
      .catch((err) => false)
    );
  }

  public login(email: string, password: string): Observable<boolean> {
    return fromPromise(
      this.afAuth.signInWithEmailAndPassword(email, password)
      .then((user) => true)
      .catch((err) => false)
    );
  }

  public logout(): void {
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/login']);
      this.alertService.alerts.next(new Alert('You have been signed out.'));
    });
  }

  private setCurrentUserSnapshot(): void {
    this.currentUser.subscribe(user => this.currentUserSnapshot = user);
  }
}
