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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "ai",
      content:
        "¡Hola! Soy Fermenta Bot, tu guía en fermentación del café. ¿En qué puedo ayudarte hoy?",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [response, setResponse] = useState("");

  const generateAIResponse = (userInput: string) => {
    const input = userInput.toLowerCase();

    if (input.includes("emergencia") || input.includes("ayuda") || input.includes("socorro")) {
      return "🚨 Detecté una situación de emergencia. He activado el protocolo de respuesta rápida. ¿Necesitas que contacte servicios de emergencia o prefieres reportar el incidente primero?";
    }

    if (input.includes("ubicación") || input.includes("localización") || input.includes("donde")) {
      return "📍 Puedo ayudarte con información de ubicación. Tengo acceso a mapas interactivos y puntos de seguridad cercanos. ¿Necesitas localizar algún lugar específico o reportar tu ubicación actual?";
    }

    if (input.includes("contacto") || input.includes("persona") || input.includes("familiar")) {
      return "👥 Te ayudo con la gestión de contactos de emergencia. Puedo ayudarte a configurar contactos de confianza, enviar alertas automáticas o buscar personas en tu red de seguridad.";
    }

    if (input.includes("reporte") || input.includes("incidente") || input.includes("problema")) {
      return "📋 Puedo activar un formulario de reporte. Indícame el tipo de incidente y procedo.";
    }

    if (input.includes("seguridad") || input.includes("protección") || input.includes("riesgo")) {
      return "🛡️ Analizando tu consulta de seguridad... He identificado varios protocolos aplicables. ¿Te encuentras en una situación de riesgo actualmente?";
    }

    if (input.includes("configuración") || input.includes("ajustes") || input.includes("settings")) {
      return "⚙️ Puedo ajustar notificaciones, contactos de emergencia, alertas y tu perfil de seguridad. ¿Qué deseas configurar?";
    }

    if (input.includes("recursos") || input.includes("información") || input.includes("guía")) {
      return "📚 Tengo guías de autoprotección, números de emergencia y protocolos de evacuación. ¿Qué recurso buscas?";
    }

    if (input.includes("hola") || input.includes("hi") || input.includes("buenos") || input.includes("buenas")) {
      return "¡Hola! ¿Cómo puedo ayudarte hoy?";
    }

    if (["sí", "si", "yes", "ok", "vale"].includes(input)) {
      return "✅ Perfecto. Procedo con la acción solicitada. ¿Algo más en lo que pueda asistirte?";
    }

    if (["no", "nope", "negativo"].includes(input)) {
      return "❌ Entendido. Si cambias de opinión, estaré aquí para ayudarte.";
    }

    if (input.includes("gracias") || input.includes("thanks") || input.includes("thank you")) {
      return "😊 ¡De nada! Estoy disponible 24/7. ¡Mantente seguro!";
    }

    if (input.includes("perfecto") || input.includes("excelente") || input.includes("genial") || input.includes("bien")) {
      return "🎉 ¡Me alegra saberlo! Si necesitas más asistencia, aquí estoy.";
    }

    return "Puedo ayudarte con análisis de riesgo, contactos de emergencia, reportes y más. ¿Qué necesitas?";
  };

  const handleSendMessage = () => {
    const currentInput = inputMessage.trim();
    if (!currentInput) return;

    const userMessage: Message = { id: messages.length + 1, type: "user", content: currentInput };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    setTimeout(() => {
      const aiMessage: Message = {
        id: messages.length + 2,
        type: "ai",
        content: generateAIResponse(currentInput),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, Math.random() * 1500 + 800);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await apiFetch(API.ai.chat(), {
        method: "POST",
        body: { mensaje: inputMessage },
      });
      setResponse(result.response);
    } catch (error) {
      console.error("Error al procesar mensaje:", error);
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
          className="h-20 w-20 rounded-full bg-transparent border-2 border-blue-500/20 shadow-md transition-transform hover:scale-105 p-2 relative"
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
              <button className="p-1 rounded hover:bg-black/5" onClick={() => setIsOpen(false)} aria-label="Cerrar chat">
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
                <button>
                  className="h-9 w-9 inline-flex items-center justify-center rounded-md border border-slate-200 hover:bg-slate-50"
                  onClick={handleSendMessage}
                  aria-label="Enviar"
                > Input */}
                  <MessageCircle className="h-4 w-4" />
                </button>
              </div>pe="text"
            </div>value={inputMessage}
          </div>  onChange={(e) => setInputMessage(e.target.value)}
        </div>    onKeyDown={(e) => {
      )}            if (e.key === "Enter") handleSendMessage();
    </>           }}
  );              placeholder="Escribe tu consulta..."
};                className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
export default FloatingAIWidget;
                  className="h-9 w-9 inline-flex items-center justify-center rounded-md border border-slate-200 hover:bg-slate-50"
                  onClick={handleSendMessage}
                  aria-label="Enviar"
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