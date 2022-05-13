import { ReplaySubject, Observable, map } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';

import type { Auth, User } from 'firebase/auth';
import {
  getAuth,
  signInWithPopup,
  connectAuthEmulator,
  GoogleAuthProvider,
  onAuthStateChanged,
} from 'firebase/auth';
import { FirebaseService } from './firebase.service';

import { environment } from 'environments/environment';

/**
 * State of the current user
 * - `User`: user has signed in
 * - `null`: user has not signed in
 */
export type UserState = User | null;

@Injectable({ providedIn: 'root' })
export class FirebaseAuthService {
  get user$(): Observable<UserState> {
    return this.#user$;
  }

  private auth: Auth;
  private googleProvider: GoogleAuthProvider;

  #user$: ReplaySubject<UserState> = new ReplaySubject<UserState>(1);

  constructor(private firebase: FirebaseService) {
    this.auth = getAuth(this.firebase.app);

    if (environment.mode === 'development') {
      connectAuthEmulator(this.auth, environment.authEmulatorUrl);
    }

    this.googleProvider = new GoogleAuthProvider();

    onAuthStateChanged(this.auth, (user) => {
      this.#user$.next(user);
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

@Injectable({ providedIn: 'root' })
export class FirebaseAuthGuard implements CanActivate, CanActivateChild {
  #canActivate: Observable<boolean | UrlTree>;

  constructor(private auth: FirebaseAuthService, private router: Router) {
    this.#canActivate = this.auth.user$.pipe(
      map((user) => (user ? true : this.router.parseUrl('/')))
    );
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return this.#canActivate;
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return this.#canActivate;
  }
}
