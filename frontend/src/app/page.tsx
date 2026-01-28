"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Send, Loader2 } from "lucide-react";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string | Record<string, any>;
  topic?: string;
  sources?: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
      const response = await axios.post("http://localhost:5000/query", {
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
    <div className="flex h-screen flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-slate-900">
            University Knowledge Assistant
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Ask questions about your course materials
          </p>
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
                        : "bg-white text-slate-900 shadow"
                    }`}
                  >
                    {typeof message.content === "string" ? (
                      message.type === "assistant" ? (
                        <div className="prose prose-slate max-w-none text-sm sm:text-base">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-sm sm:text-base">{message.content}</p>
                      )
                    ) : message.content.description ? (
                      <div className="space-y-3 text-sm sm:text-base">
                        <p className="text-slate-700">{message.content.description}</p>
                        {Array.isArray(message.content.sections) && (
                          <div className="space-y-2">
                            {message.content.sections.map((section: any, idx: number) => (
                              <div key={idx}>
                                <h4 className="font-semibold text-slate-700">
                                  {section.title}
                                </h4>
                                <p className="text-slate-600">{section.text}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2 text-sm sm:text-base">
                        {Object.entries(message.content).map(([key, value]) => (
                          <div key={key}>
                            <h4 className="font-semibold text-slate-700">
                              {key}
                            </h4>
                            {Array.isArray(value) ? (
                              <ul className="ml-4 list-disc space-y-1">
                                {value.map((item, idx) => (
                                  <li key={idx} className="text-slate-600">
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-slate-600">{value}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {message.type === "assistant" && message.sources && (
                      <div className="mt-3 border-t border-slate-200 pt-3">
                        <p className="text-xs font-semibold text-slate-600">
                          Topic: {message.topic}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          <span className="font-semibold">Sources:</span>{" "}
                          {message.sources}
                        </p>
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
