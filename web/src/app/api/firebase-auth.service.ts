import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import type { Auth, User } from 'firebase/auth';
import {
  getAuth,
  signInWithPopup,
  connectAuthEmulator,
  GoogleAuthProvider,
  onAuthStateChanged,
} from 'firebase/auth';
import { FirebaseService } from './firebase.service';

@Injectable({ providedIn: 'root' })
export class FirebaseAuthService {
  get user$(): Observable<User | null> {
    return this.#user;
  }

  private auth: Auth;
  private googleProvider: GoogleAuthProvider;

  #user: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

  constructor(private firebase: FirebaseService) {
    this.auth = getAuth(this.firebase.app);
    connectAuthEmulator(this.auth, 'http://localhost:9099');

    this.googleProvider = new GoogleAuthProvider();

    onAuthStateChanged(this.auth, (user) => {
      this.#user.next(user);
    });
  }

  /**
   * Signin with Google
   */
  public async signinWithGoogle(): Promise<void> {
    await signInWithPopup(this.auth, this.googleProvider).then(
      (credential) => {}
    );
  }
}
