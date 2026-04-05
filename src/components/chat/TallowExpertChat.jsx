import { useState, useEffect, useRef, useCallback } from "react";
import { X, Send, Sparkles, MessageCircle } from "lucide-react";
import { BRAND, PRODUCTS, getProductImage } from "../../lib/constants";
import {
  getAIResponse,
  getClaudeResponse,
  SUGGESTED_QUESTIONS,
  GREETING,
} from "./ai-engine";
import { useCart } from "../../context/CartContext";

export default function TallowExpertChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "ai", text: GREETING, products: [] },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef(null);
  const { addItem } = useCart();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const send = useCallback(
    async (text) => {
      const msg = (text || input).trim();
      if (!msg) return;
      setInput("");
      setMessages((p) => [...p, { role: "user", text: msg }]);
      setIsTyping(true);

      // Phase 1: Try regex engine first (instant, free)
      const regexResult = getAIResponse(msg);

      if (regexResult.source === "regex") {
        // Regex matched — deliver with a natural typing delay
        setTimeout(() => {
          setMessages((p) => [
            ...p,
            { role: "ai", text: regexResult.text, products: regexResult.products },
          ]);
          setIsTyping(false);
        }, 400 + Math.random() * 600);
      } else {
        // Phase 2: Regex fell to fallback — call Claude API
        try {
          const history = messages.slice(-6).map((m) => ({
            role: m.role,
            text: m.text,
          }));
          const claudeResult = await getClaudeResponse(msg, history);
          setMessages((p) => [
            ...p,
            { role: "ai", text: claudeResult.text, products: claudeResult.products },
          ]);
        } catch {
          // If Claude also fails, use the regex fallback text
          setMessages((p) => [
            ...p,
            { role: "ai", text: regexResult.text, products: regexResult.products },
          ]);
        } finally {
          setIsTyping(false);
        }
      }
    },
    [input, messages]
  );

  const C = BRAND.colors;

  return (
    <>
      {/* Floating Bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open TallowExpert chat"
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
          border: "none",
          cursor: "pointer",
          zIndex: 1000,
          boxShadow: "0 8px 32px rgba(201,168,76,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.3s",
          transform: isOpen ? "scale(0.9) rotate(90deg)" : "scale(1)",
        }}
      >
        {isOpen ? (
          <X size={26} color="#0a0a0a" />
        ) : (
          <MessageCircle size={26} color="#0a0a0a" />
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: 100,
            right: 24,
            width: 400,
            maxWidth: "calc(100vw - 48px)",
            maxHeight: 560,
            background: C.surface,
            borderRadius: 20,
            zIndex: 999,
            boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
            border: `1px solid ${C.border}`,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            animation: "chatSlideUp 0.3s ease",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "18px 20px",
              background: `linear-gradient(135deg, ${C.gold}15, ${C.goldDark}10)`,
              borderBottom: `1px solid ${C.border}`,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Sparkles size={20} color="#0a0a0a" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: C.text, fontWeight: 700, fontSize: 15 }}>
                TallowExpert
              </div>
              <div style={{ color: C.goldDark, fontSize: 12 }}>
                Your personal skincare advisor
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 6,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = `${C.border}`)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <X size={20} color={C.textMuted} />
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px 16px 8px",
              maxHeight: 360,
            }}
          >
            {messages.map((msg, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div
                  style={{
                    maxWidth: "85%",
                    marginLeft: msg.role === "user" ? "auto" : 0,
                    padding: "12px 16px",
                    borderRadius:
                      msg.role === "user"
                        ? "16px 16px 4px 16px"
                        : "16px 16px 16px 4px",
                    background:
                      msg.role === "user"
                        ? `linear-gradient(135deg, ${C.gold}, ${C.goldDark})`
                        : C.card,
                    color: msg.role === "user" ? "#0a0a0a" : C.text,
                    fontSize: 14,
                    lineHeight: 1.6,
                    border:
                      msg.role === "ai" ? `1px solid ${C.border}` : "none",
                  }}
                >
                  {msg.text.split("**").map((part, j) =>
                    j % 2 === 0 ? (
                      part
                    ) : (
                      <strong
                        key={j}
                        style={{
                          color:
                            msg.role === "user" ? "#0a0a0a" : C.gold,
                        }}
                      >
                        {part}
                      </strong>
                    )
                  )}
                </div>

                {/* Product cards */}
                {msg.products?.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      marginTop: 8,
                      overflowX: "auto",
                      paddingBottom: 4,
                    }}
                  >
                    {msg.products.map((pid) => {
                      const p = PRODUCTS.find((x) => x.id === pid);
                      if (!p) return null;
                      return (
                        <div
                          key={pid}
                          style={{
                            minWidth: 140,
                            background: C.card,
                            borderRadius: 12,
                            border: `1px solid ${C.border}`,
                            overflow: "hidden",
                            flexShrink: 0,
                          }}
                        >
                          <img
                            src={getProductImage(p)}
                            alt={p.name}
                            style={{
                              width: "100%",
                              height: 90,
                              objectFit: "cover",
                            }}
                          />
                          <div style={{ padding: "8px 10px" }}>
                            <div
                              style={{
                                color: C.text,
                                fontSize: 12,
                                fontWeight: 600,
                                marginBottom: 4,
                              }}
                            >
                              {p.name}
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <span
                                style={{
                                  color: C.gold,
                                  fontSize: 13,
                                  fontWeight: 700,
                                }}
                              >
                                ${p.price}
                              </span>
                              <button
                                onClick={() => addItem(p)}
                                style={{
                                  background: C.gold,
                                  border: "none",
                                  color: "#0a0a0a",
                                  padding: "4px 8px",
                                  borderRadius: 6,
                                  fontSize: 11,
                                  fontWeight: 700,
                                  cursor: "pointer",
                                }}
                              >
                                Add
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div
                style={{
                  padding: "12px 16px",
                  background: C.card,
                  borderRadius: "16px 16px 16px 4px",
                  display: "inline-block",
                  border: `1px solid ${C.border}`,
                  marginBottom: 14,
                }}
              >
                <div style={{ display: "flex", gap: 4 }}>
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: C.gold,
                        animation: `chatBounce 1.4s ease-in-out ${i * 0.2}s infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 2 && (
            <div
              style={{
                padding: "0 16px 8px",
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
              }}
            >
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => send(q)}
                  style={{
                    background: C.accent,
                    border: `1px solid ${C.border}`,
                    color: C.goldLight,
                    padding: "6px 14px",
                    borderRadius: 20,
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div
            style={{
              padding: "12px 16px",
              borderTop: `1px solid ${C.border}`,
              display: "flex",
              gap: 10,
              alignItems: "center",
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask about your skin concerns..."
              style={{
                flex: 1,
                background: C.card,
                border: `1px solid ${C.border}`,
                color: C.text,
                padding: "10px 16px",
                borderRadius: 12,
                fontSize: 14,
                outline: "none",
              }}
            />
            <button
              onClick={() => send()}
              style={{
                background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
                border: "none",
                borderRadius: 12,
                padding: "10px 12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Send size={18} color="#0a0a0a" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
