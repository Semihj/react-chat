"use client";

import { useParams, useSearchParams } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import Msg from "./_components/Msg";

type Props = {};

function Page({}: Props) {
  const params = useParams<{ id: string }>();
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Array<any>>([]); // Initialize messages state
  const [message, setMessage] = useState("");
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("https://flask-chat-2.onrender.com", {
        withCredentials: true,
        transports: ['polling', 'websocket']
      });
    }

    const socket = socketRef.current;

    socket.on("connect", () => {
      socket.emit("join", { name: name, room: params.id });
      setIsConnected(true);
    });

    socket.on("user_joined", (data) => {
      console.log("User joined:", data);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      console.log("Socket disconnected");
    });

    socket.on("error", (data) => {
      console.error("Socket error:", data);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [params.id, name]);

  // Include setMessages in dependency array
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on("response", (data) => {
        console.log(data);
        setMessages((prev) => [...prev, data]); // Update messages state
      });
    }
  }, [socketRef]);
  console.log(messages);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, [messages]);

  return (
    <div className="flex flex-col w-screen h-full justify-center items-center">
      <h1>Room ID: {params.id}</h1>
      {isConnected ? <p>Connected to SocketIO</p> : <p>Connecting...</p>}
      <div className="border p-5 w-full h-[400px] max-w-[500px]  ">
        <div className="flex flex-col gap-2 h-full max-h-[300px] overflow-auto w-full">
          {messages.map((msg, index) => (
            <div key={index} ref={scrollRef} className="">
              <Msg
                own={name == msg.name}
                message={msg.message}
                name={msg.name}
              />
            </div>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault(); // Prevent form submission
            if (socketRef.current && message) {
              socketRef.current.emit("message", {
                message: message,
                room: params.id,
                name: name,
              });
              if (message.length == 0) {
                alert("Please enter a message");
              }
              setMessage(""); // Clear input
            }
          }}
          className="flex gap-2 mt-2"
        >
          <input
            type="text"
            className="border p-2 w-full"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white p-2 rounded-md"
            type="submit"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default Page;
