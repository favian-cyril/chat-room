import { useEffect, useState } from 'react';
import axios from 'axios';
import io, { Socket } from 'socket.io-client';

interface Message {
  username: string,
  message: string
}

const App = () => {
  const [usernameInput, setUsernameInput] = useState<string>('');
  const [roomIDInput, setRoomIDInput] = useState<string>('');
  const [username, setUsername] = useState<string | null>();
  const [roomID, setRoomID] = useState<string | null>()
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Get historical messages when user joins a chat room
    if (roomID) {
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/messages/${roomID}`).then((res: { data: Message[]}) => {
          setMessages(res.data.map(({ username, message }) => ({ username, message })));
      })
    }
  }, [roomID])
  useEffect(() => {
    // Establish a Socket.io connection with the server
    if (username && roomID) {
      const newSocket = io(import.meta.env.VITE_BACKEND_URL); // Replace with your server URL
  
      // Emit a 'joinRoom' event to the server with username and roomID
      newSocket.emit('joinRoom', { username, roomID });
  
      // Set up event listener for receiving chat messages from the server
      newSocket.on('message', (newMessage: Message) => {
        setMessages([...messages, newMessage]);
      });
  
      // Store the socket in the state to access it in other functions
      setSocket(newSocket);
      // Clean up the socket connection when the component unmounts
      return () => {
        newSocket.disconnect();
      };
    }
  }, [messages, roomID, username]);

  const handleMessageSubmit = () => {
    if (message && socket) {
      // Emit a 'chatMessage' event to the server with the message
      socket.emit('chatMessage', { roomID, username, message });

      // Clear the input field after sending the message
      setMessage('');
    }
  };

  const handleJoin = async () => {
    if (usernameInput && roomIDInput) {
      try {
        // Check if the username already exists in the chat room
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/join`, { username: usernameInput, roomID: roomIDInput });
        setUsername(usernameInput);
        setRoomID(roomIDInput);
        setUsernameInput('');
        setRoomIDInput('');
      } catch (error) {
        // If the username already exists, show an error message
        alert('Username already exists in this chat room. Please choose a different usernameInput.');
      }
    } else {
      alert('Please enter both usernameInput and room ID.');
    }
  };

  const handleExit = () => {
    // Closes connection and reset state when the user exits
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setRoomID(null);
      setUsername(null);
    }
  }

  return (
    <>
      {roomID ? (
        <div className="flex flex-col items-center justify-center h-screen max-w-md mx-auto">
          <div className="mb-4 w-full p-2">
            <div className="flex flex-row items-center">
              <button onClick={handleExit} className="btn btn-link text-primary btn-sm no-underline normal-case">Exit</button>
              <h1 className="text-3xl font-semibold mb-2 text-center mt-2 w-full">{roomID}</h1>
            </div>
            <div className="h-[70vh] w-full overflow-y-auto mb-4">
              {messages.map((msg, index) => (
                <div key={`${msg.username}-${index}`} className={msg.username === username ? 'chat chat-end' : 'chat chat-start'}>
                  <div className="chat-header">
                    {msg.username}
                  </div>
                  <div className={msg.username === username ? "chat-bubble bg-primary text-white" :  "chat-bubble bg-secondary text-black"}>{msg.message}</div>
                </div>
              ))}
            </div>
            <div className="join w-full">
              <input
                type="text"
                placeholder="Message here..."
                className="input input-bordered bg-secondary w-full rounded-l-full"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button onClick={handleMessageSubmit} className="btn btn-primary rounded-r-full text-white">
                <i className="fa-solid fa-arrow-up"></i>
              </button>
            </div>
          </div>
        </div>
      ) : (
      <div className="flex flex-col items-center justify-between max-w-md h-screen w-full p-2 mx-auto">
          <div className="w-full">
            <p className="text-3xl text-center font-bold mb-4">Join Chatroom</p>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Username"
                className="input input-bordered bg-secondary w-full"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
              />
            </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Room ID"
              className="input input-bordered bg-secondary w-full"
              value={roomIDInput}
              onChange={(e) => setRoomIDInput(e.target.value)}
              />
          </div>
          </div>
          <button onClick={handleJoin} className="btn btn-primary rounded-full text-white w-full mb-8">
            Join
          </button>
      </div>
      )}
    </>
  
  );
};

export default App;
