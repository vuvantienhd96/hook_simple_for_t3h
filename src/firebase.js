
import firebase from 'firebase';
// Configure Firebase.
const config = {
    apiKey: process.env.REACT_APP_FIREBASE_API,
    //apiKey: process.env.FIREBASE_API_KEY,
    //authDomain: 't3hhomedemo.firebaseapp.com',
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: "t3hhomedemo",
    storageBucket: "t3hhomedemo.appspot.com",
    messagingSenderId: "123364986164",
    appId: '1:123364986164:web:00da41cad634d5f2186961',
    measurementId: "G-S0YEVL5TSQ"
  };
  
  firebase.initializeApp(config);
  
  // Configure FirebaseUI.
  export const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => false,
    },
  };

  export default firebase