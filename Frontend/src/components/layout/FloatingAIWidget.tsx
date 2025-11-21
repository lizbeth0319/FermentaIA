import { useEffect, useRef, useState } from "react";
import { X, MessageCircle } from "lucide-react";
import botImg from "@/assets/bot.png";
import { apiFetch } from "../../api/http";
import { API } from "../../api/endpoints";

const sanitizeText = (t: string) =>
  String(t ?? "")
    .replace(/undefined/gi, "")
    .replace(/^\s+|\s+$/g, "")
    .replace(/\s+\./g, ". ")
    .replace(/\s{2,}/g, " ")
    .replace(/\bPedo\b/gi, "Puedo")
    .replace(/\bPra\b/gi, "Para")
    .trim();

// Texto con efecto de máquina de escribir simple
const TypewriterText = ({ text, speed = 18 }: { text: string; speed?: number }) => {
  const [displayed, setDisplayed] = useState("");
  const safe = sanitizeText(text);

  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const id = setInterval(() => {
      if (i < safe.length) {
        setDisplayed((prev) => prev + safe[i]);
        i += 1;
      } else {
        clearInterval(id);
      }
    }, speed);
    return () => clearInterval(id);
  }, [safe, speed]);

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
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const suggestionsRef = useRef<HTMLDivElement | null>(null);
  const quickPrompts = [
    "¿Cómo registro una finca?",
    "¿Cómo registro un lote?",
    "¿Cómo registro una medición?",
    "¿Cuál es el pH ideal?",
    "¿Cuál es la temperatura ideal?",
    "¿Dónde veo comparativas?"
  ];

  const handleSendMessage = async (forcedText?: string) => {
    const currentInput = (forcedText ?? inputMessage).trim();
    if (!currentInput) return;

    const userMessage: Message = { id: Date.now(), type: "user", content: currentInput };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const result = await apiFetch<{ response?: string; message?: string }>(API.ai.chatTest(), {
        method: "POST",
        body: { mensaje: currentInput },
      });
      const raw = String(result.response ?? result.message ?? "");
      const content = sanitizeText(raw);
      const aiMessage: Message = { id: Date.now() + 1, type: "ai", content };
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
      // Auto-scroll al final
      requestAnimationFrame(() => {
        if (messagesRef.current) {
          messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
      });
    }
  };

  // Auto-scroll suave de sugerencias
  useEffect(() => {
    const el = suggestionsRef.current;
    if (!el) return;
    let dir = 1;
    let paused = false;
    let last = performance.now();
    let accum = 0;
    const speedPxPerSec = 6; // muy lento pero visible
    const onEnter = () => { paused = true; };
    const onLeave = () => { paused = false; };
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    el.addEventListener('touchstart', onEnter, { passive: true });
    el.addEventListener('touchend', onLeave, { passive: true });
    const step = (ts: number) => {
      if (!el) return;
      const dt = Math.min(0.05, (ts - last) / 1000);
      last = ts;
      if (!paused) {
        accum += dir * speedPxPerSec * dt;
        // aplicar movimiento solo cuando acumulado supera 1px
        if (Math.abs(accum) >= 1) {
          const stepPx = accum > 0 ? 1 : -1;
          el.scrollLeft += stepPx;
          accum -= stepPx;
        }
        if (el.scrollLeft <= 0) dir = 1;
        else if (el.scrollLeft + el.clientWidth >= el.scrollWidth) dir = -1;
      }
      raf = requestAnimationFrame(step);
    };
    let raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
      el.removeEventListener('touchstart', onEnter);
      el.removeEventListener('touchend', onLeave);
    };
  }, [isOpen]);

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
        <div className="fixed bottom-6 right-6 w-[320px] sm:w-[380px] max-w-[calc(100vw-48px)] z-50">
          <div className="bg-white/95 backdrop-blur border border-black/10 shadow-xl rounded-2xl overflow-hidden">
            <div className="px-4 py-3 flex items-center justify-between bg-gradient-to-r from-primary/10 to-primary/5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12">
                  <img src={botImg} alt="Fermenta Bot" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-slate-900 m-0">Fermenta Bot</h3>
                  <p className="text-[11px] sm:text-xs text-slate-600 m-0">Tu guía en fermentación del café</p>
                </div>
              </div>
              <button className="p-1 rounded hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-primary/30" onClick={() => setIsOpen(false)} aria-label="Cerrar chat">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Sugerencias bajo el título */}
            <div ref={suggestionsRef} className="px-4 py-2 overflow-x-auto whitespace-nowrap flex gap-2">
              {quickPrompts.map((q) => (
                <button
                  key={q}
                  className="px-2.5 py-1.5 text-xs rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                  onClick={() => handleSendMessage(q)}
                  disabled={isTyping}
                >
                  {q}
                </button>
              ))}
            </div>

            <div className="px-4 pb-4 flex flex-col gap-3">
              <div ref={messagesRef} className="max-h-[60vh] sm:max-h-[48vh] overflow-y-auto flex flex-col gap-3 pr-1">
                {messages.map((m) => (
                  <div key={m.id} className={m.type === "user" ? "flex justify-end" : "flex justify-start"}>
                    <div
                      className={
                        m.type === "user"
                          ? `${bubbleBase} bg-primary text-primary-foreground shadow-sm`
                          : `${bubbleBase} bg-slate-100 text-slate-700 border border-slate-200`
                      }
                    >
                      {sanitizeText(m.content)}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className={`${bubbleBase} bg-slate-100 text-slate-700 border border-slate-200 italic opacity-80`}>Fermenta Bot está escribiendo…</div>
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
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                  disabled={isTyping}
                />
                <button
                  className="h-9 w-9 inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md active:translate-y-px focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 disabled:cursor-not-allowed"
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
