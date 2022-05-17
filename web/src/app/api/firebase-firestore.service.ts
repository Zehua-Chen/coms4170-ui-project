import { Injectable } from '@angular/core';

import {
  getFirestore,
  connectFirestoreEmulator,
  Firestore,
} from 'firebase/firestore';

import { FirebaseService } from './firebase.service';

import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class FirebaseFirestoreService {
  public firestore: Firestore;

  constructor(private firebase: FirebaseService) {
    this.firestore = getFirestore(firebase.app);

    if (environment.mode === 'development') {
      connectFirestoreEmulator(
        this.firestore,
        environment.firestoreEmulator.host,
        environment.firestoreEmulator.port
      );
    }
  }
}
