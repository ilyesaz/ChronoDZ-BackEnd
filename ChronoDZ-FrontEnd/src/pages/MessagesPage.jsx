import { useEffect, useMemo, useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import Input from "../components/ui/Input.jsx";
import Textarea from "../components/ui/Textarea.jsx";
import Button from "../components/ui/Button.jsx";
import { formatDate } from "../utils/helpers.js";
import { Navigate } from "react-router-dom";

export default function MessagesPage() {
  const { user, conversations = [], messages = [], sendMessage } = useApp();

  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [form, setForm] = useState({ content: "" });

  const selectedConversation = useMemo(() => {
    return conversations.find((c) => c.id === selectedConversationId) || null;
  }, [conversations, selectedConversationId]);

  const conversationMessages = useMemo(() => {
    if (!selectedConversationId) return [];
    return messages
      .filter((msg) => msg.conversationId === selectedConversationId)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }, [messages, selectedConversationId]);

  useEffect(() => {
    if (!selectedConversationId && conversations.length > 0) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [conversations, selectedConversationId]);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const handleSend = async (e) => {
    e.preventDefault();

    if (!selectedConversationId || !form.content.trim()) return;

    try {
      await sendMessage({
        conversationId: selectedConversationId,
        content: form.content,
      });

      setForm({ content: "" });
    } catch (error) {
      alert(error.message || "Erreur lors de l'envoi du message.");
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900">💬 Messagerie</h1>
        <p className="mt-2 text-slate-400">
          Discute avec les acheteurs et vendeurs autour des annonces.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[340px,1fr]">
        <div className="rounded-4xl border border-line bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-slate-900">Conversations</h2>

          {conversations.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-line p-6 text-center text-slate-400">
              Aucune conversation.
            </div>
          ) : (
            <div className="space-y-3">
              {conversations.map((conversation) => {
                const otherUser =
                  user.id === conversation.buyerId
                    ? conversation.seller
                    : conversation.buyer;

                const isActive = selectedConversationId === conversation.id;

                return (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() => setSelectedConversationId(conversation.id)}
                    className={`w-full rounded-3xl border p-4 text-left transition ${
                      isActive
                        ? "border-slate-900 bg-slate-50"
                        : "border-line bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={otherUser?.avatar || "https://via.placeholder.com/80x80?text=User"}
                        alt={otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : "Utilisateur"}
                        className="h-12 w-12 rounded-full object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-slate-900">
                          {otherUser
                            ? `${otherUser.firstName} ${otherUser.lastName}`
                            : "Utilisateur"}
                        </p>

                        <p className="truncate text-xs text-slate-400">
                          {conversation.product
                            ? `${conversation.product.brand} ${conversation.product.model}`
                            : "Produit"}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {formatDate(conversation.updatedAt || conversation.createdAt)}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-4xl border border-line bg-white p-6 shadow-sm">
          {!selectedConversation ? (
            <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-dashed border-line text-center text-slate-400">
              Sélectionne une conversation.
            </div>
          ) : (
            <div className="flex min-h-[420px] flex-col">
              <div className="border-b border-line pb-4">
                <h2 className="text-xl font-bold text-slate-900">
                  {selectedConversation.product
                    ? `${selectedConversation.product.brand} ${selectedConversation.product.model}`
                    : "Conversation"}
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Sujet lié à l’annonce sélectionnée.
                </p>
              </div>

              <div className="flex-1 space-y-4 py-4">
                {conversationMessages.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-line p-8 text-center text-slate-400">
                    Aucun message dans cette conversation.
                  </div>
                ) : (
                  conversationMessages.map((msg) => {
                    const mine = msg.senderId === user.id;

                    return (
                      <div
                        key={msg.id}
                        className={`flex ${mine ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-3xl px-4 py-3 ${
                            mine
                              ? "bg-slate-900 text-white"
                              : "border border-line bg-slate-50 text-slate-700"
                          }`}
                        >
                          <p className="text-sm leading-6">{msg.content}</p>
                          <p
                            className={`mt-2 text-[11px] ${
                              mine ? "text-slate-300" : "text-slate-400"
                            }`}
                          >
                            {formatDate(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <form onSubmit={handleSend} className="border-t border-line pt-4">
                <div className="space-y-4">
                  <Textarea
                    label="Votre message"
                    required
                    rows={5}
                    placeholder="Écris ton message ici..."
                    value={form.content}
                    onChange={(e) => setForm({ content: e.target.value })}
                  />

                  <Button type="submit" className="w-full justify-center sm:w-auto">
                    Envoyer →
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}