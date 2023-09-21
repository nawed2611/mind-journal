"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { BotIcon, SearchIcon, User2 } from "lucide-react";
import { toast } from "sonner";

interface Chat {
  message: string;
  author: string;
}

const Chatbot = (props: any) => {
  const [input, setInput] = useState("");
  const [chats, setChats] = useState<Chat[]>([
    { message: "Hi, How can I help you?", author: "bot" },
  ]);
  const [loading, setLoading] = useState(false);
  const [inputEnabled, setInputEnabled] = useState(true);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chats]);

  const handleSubmit = () => {
    if (!inputEnabled) return;

    if (input === "") {
      toast.error("Please enter a message!");
      return;
    }

    setChats([...chats, { message: input, author: "user" }]);
    setLoading(true);
    setInputEnabled(false);

    const url = "https://stemist-aijournal-production.up.railway.app/ask";

    axios
      .post(
        url,
        { question: input, user_id: "user_1" },
        { headers: { "Content-Type": "application/json" } },
      )
      .then((response) => {
        console.log(response);
        const Answer = response.data;
        setChats([
          ...chats,
          {
            message: input,
            author: "user",
          },
          {
            message: Answer,
            author: "bot",
          },
        ]);
        setInput("");
        setLoading(false);
        setInputEnabled(true);
        inputRef.current?.focus();
      })
      .catch((error) => {
        console.log(error);
        setChats([
          ...chats,
          {
            message: input,
            author: "user",
          },
          {
            message:
              "Sorry, We've ran out of Open AI credits right now! We know its not ideal.",
            author: "bot",
          },
        ]);
        setInput("");
        setLoading(false);
        setInputEnabled(true);
        inputRef.current?.focus();
      });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (chats.length > 0 && inputRef.current) {
      inputRef.current.focus();
    }
  }, [chats]);

  return (
    <div>
      <h1 className="p-4 italic text-stone-400">
        Try asking prompts about your journals like - When did I go to Goa?
      </h1>
      <div className="mb-20 mt-8 h-[75vh] w-[80vw] overflow-y-scroll rounded-lg">
        <div ref={chatContainerRef} className="w-full p-4">
          {chats.map((chat, index) => (
            <div key={index} className="flex items-center">
              {chat.author === "bot" ? (
                <div className="mr-2 rounded-full border border-stone-300 p-2">
                  <BotIcon size={21} />
                </div>
              ) : (
                <div className="mr-2 rounded-full border border-stone-200 p-2">
                  <User2 size={21} />
                </div>
              )}
              <div className="mb-2 inline-flex w-full items-center p-4">
                <span
                  className={`${
                    chat.author === "user" ? "text-gray-400" : "text-gray-500"
                  } inline-block w-full rounded-lg text-base
                font-medium`}
                >
                  {chat.message}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity }}
              className="ml-2 mt-2 flex h-4 w-4 animate-spin items-start rounded-full ring-gray-400"
            >
              <div className="h-2 w-2 rounded-full bg-gray-400"></div>
            </motion.div>
          )}

          {inputEnabled && (
            <div className="mt-2 flex items-center rounded-lg border p-4">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(event) =>
                  setInput(
                    event.target.value.charAt(0).toUpperCase() +
                      event.target.value.slice(1),
                  )
                }
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent text-base font-medium text-gray-400 outline-none placeholder:text-gray-400"
                placeholder="Type your message here..."
              />
              <SearchIcon size={21} className="mr-4" onClick={handleSubmit} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
