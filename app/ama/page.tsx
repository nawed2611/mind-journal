"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { motion } from "framer-motion";

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
    <div className="mb-20 mt-8 h-full">
      <div className="mb-4 flex items-center justify-center">
        <h1 className="text-xl font-bold">MindJournal</h1>
      </div>
      <div ref={chatContainerRef} className="mx-auto w-[70%]">
        {chats.map((chat, index) => (
          <div key={index}>
            <div className="inline-flex  items-center">
              <span
                className={`${
                  chat.author === "user" ? "text-gray-400" : "text-gray-500"
                } inline-block rounded-lg p-2 text-base
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
            className="w-full border-none bg-transparent p-2 text-base font-medium text-gray-400 outline-none placeholder:text-gray-400"
            placeholder="Type your message here..."
          />
        )}
      </div>
    </div>
  );
};

export default Chatbot;
