import { Injectable } from '@angular/core';

import type { FirebaseApp, FirebaseOptions } from 'firebase/app';
import { initializeApp } from 'firebase/app';

// Your web app's Firebase configuration
const firebaseConfig: FirebaseOptions = {
  apiKey: 'AIzaSyDsUke3dHVP4FOS7xsl3iKfgG5SyxcebWk',
  authDomain: 'learn-otamatone-zc2616.firebaseapp.com',
  projectId: 'learn-otamatone-zc2616',
  storageBucket: 'learn-otamatone-zc2616.appspot.com',
  messagingSenderId: '264143054742',
  appId: '1:264143054742:web:31f5055d8c5031d07f5fb7',
};

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  app: FirebaseApp;

  constructor() {
    // Initialize Firebase
    this.app = initializeApp(firebaseConfig);
  }
}
