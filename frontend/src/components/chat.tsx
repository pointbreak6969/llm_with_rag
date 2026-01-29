"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Send, Loader2 } from "lucide-react";
import { LogOut } from "lucide-react";
import { useRouter } from 'next/navigation'
import { signOut } from "next-auth/react";
interface Message {
  id: string;
  type: "user" | "assistant";
  content: string | Record<string, any>;
  topic?: string;
  sources?: string;
}

export default function Chat() {
 const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const url = session ? "http://localhost:5000/paidQuery" : "http://localhost:5000/query";
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(url, {
        query: input,
      });
      console.log(response.data);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: response.data.answer,
        topic: response.data.topic,
        sources: response.data.sources,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content:
          error instanceof axios.AxiosError
            ? error.response?.data?.error || "An error occurred"
            : "An error occurred while fetching the response",
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-linear-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Image src="/logo.png" alt="jassaiPass Logo" width={32} height={32} />
              <span className="text-2xl font-bold text-foreground">jassaiPass</span>
            </div>
            {!session?.user && (
              <Button onClick={() => router.push("/login")}>
                Login
              </Button>
            )}
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm text-slate-600">
              Ask questions about your course materials <br/>
              
            </p>
            {session?.user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut()}
                className="ml-2"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-4">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-slate-900">
                  Welcome!
                </h2>
                <p className="mt-2 text-slate-600">
                  Start by asking a question about your course materials
                </p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-2xl rounded-lg px-4 py-3 ${
                      message.type === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-slate-900 shadow-md"
                    }`}
                  >
                    {message.type === "user" ? (
                      <p className="text-sm sm:text-base">
                        {typeof message.content === "string" ? message.content : JSON.stringify(message.content)}
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {/* Topic Header */}
                        {message.topic && (
                          <div className="border-b border-slate-200 pb-2">
                            <h3 className="text-base font-semibold text-blue-700">
                              {message.topic}
                            </h3>
                          </div>
                        )}
                        
                        {/* Answer Content */}
                        <div className="text-sm sm:text-base leading-relaxed text-slate-700">
                          {typeof message.content === "string" ? (
                            <p className="whitespace-pre-wrap">{message.content}</p>
                          ) : (
                            <p className="whitespace-pre-wrap">{JSON.stringify(message.content, null, 2)}</p>
                          )}
                        </div>

                        {/* Sources Footer */}
                        {message.sources && (
                          <div className="mt-3 border-t border-slate-200 pt-3">
                            <p className="text-xs text-slate-500">
                              <span className="font-semibold text-slate-600">Sources:</span>{" "}
                              <span className="text-slate-500">{message.sources || "None"}</span>
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-lg bg-white px-4 py-3 shadow">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                      <span className="text-sm text-slate-600">
                        Generating response...
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-200 bg-white p-4 sm:p-6">
        <div className="mx-auto max-w-4xl">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              disabled={loading}
              className="flex-1 border-slate-300 text-sm placeholder:text-slate-500 focus-visible:ring-blue-500"
            />
            <Button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300"
              size="icon"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}