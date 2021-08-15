import './App.css';
import React, { useState, useEffect } from 'react'
// import Header from './Component/header/header';
// import firebase insignt
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase, { uiConfig } from './firebase';
import Page from './Component/Page';



function App() {
  const [isSignedIn, setIsSignedIn] = useState(false); // Local signed-in state.

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
      setIsSignedIn(!!user);
      
      if(!!user){
        let token = user.getIdToken();  
        console.log('token', token);
        console.log('name', user.displayName);
        console.log('user', user.uid);
      }
    });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  // return (
  //   <div className="App">
  //     <Header />
      
  //   </div>
  // );
  if (!isSignedIn) {
    return (
      <div>
        <h1>My App</h1>
        <p>Please sign-in:</p>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
      </div>
    );
  }
  return (
    <div>
      <h1>My App</h1>
      <p>Welcome {firebase.auth().currentUser.displayName}! You are now signed-in!</p>
      <button onClick={() => firebase.auth().signOut()}>Sign-out</button>
      <Page />
    </div>
  );
}

export default App;
