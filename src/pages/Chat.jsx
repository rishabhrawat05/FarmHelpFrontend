import React, { useState } from "react"
import axios from "axios"
import { IoSend } from "react-icons/io5"

function Chat() {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])

  const sendMessage = async () => {
    if (!message.trim()) return

    const newMessage = { text: message, sender: "user" }
    setMessages([...messages, newMessage])
    setMessage("")
    try {
      const response = await axios.post("https://farmhelpbackend.onrender.com/chat", { message })
      const botMessage = { text: response.data.response, sender: "bot" }
      setMessages([...messages, newMessage, botMessage])
    } catch (error) {
      console.error("Error:", error)
      setMessages([...messages, newMessage, { text: "Error getting response", sender: "bot" }])
    }

    
  }

  return (
    <div className="h-96 mt-26 flex items-center justify-center bg-white text-white">
      <div className="w-1/2 bg-[#3b82f6] p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-4">Market Insights Chatbot</h1>
        <div className="h-96 overflow-y-auto p-4  rounded-lg bg-white">
          {messages.map((msg, index) => (
            <div key={index} className={`p-2 my-2 rounded-lg w-fit ${msg.sender === "user" ? "ml-auto bg-blue-500" : "mr-auto bg-green-500"}`}>
              {msg.text}
            </div>
          ))}
        </div>
        <div className="mt-4 flex">
          <input
            type="text"
            className="flex-1 p-2 rounded bg-white text-[#3b82f6]"
            placeholder="Ask about market insights..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendMessage} className="ml-2 bg-white p-3 rounded-lg">
            <IoSend size={24} color="#3b82f6" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Chat