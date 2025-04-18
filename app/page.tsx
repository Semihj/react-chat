"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "./_components/Loading";

export default function Home() {
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [loading,setLoading] = useState(false)

  const router = useRouter();

  const createRoom = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const res = await fetch("https://flask-chat-2.onrender.com/create", {
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
      setLoading(false)
    } else {
      setLoading(false)
    }
    } catch (error) {
      console.log(error);
      setLoading(false)

      
    }
    
  };
  const joinRoom = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
        const res = await fetch(
      `https://flask-chat-2.onrender.com/room/${roomId}`,
      {}
    );
    const data = await res.json();
    if (!data.members) {
      alert("Room not found");
      setLoading(false)
    }
    if (data.members.includes(name)) {
      alert("this name is already taken");
      setLoading(false)
    } else {
      router.push(`/rooms/${roomId}?name=${name}`);
      setLoading(false)
    }
    console.log(data);
    } catch (error) {
      console.log(error);
      setLoading(false)
      
    }
  
  };

  return (
    <div className="flex w-full h-screen max-h-[500px] justify-center items-center ">
      <Loading loading={loading}/>
    <div className="flex flex-col gap-5  max-w-[500px] ">
      
      <form onSubmit={createRoom} className="flex flex-col p-5 gap-2 bg-green-500 text-white ">
        <h1 className="text-xl font-semibold" >Create a Room</h1>
        <input
          type="text"
          className="border p-2 w-full"
          placeholder="username"
          required
          onChange={(e) => setName(e.target.value)}
        />

        <button
          className="bg-blue-500 text-white p-2 rounded-md cursor-pointer "
        >
          Create
        </button>
      </form>
      <form onSubmit={joinRoom} className="flex flex-col gap-2 bg-blue-500 rounded-sm text-white p-5  ">
      <h1 className="text-xl font-semibold" >Join a Room</h1>

        <input
          type="text"
          className="border p-2 w-full"
          placeholder="username"
          required
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          className="border p-2 w-full"
          placeholder="RoomId"
          required
          onChange={(e) => setRoomId(e.target.value)}
        />

        <button
          className=" text-white p-2 rounded-md cursor-pointer bg-amber-400"
        >
          Join
        </button>
      </form>
      <div></div>
    </div></div>
  );
}
