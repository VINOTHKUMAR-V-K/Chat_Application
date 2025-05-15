import React, { useEffect, useState } from "react";
import API from "../../utils/api";
import { useNavigate } from "react-router-dom"; // Correct import

const HomePage = () => {
    const [chats, setChats] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newChat, setNewChat] = useState({
        users: [],
        isGroup: true,
        chatName: "",
    });
    const navigate = useNavigate(); // Updated

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const { data } = await API.get("/api/chat/");
                setChats(data);
            } catch (error) {
                console.error("Failed to fetch chats:", error);
            }
        };

        fetchChats();
    }, []);

    const openCreateChatModal = () => {
        setShowModal(true);
    };

    const handleCreateChat = async (e) => {
        e.preventDefault();

        try {
            const response = await API.post("/api/chat", newChat);
            setChats((prevChats) => [...prevChats, response.data]);
            setShowModal(false); // Close modal after successful creation
        } catch (error) {
            console.error("Failed to create chat:", error);
        }
    };

    const handleInputChange = (e) => {
        setNewChat({
            ...newChat,
            [e.target.name]: e.target.value,
        });
    };

    const handleSelectUser = (userId) => {
        setNewChat({
            ...newChat,
            users: [...newChat.users, userId],
        });
    };

    const navigateToChat = (chatId) => {
        navigate(`/chat/${chatId}`); // Updated
    };

    return (
        <div style={{ margin: 'auto',textAlign:'center' }} className="chat-box">
            <h2 className="py-3 text-center">Your Chats</h2>
            <div className="border border-1 rounded-3" style={{ width: '50%', margin: 'auto' }}>
                {chats.map((chat) => (
                    <div key={chat._id} onClick={() => navigateToChat(chat._id)}>
                        {chat.isGroup ? (
                            <>
                                <div className="border-bottom border-2 d-flex">
                                    <div className="border border-3 m-3" style={{ height: '60px', width: '60px', borderRadius: '50%', textAlign: 'center' }}>
                                        <i class="bi bi-person-fill" style={{ fontSize: '35px', color: 'green' }}></i>
                                    </div>
                                    <div className="py-3">
                                        <p className="text-left" style={{ marginBottom: '0px' }} >{chat.chatName}</p>
                                        <p >Members: {chat.users.map(user => user.name).join(", ")}</p>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="border-bottom border-2 d-flex">
                                    <div className="border border-3 m-3" style={{ height: '60px', width: '60px', borderRadius: '50%', textAlign: 'center' }}>
                                        <i class="bi bi-person-fill" style={{ fontSize: '35px', color: 'green' }}></i>
                                    </div>
                                    <div className="py-4">
                                        <p>{chat.users.find(user => user._id != localStorage.getItem("userData").id).name} </p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
            {/* Button to Create New Chat */}
            <button className="btn btn-outline-success my-5" style={{ width: '150px', textAlign: 'center',margin:'auto' }} onClick={openCreateChatModal}>Create New Chat</button>

            {/* New Chat Modal */}
            {showModal && (
                <div className="modal">
                    <form onSubmit={handleCreateChat}>
                        <label>
                            Chat Name:
                            <input
                                type="text"
                                name="chatName"
                                value={newChat.chatName}
                                onChange={handleInputChange}
                                required
                            />
                        </label>

                        {/* Assuming a list of users to select */}
                        <label>
                            Select Users:
                            <select multiple onChange={(e) => handleSelectUser(e.target.value)}>
                                {/* Populate users dynamically */}
                                {/* Example:
                                    <option value="userId1">User 1</option>
                                    <option value="userId2">User 2</option>
                                */}
                            </select>
                        </label>

                        <button type="submit">Create Chat</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default HomePage;
