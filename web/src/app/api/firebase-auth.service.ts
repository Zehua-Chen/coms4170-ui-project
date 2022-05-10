import { Injectable } from '@angular/core';

import type { FirebaseApp } from 'firebase/app';
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDsUke3dHVP4FOS7xsl3iKfgG5SyxcebWk',
  authDomain: 'learn-otamatone-zc2616.firebaseapp.com',
  projectId: 'learn-otamatone-zc2616',
  storageBucket: 'learn-otamatone-zc2616.appspot.com',
  messagingSenderId: '264143054742',
  appId: '1:264143054742:web:31f5055d8c5031d07f5fb7',
};

@Injectable({ providedIn: 'root' })
export class FirebaseAuthService {
  app: FirebaseApp;

  constructor() {
    // Initialize Firebase
    this.app = initializeApp(firebaseConfig);
  }
}
