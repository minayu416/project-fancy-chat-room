import logo from './logo.svg';
import './App.css';

// function ChatRoom() {
//   const messagesRef = firestore.collection('messages')
//   const query = messagesRef.orderBy('createdAt').limit(10);

//   const [messages] = useCollectionData(query, {idField: 'id'})
// }


function App() {
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
          <ChatRoom />

        </div>

        {/* <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
      </header>
    </div>
  );
}


function ChatRoom(){

    return (
      <> 
      <div class='h-96 w-72 bg-black opacity-40 px-4 py-2'>
            <ChatMessage />
          </div>

          <div class='flex w-72 bg-black opacity-70 rounded-b-3xl'>
            <div class="ml-3 my-3 pr-30 text-slate-500 text-xs">Type message...</div>
            <div class="my-2 px-2 py-1 bg-green-700 rounded-2xl text-xs font-bold">SEND</div>
          </div>
      
      
      </>
    )
}


function ChatMessage(){

  return (
    <>
      <p>123123</p>
      <p>123123</p>
      <p>123123</p>
    </>
  )


}


export default App;
