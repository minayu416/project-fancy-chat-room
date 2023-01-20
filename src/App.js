// import logo from './logo.svg';

import React, { useRef, useState } from 'react';
import './App.css';

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getDatabase, ref, set, onValue } from 'firebase/database';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

// firebase related code
const firebaseConfig = {
  apiKey: "AIzaSyAiuaSJahJeYlOxrz6-TIQ5H1vqu4p1-8o",
  authDomain: "fancy-chatroom.firebaseapp.com",
  databaseURL: "https://fancy-chatroom-default-rtdb.firebaseio.com",
  projectId: "fancy-chatroom",
  storageBucket: "fancy-chatroom.appspot.com",
  messagingSenderId: "490120962132",
  appId: "1:490120962132:web:35ea4e15bfcd527dc84dc1",
  measurementId: "G-RC7E0JNLHS"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

function writeSendMessage(userId, text, email, imageUrl) {
  // const db = getDatabase();
  set(ref(db, 'messages/' + userId), {
    userId: userId,
    text: text,
    createdAt: email,
    photoURL : imageUrl
  });
}

function App() {

  // Read Data
  // const starCountRef = ref(db, 'users/');
  // onValue(starCountRef, (snapshot) => {
  //   const data = snapshot.val();
  //   console.log(data)
  // });

  const [user] = useAuthState(auth);
  console.log([user])

  return (
    <div className="App">
      <header className="App-header">
        <div class='h-96 w-72'>
        <div class='flex w-72 bg-black opacity-70 rounded-t-3xl'>
          <div class="mx-3 my-2 bg-cyan-600 rounded-full h-10 w-10"></div>
            <div>
            <p class="mt-2 text-sm">CHAT ROOM</p>
            <p class="text-slate-500 text-xs">Online</p>
            </div>
          </div>
          
          {/* <ChatRoom /> */}
          {user ? <ChatRoom /> : <SignIn />}

        </div>

      </header>
    </div>
  );
}


function SignIn() {
    const provider = new GoogleAuthProvider();
    
    signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      console.log("result:")
      console.log(result)
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
    });

  return (
    <>
      <button className="sign-in" onClick={signInWithPopup}>Sign in with Google</button>
      <p>Do not violate the community guidelines or you will be banned for life!</p>
    </>
  )

}

// const login = () => {
//   signInWithPopup(auth, provider)
//       .then((result) => {
//           // This gives you a Google Access Token. You can use it to access the Google API.
//           const credential = GoogleAuthProvider.credentialFromResult(result);
//           const token = credential?.accessToken;
//           // The signed-in user info.
//           const user = result.user;
//           console.log({ credential, token, user });
//       })
//       .catch((error) => {
//           // Handle Errors here.
//           const errorCode = error.code;
//           const errorMessage = error.message;
//           // The email of the user's account used.
//           const email = error.email;
//           // The AuthCredential type that was used.
//           const credential = GoogleAuthProvider.credentialFromError(error);
//           console.log({ errorCode, errorMessage, email, credential });
//       });
// };

// TODO
// function SignOut() {
//   return auth.currentUser && (
//     <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
//   )
// }

// const logout = () => {
//   auth.signOut();
//   console.log("logout");
// };


function ChatRoom(){

  // const dummy = useRef();

  // const messagesRef = firestore.collection('messages');
  // const query = messagesRef.orderBy('createdAt').limit(25);

  // const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');

  // TODO need tto change
  const sendMessage = async (e) => {
    e.preventDefault();
    await writeSendMessage("1",formValue, "3", "4") 
    setFormValue('');
  }

    return (
      <> 
      <div class='h-96 w-72 bg-black opacity-40 px-4 py-2'>

        {/* {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)} */}

        {/* <span ref={dummy}></span> */}
          </div>

          <form onSubmit={sendMessage} class='flex w-72 bg-black opacity-70 rounded-b-3xl'>

          <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Type message..." class="ml-4 my-3 pr-20 placeholder:text-gray-500 text-white text-xs" />

          <button type="submit" disabled={!formValue} class="my-2 px-2 py-1 bg-green-700 rounded-2xl text-xs font-bold">SEND</button>

          </form>

          {/* <div class='flex w-72 bg-black opacity-70 rounded-b-3xl'>
            <div class="ml-3 my-3 pr-30 text-slate-500 text-xs">Type message...</div>
            <div class="my-2 px-2 py-1 bg-green-700 rounded-2xl text-xs font-bold">SEND</div>
          </div> */}
      
      </>
    )
}


// function ChatMessage(props) {
//   const { text, uid, photoURL } = props.message;

//   const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

//   return (<>
//     <div className={`message ${messageClass}`}>
//       <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
//       <p>{text}</p>
//     </div>
//   </>)
// }



export default App;


