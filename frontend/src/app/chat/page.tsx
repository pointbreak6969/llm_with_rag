"use client";
import { useSession } from "next-auth/react"

import Chat from "@/components/chat";
export default function Page() {

  return (
<Chat/>
  );
}