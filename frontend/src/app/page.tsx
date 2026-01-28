"use client";
import { useSession } from "next-auth/react"
import Navbar from "@/components/Navbar";
import Home from "@/components/Home";
import Chat from "@/components/chat";
export default function Page() {
   const { data: session, status } = useSession()
  return (
    <div>
      <Navbar/>
      <Home/>
    </div>
  );
}