// import logo from './logo.svg';

import React, { useRef, useState } from 'react';
import './App.css';

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { serverTimestamp, getDatabase, ref, set, push, get, child, query, orderByChild, limitToFirst, limitToLast } from 'firebase/database';

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

function writeSendMessage(userId, name, text, imageUrl) {
  // const db = getDatabase();
  const postListRef = ref(db, 'messages');
  const newPostRef = push(postListRef);
  set(newPostRef, {
    userId: userId,
    name: name,
    text: text,
    createdAt: serverTimestamp(),
    photoURL : imageUrl
  });

  // set(ref(db, 'messages/' + userId), {
  //   userId: userId,
  //   name: name,
  //   text: text,
  //   createdAt: serverTimestamp(),
  //   photoURL : imageUrl
  // });
}

function getMessages(){
  const que = query(ref(db, 'messages'), orderByChild('createdAt'), limitToLast(10));
  get(que).then((snapshot) => {
    if (snapshot.exists()) {
      const messages = []
      snapshot.forEach(childSnapshot => {
        messages.push(childSnapshot.val())
      })
      console.log(messages)
      return messages
      // console.log(getMessages);
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
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

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
    });
  }

  return (
    <>
          <div class='h-96 w-72 bg-black opacity-40 px-4 py-2'>

          <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
            <p>Do not violate the community guidelines or you will be banned for life!</p>
          </div>

          <div class='flex w-72 bg-black opacity-70 rounded-b-3xl'>
            <div class="ml-4 my-3 pr-30 text-slate-500 text-xs">Type message...</div>
            <div class="my-2 px-2 py-1 bg-green-700 rounded-2xl text-xs font-bold">SEND</div>
          </div>

    </>
  )

}

// TODO
// function SignOut() {
//   return auth.currentUser && (
//     <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
//   )
// }

function ChatRoom(){

  // const dummy = useRef();
  // const que = query(ref(db, 'messages'), orderByChild('createdAt'), limitToLast(10));
  
  // TODO 
  const messages = getMessages()
  console.log(messages)

  const [formValue, setFormValue] = useState('');
  const { uid, displayName, photoURL } = auth.currentUser;

  // userId, name, text, imageUrl
  const sendMessage = async (e) => {
    e.preventDefault();
    await writeSendMessage(uid, displayName, formValue, photoURL) 
    setFormValue('');
  }

    return (
      <> 
      <div class='h-96 w-72 bg-black opacity-40 px-4 py-2'>

        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

        {/* <span ref={dummy}></span> */}
          </div>

          <form onSubmit={sendMessage} class='flex w-72 bg-black opacity-70 rounded-b-3xl'>

          <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Type message..." class="ml-4 my-3 pr-20 placeholder:text-gray-500 text-white text-xs" />

          <button type="submit" disabled={!formValue} class="my-2 px-2 py-1 bg-green-700 rounded-2xl text-xs font-bold">SEND</button>

          </form>
      
      </>
    )
}


function ChatMessage(props) {
  const { uid, displayName, text, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
      <p>{displayName}</p>
      <p>{text}</p>
    </div>
  </>)
}



export default App;


