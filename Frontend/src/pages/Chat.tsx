import { useState } from "react";
import { Send, Mic, Bot } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Chat = () => {
  const [messages, setMessages] = useState([
    { text: "¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages([...messages, { text: input, sender: "user" }]);
    setInput("");
    
    // Simular respuesta del bot
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: "Entiendo tu consulta. Basándome en tus datos, te recomiendo revisar el pH del lote. ¿Necesitas más detalles?", 
        sender: "bot" 
      }]);
    }, 1000);
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
