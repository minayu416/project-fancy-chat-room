// import logo from './logo.svg';

import React, { useRef, useState, useEffect } from 'react';
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

// TODO Send out message apear
// TODO scroll messages
// TODO message push start from bottom

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
            <div>
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
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.log(error)
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

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom(){

  // const dummy = useRef();
  const dummy = useRef();

  const [formValue, setFormValue] = useState('');
  const { uid, displayName, photoURL } = auth.currentUser;

  // userId, name, text, imageUrl
  const sendMessage = async (e) => {
    e.preventDefault();
    await writeSendMessage(uid, displayName, formValue, photoURL) 
    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

    return (
      <> 
      <div class='h-96 w-72 bg-black opacity-40 px-4 py-2'>

        <MessageSection />
        <span ref={dummy}></span>
          </div>

          <form onSubmit={sendMessage} class='flex w-72 bg-black opacity-70 rounded-b-3xl'>

          <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Type message..." class="ml-4 my-3 pr-20 placeholder:text-gray-500 text-white text-xs" />

          <button type="submit" disabled={!formValue} class="my-2 px-2 py-1 bg-green-700 rounded-2xl text-xs font-bold">SEND</button>

          </form>
      
      </>
    )
}

function MessageSection(){
  const [messages, setMessages] = useState([]);
  const messagesCollectionRef = collection(db, "messages")

  useEffect(() => {
    
    const getMessages = async () => {
      // const data = await getDocs(messagesCollectionRef);
      const que = await query(messagesCollectionRef, orderBy("createdAt"), limit(7));
      const data = await getDocs(que);
      setMessages(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
    };

    getMessages()

  }, []);

  return ( <>
{messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
      </>
  );
}


function ChatMessage(props) {
  const { userId, displayName, text, photoURL } = props.message;
  // console.log(auth.currentUser.uid)

  const messageClass = userId === auth.currentUser.uid ? 'sent' : 'received';

  if (messageClass === 'sent') {
    return (<>
      <div className={`message ${messageClass} flex mb-1 justify-end`}>
        <div class="h-10 w-10 mr-2">
        <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} class="rounded-full" />
        </div>
        <div class="py-1">
        <p class="text-xs">{displayName}</p>
        <p class="text-sm">{text}</p>
        </div>
      </div>
    </>)
  } else {
    return (<>
      <div className={`message ${messageClass} flex mb-1`}>
        <div class="h-10 w-10 mr-2">
        <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} class="rounded-full" />
        </div>
        <div class="py-1">
        <p class="text-xs">{displayName}</p>
        <p class="text-sm">{text}</p>
        </div>
      </div>
    </>)
  }
}



export default App;


