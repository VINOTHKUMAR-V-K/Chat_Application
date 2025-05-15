import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import '../Chat/Chat.css'
import socket from "../../utils/socket";
import API from "../../utils/api";

const Chat = () => {
  const { chatId } = useParams(); // Extract chatId from the route
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [recipient, setRecipient] = useState(null);
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState("");

  useEffect(() => {
    if (!chatId) {
      console.error("Chat ID is undefined.");
      return;
    }

    // Fetch chat details and set currentUser and recipient
    const fetchChatDetails = async () => {
      try {
        const { data } = await API.get(`/api/chat/${chatId}`);
        setCurrentUser([data.currentUser, data.currentUserName]);
        setRecipient(data.recipient.name);
        setMessages(Array.isArray(data.messages) ? data.messages : [data.messages]);

        // Join the chat room after fetching details
        socket.emit("join_chat", chatId);
      } catch (error) {
        console.error("Failed to fetch chat details:", error);
      }
    };

    fetchChatDetails();

    // Clean up the socket listener on unmount
    return () => socket.emit("leave_chat", chatId);
  }, [chatId]);

  useEffect(() => {
    // Listen for incoming messages
    socket.on("receive_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);



  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setMediaFile(selectedFile);

    if (selectedFile) {
      const fileReader = new FileReader();
      fileReader.onload = (e) => setMediaPreview(e.target.result);
      fileReader.readAsDataURL(selectedFile);
    }
  };


  const sendMessage = async () => {
    if (newMessage.trim() != "") {
      const message = {
        sender: currentUser[0],
        senderName: currentUser[1],
        chat: chatId,
        content: newMessage,
      };

      try {
        // Emit the message to the server
        socket.emit("send_message", message);

        // Update the local message list
        // setMessages((prev) => [...prev, { ...message, timestamp: new Date().toISOString() }]);
        setNewMessage(""); // Clear the input field
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    } else if(mediaFile) {
      const formData = new FormData();
      formData.append("file", mediaFile);
      try {
        const message = {
          sender: currentUser[0],
          senderName: currentUser[1],
          chat: chatId,
          content: "fileUpload",
        };
        const response = await API.post("/api/chat/message", formData, { params: message });
        console.log("Media uploaded:", response.data);
        setMediaPreview("");
        setMediaFile(null); // Reset file state after upload
      } catch (error) {
        console.error("Failed to upload media:", error);
      }
    } else {
      return
    }
  };

  // const uploadMedia = async () => {
  //   if (!mediaFile) return;

  //   const formData = new FormData();
  //   formData.append("file", mediaFile);

  //   try {
  //     const message = {
  //       sender: currentUser[0],
  //       senderName: currentUser[1],
  //       chat: chatId,
  //       content: "fileUpload",
  //     };
  //     const response = await API.post("/api/chat/message", formData, { params: message });
  //     console.log("Media uploaded:", response.data);
  //     setMediaPreview("");
  //     setMediaFile(null); // Reset file state after upload
  //   } catch (error) {
  //     console.error("Failed to upload media:", error);
  //   }
  // };

  return (
    <div style={{ margin: '20px', textAlign: 'center', position: 'relative' }}>
      <h2 className="fw-bold my-3">Chat with {recipient ? recipient : "Unknown User"}</h2>
      <div>
        <div className="message-container" style={{ width: '80%', height: '550px', margin: 'auto', position: 'relative' }}>
          {messages.map((msg, index) => (
            <>
              <div key={index} className={msg.sender === currentUser[0] ? "sent" : "received"}>
                <p className="btn btn-warning" style={{ padding: '2px 7px' }}>
                  <strong className="fw-bold" >{msg.senderName}:</strong>
                </p>
                {msg.content.includes("amazonaws.com") ? <div>
                  {msg.content.match(/\.(jpe?g|png|gif|mp4)$/) ? (
                    <img src={msg.content} alt="Media" style={{ width: "200px", height: "200px" }} />
                  ) : (
                    <video src={msg.content} controls style={{ width: "200px", height: "200px" }} />
                  )}
                </div> :
                  <div className="rounded-3" style={{ fontSize: '18px' }}>
                    {msg.content}
                  </div>
                }
                <span style={{ fontSize: '12px' }}>{new Date(msg.timestamp).toLocaleTimeString()}</span>
              </div>
            </>
          ))}

        </div>
        <div style={{ marginTop: '10px' }}>
          <input
            className="input-box me-2"
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <input
            type="file"
            id="file-upload"  // Add the id for label association
            style={{ width: '20%' }}
            className="btn btn-outline-danger input-button me-2"
            onChange={handleFileChange}  // This will handle the file selection
            aria-label="Upload media"
            hidden
          />

          <label className="btn btn-outline-danger input-button me-2" htmlFor="file-upload">
            <i className="fas fa-plus"></i>  {/* "+" icon */}
          </label>
          {mediaPreview && (
            <div>
              <img src={mediaPreview} alt="Preview" style={{ width: "200px", height: "200px" }} />
            </div>
          )}


          <button className="btn btn-outline-success input-button" onClick={sendMessage}>Send</button>
        </div>
      </div>

      {/* Media Upload Section */}
      {/* <div>
        <input type="file" onChange={handleFileChange} />
        {mediaPreview && (
          <div>
            <img src={mediaPreview} alt="Preview" style={{ width: "200px", height: "200px" }} />
          </div>
        )}
        <button onClick={uploadMedia}>Upload Media</button>
      </div> */}
    </div>
  );
};

export default Chat;
