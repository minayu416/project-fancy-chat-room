// import logo from './logo.svg';

import React, { useRef, useState } from 'react';
import './App.css';

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { collection, getDocs, addDoc, query, orderBy, limit, getFirestore, serverTimestamp } from "firebase/firestore"

import { useAuthState } from 'react-firebase-hooks/auth';

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
const db = getFirestore(app);
const auth = getAuth(app);


function writeSendMessage(userId, name, text, imageUrl) {
  const messagesCollectionRef = collection(db, "messages")
  addDoc (messagesCollectionRef, 
    {
      userId: userId,
      displayName: name,
      text: text,
      createdAt: serverTimestamp(),
      photoURL : imageUrl
    }
    );
    console.log(serverTimestamp())
}

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header className="App-header">
        <div class='h-96 w-72'>
        <div class='flex w-72 bg-black opacity-70 rounded-t-3xl'>
          <div class="mx-3 my-2 bg-cyan-600 rounded-full h-10 w-10"></div>
            <div class="pr-chatroom">
            <p class="mt-2 text-sm">CHAT ROOM</p>
            <p class="text-slate-500 text-xs">Online</p>
            </div>
            <SignOut />
          </div>

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
      console.log(result)
      // const credential = GoogleAuthProvider.credentialFromResult(result);
      // const token = credential.accessToken;
      // const user = result.user;
    }).catch((error) => {
      // const errorCode = error.code;
      // const errorMessage = error.message;
      // const email = error.email;
      // const credential = GoogleAuthProvider.credentialFromError(error);
      console.log(error)
    });
  }

  return (
    <>
          <div class='h-96 w-72 bg-black bg-color-05 px-4 py-2'>
          <div class='bg-color-03 mt-3 p-2 rounded-md'>
          <p class="text-sm">Please, do not abuse, porn words and violent words, thanks for collaboration!</p>
          <p class="text-sm">請不要辱罵、色情及暴力言語，感謝合作！</p>
            <button className="my-2 px-2 py-1 bg-red-700 text-xs font-bold" onClick={signInWithGoogle}>Sign in with Google</button>
          </div>
          </div>

          <div class='flex w-72 bg-black bg-color-07 rounded-b-3xl'>
            <div class="ml-4 my-3 pr-30 text-gray-400 text-xs">Type message...</div>
            <div class="my-2 px-2 py-1 bg-green-700 rounded-2xl text-xs font-bold">SEND</div>
          </div>

    </>
  )

}

function SignOut() {
  return auth.currentUser && ( <>

      <button className="my-3 px-2 py-1 bg-gray-700 rounded-xl text-xs font-bold" onClick={() => auth.signOut()}>SignOut</button>

    </>
  )
}

function ChatRoom(){

  const dummy = useRef();

  const [formValue, setFormValue] = useState('');
  const { uid, displayName, photoURL } = auth.currentUser;

  const [messages, setMessages] = useState([]);
  const messagesCollectionRef = collection(db, "messages")

  // FIXME This will call Firebase constantly
  const getMessages = async () => {
    const que = await query(messagesCollectionRef, orderBy("createdAt", "desc"), limit(20));
    const data = await getDocs(que);
    setMessages(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
  };
  console.log("Get")
  getMessages()

  // userId, name, text, imageUrl
  const sendMessage = async (e) => {
    e.preventDefault();
    await writeSendMessage(uid, displayName, formValue, photoURL) 
    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }
  // console.log(dummy)

    return (
      <> 
        <div class='h-96 w-72 bg-black bg-color-04 px-4 py-2 main'>
      
          <span ref={dummy}></span>
      
          {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        
        </div>

          <form onSubmit={sendMessage} class='flex w-72 bg-black bg-color-07 rounded-b-3xl'>

          <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Type message..." class="ml-4 my-3 pr-20 placeholder:text-gray-400 text-white text-xs" />

          <button type="submit" disabled={!formValue} class="my-2 px-2 py-1 bg-green-700 rounded-2xl text-xs font-bold">SEND</button>

          </form>
      
      </>
    )
}


function ChatMessage(props) {
  const { userId, displayName, text, photoURL } = props.message;
  // console.log(auth.currentUser.uid)

  const messageClass = userId === auth.currentUser.uid ? 'sent' : 'received';

  if (messageClass === 'sent') {
    return (<>
      <div className={`message ${messageClass} flex mb-1 pl-24`}>
        <div class="h-10 w-10 mr-2">
        <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} class="rounded-full" />
        </div>
        <div class="py-1">
        <p class="text-xs">{displayName}</p>
        <p class="text-sm bg-color-03 rounded-md px-2">{text}</p>
        </div>
      </div>
    </>)
  } else {
    return (<>
      <div className={`message ${messageClass} flex mb-1 pr-24`}>
        <div class="h-10 w-10 mr-2">
        <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} class="rounded-full" />
        </div>
        <div class="py-1">
        <p class="text-xs">{displayName}</p>
        <p class="text-sm bg-color-03 rounded-md px-2">{text}</p>
        </div>
      </div>
    </>)
  }
}



export default App;


