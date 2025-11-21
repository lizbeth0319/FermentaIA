import { useState } from "react";
import { Send, Mic, Bot } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/api/http";
import { API } from "@/api/endpoints";

const Chat = () => {
  const [messages, setMessages] = useState([
    { text: "¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;
    
    setMessages([...messages, { text: input, sender: "user" }]);
    setInput("");
    
    try {
      const resp = await apiFetch<{ response?: string; message?: string }>(API.ai.chatTest(), {
        method: "POST",
        body: { mensaje: input }
      });
      const text = String(resp.response ?? resp.message ?? "")
        .replace(/undefined/gi, "")
        .replace(/\s+\./g, ". ")
        .replace(/\s{2,}/g, " ")
        .replace(/\bPedo\b/gi, "Puedo")
        .replace(/\bPra\b/gi, "Para")
        .trim() || "Puedo ayudarte con el uso de la página y dudas de fermentación.";
      setMessages(prev => [...prev, { text, sender: "bot" }]);
    } catch {
      setMessages(prev => [...prev, { text: "Hubo un problema temporal al responder. Intenta de nuevo.", sender: "bot" }]);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-xl">
            <Bot className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Asistente Virtual</h1>
            <p className="text-sm text-muted-foreground">Siempre listo para ayudarte</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <Card
              className={`max-w-[80%] p-4 ${
                msg.sender === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card"
              }`}
            >
              <p>{msg.text}</p>
            </Card>
          </div>
        ))}
      </div>

      <div className="bg-card border-t border-border p-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Escribe tu mensaje..."
            className="flex-1 text-base"
          />
          <Button size="icon" variant="outline">
            <Mic className="w-5 h-5" />
          </Button>
          <Button size="icon" onClick={handleSend}>
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
