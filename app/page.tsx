"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  const router = useRouter();

  const createRoom = async () => {
    const res = await fetch("https://flask-chat-2.onrender.com//create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
      }),
    });
    const data = await res.json();
    if (data.room_id) {
      router.push(`/rooms/${data.room_id}?name=${name}`);
    }
  };
  const joinRoom = async () => {
    const res = await fetch(
      `https://flask-chat-2.onrender.com/room/${roomId}`,
      {}
    );
    const data = await res.json();
    if (data.members.includes(name)) {
      alert("this name is already taken");
    } else {
      router.push(`/rooms/${roomId}?name=${name}`);
    }
    console.log(data);
  };

  return (
    <div className="flex flex-col gap-5 p-10 max-w-[500px] ">
      <div className="flex gap-2">
        <input
          type="text"
          className="border p-2 w-full"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />

        <button
          className="bg-blue-500 text-white p-2 rounded-md"
          onClick={createRoom}
        >
          Send
        </button>
      </div>
      <div className="flex flex-col gap-2">
        <input
          type="text"
          className="border p-2 w-full"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          className="border p-2 w-full"
          placeholder="RoomId"
          onChange={(e) => setRoomId(e.target.value)}
        />

        <button
          className="bg-blue-500 text-white p-2 rounded-md"
          onClick={joinRoom}
        >
          Join
        </button>
      </div>
      <div></div>
    </div>
  );
}
