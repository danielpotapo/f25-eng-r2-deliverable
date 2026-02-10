/* eslint-disable */
"use client";
import { TypographyH2, TypographyP } from "@/components/ui/typography";
import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { generateResponse } from "@/lib/services/species-chat";

export default function SpeciesChatbot() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState<{ role: "user" | "bot"; content: string }[]>([]);
  const [waiting, setWaiting] = useState(false);
  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

const handleSubmit = async () => {
  // TODO: Implement this function
  if (message != "" && !waiting) {
    const maxLen = 250;
    const userMessage = message;

    // shorten message for user convenience
    const shortMessage = message.length > maxLen ? message.slice(0, maxLen - 1) + "..." : message;
    const newMessage : { role: "user" | "bot"; content: string } = {
      role: "user",
      content: shortMessage
    }
    
    setChatLog((prevChatLog) => [...prevChatLog, newMessage]);

    let dotCount: number = 1

    setChatLog((prevChatLog) => [
      ...prevChatLog,
      { role: "bot", content: `Thinking.` }
    ]);

    const intervalId = setInterval(() => {
    dotCount = (dotCount + 1) % 4;
    const dots = ".".repeat(dotCount);
    
    setChatLog((prevChatLog) => [
      ...prevChatLog.slice(0, -1),
      { role: "bot", content: `Thinking${dots}` }
    ]);
  }, 500);

    
    // clear text box
    setMessage("");

    setWaiting(true);
    const response : { role: "user" | "bot"; content: string } = {
      role: "bot",
      content: await generateResponse(userMessage)
    }

    clearInterval(intervalId);


    setChatLog((prevChatLog) => [...prevChatLog.slice(0, -1), response]);
    setWaiting(false);
  }
  
}

return (
    <>
      <TypographyH2>Species Chatbot</TypographyH2>
      <div className="mt-4 flex gap-4">
        <div className="mt-4 rounded-lg bg-foreground p-4 text-background">
          <TypographyP>
            The Species Chatbot is a feature to be implemented that is specialized to answer questions about animals.
            Ideally, it will be able to provide information on various species, including their habitat, diet,
            conservation status, and other relevant details. Any unrelated prompts will return a message to the user
            indicating that the chatbot is specialized for species-related queries only.
          </TypographyP>
          <TypographyP>
            To use the Species Chatbot, simply type your question in the input field below and hit enter. The chatbot
            will respond with the best available information.
          </TypographyP>
        </div>
      </div>
      {/* Chat UI, ChatBot to be implemented */}
      <div className="mx-auto mt-6">
        {/* Chat history */}
        <div className="h-[400px] space-y-3 overflow-y-auto rounded-lg border border-border bg-muted p-4">
          {chatLog.length === 0 ? (
            <p className="text-sm text-muted-foreground">Start Chatting About A Species!</p>
          ) : (
            chatLog.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] whitespace-pre-wrap rounded-2xl p-3 text-sm ${
                    msg.role === "user"
                      ? "rounded-br-none bg-primary text-primary-foreground"
                      : "rounded-bl-none border border-border bg-foreground text-primary-foreground"
                  }`}
                >
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            ))
          )}
        </div>
        {/* Textarea and submission */}
        <div className="mt-4 flex flex-col items-end">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onInput={handleInput}
            rows={1}
            placeholder="Ask about a species..."
            className="w-full resize-none overflow-hidden rounded border border-border bg-background p-2 text-sm text-foreground focus:outline-none"
          />
          <button
            type="button"
            onClick={() => void handleSubmit()
            }
            
            className="mt-2 rounded bg-primary px-4 py-2 text-background transition hover:opacity-90"
          >
            Enter
          </button>
        </div>
      </div>
    </>
  );
}
