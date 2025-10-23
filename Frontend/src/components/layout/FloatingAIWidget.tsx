import { useEffect, useState } from "react";
import { X, MessageCircle } from "lucide-react";
import botImg from "@/assets/bot.png";
import { apiFetch } from "../../api/http";
import { API } from "../../api/endpoints";

// Texto con efecto de máquina de escribir simple
const TypewriterText = ({ text, speed = 18 }: { text: string; speed?: number }) => {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const id = setInterval(() => {
      if (i < text.length) {
        setDisplayed((prev) => prev + text[i]);
        i += 1;
      } else {
        clearInterval(id);
      }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);

  return <div className="typewriter-text whitespace-pre-wrap">{displayed}</div>;
};

interface Message {
  id: number;
  type: "user" | "ai";
  content: string;
}

export const FloatingAIWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async () => {
    const currentInput = inputMessage.trim();
    if (!currentInput) return;

    // Agregar mensaje del usuario
    const userMessage: Message = { 
      id: Date.now(), 
      type: "user", 
      content: currentInput 
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      // Llamar al endpoint real de IA con n8n
      const result = await apiFetch(API.ai.chat(), {
        method: "POST",
        body: { mensaje: currentInput },
      });

      // Agregar respuesta de la IA
      const aiMessage: Message = {
        id: Date.now() + 1,
        type: "ai",
        content: result.response || "Lo siento, no pude procesar tu consulta en este momento.",
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error al procesar mensaje:", error);
      
      // Mensaje de error amigable
      const errorMessage: Message = {
        id: Date.now() + 1,
        type: "ai",
        content: "Disculpa, estoy experimentando dificultades técnicas. Por favor, intenta de nuevo en unos momentos.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Clases comunes
  const bubbleBase = "max-w-[240px] rounded-lg text-sm p-3";

  return (
    <>
      {/* Botón flotante */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          aria-label="Abrir Fermenta Bot"
          className="h-20 w-20 rounded-full bg-white/90 backdrop-blur border border-primary/20 shadow-lg transition-all hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-primary/30 p-2 relative"
          onClick={() => setIsOpen((v) => !v)}
        >
          <div className="w-full h-full flex items-center justify-center relative">
            <div className="w-16 h-16 relative">
              <img src={botImg} alt="Fermenta Bot" className="w-full h-full object-contain" />
            </div>
            {/* Indicador de estado */}
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white" />
          </div>
        </button>
      </div>

      {/* Chat flotante */}
      {isOpen && (
        <div className="fixed bottom-28 right-6 w-80 max-w-[calc(100vw-48px)] z-50">
          <div className="bg-white/95 backdrop-blur border border-black/10 shadow-2xl rounded-lg overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12">
                  <img src={botImg} alt="Fermenta Bot" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-800 m-0">Fermenta Bot</h3>
                  <p className="text-xs text-slate-500 m-0">Tu guía en fermentación del café</p>
                </div>
              </div>
              <button className="p-1 rounded hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-primary/30" onClick={() => setIsOpen(false)} aria-label="Cerrar chat">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Contenido */}
            <div className="px-4 pb-4 flex flex-col gap-4">
              {/* Mensajes */}
              <div className="max-h-48 overflow-y-auto flex flex-col gap-3">
                {messages.map((m) => (
                  <div key={m.id} className={m.type === "user" ? "flex justify-end" : "flex justify-start"}>
                    <div
                      className={
                        m.type === "user"
                          ? `${bubbleBase} bg-blue-600 text-white`
                          : `${bubbleBase} bg-slate-100 text-slate-600`
                      }
                    >
                      {m.type === "ai" ? <TypewriterText text={m.content} /> : m.content}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className={`${bubbleBase} bg-slate-100 text-slate-600 italic opacity-80`}>Fermenta Bot está escribiendo…</div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Escribe tu consulta sobre fermentación..."
                  className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                  disabled={isTyping}
                />
                <button
                  className="h-9 w-9 inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md active:translate-y-px focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleSendMessage}
                  disabled={isTyping || !inputMessage.trim()}
                  aria-label="Enviar mensaje"
                >
                  <MessageCircle className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingAIWidget;