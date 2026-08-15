"use client";

import { useState } from "react";
import { X, Paperclip, Send } from "lucide-react";
import type { TicketRecord } from "./supportData";
import { priorityBadgeStyles, statusBadgeStyles } from "./supportData";

type TicketDetailsProps = {
  ticket: TicketRecord;
  onClose: () => void;
};

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export function TicketDetails({ ticket, onClose }: TicketDetailsProps) {
  const [reply, setReply] = useState("");

  return (
    <div className="rounded-2xl border border-border bg-card shadow-[0_10px_30px_rgba(0,0,0,0.25)] flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 px-5 py-4 shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="text-[13px] font-semibold text-white">Ticket {ticket.id}</span>
          <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold ${statusBadgeStyles[ticket.status]}`}>
            {ticket.status}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-white/[0.04] hover:bg-white/[0.08] text-muted-2 hover:text-white transition cursor-pointer"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        {/* User Card */}
        <div className="m-4 rounded-xl border border-border/60 bg-white/[0.025] p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple/30 text-purple-bright text-sm font-bold">
              {getInitials(ticket.userName)}
            </div>
            <div>
              <p className="text-[13px] font-semibold text-white">{ticket.userName}</p>
              <p className="text-[10px] text-muted-2">{ticket.userEmail}</p>
              <p className="text-[10px] text-muted-2">User ID: {ticket.userId}</p>
            </div>
          </div>
          <button className="shrink-0 rounded-xl bg-purple hover:bg-purple-bright px-3 py-1.5 text-[11px] font-semibold text-white transition cursor-pointer">
            View Profile
          </button>
        </div>

        {/* Meta Info */}
        <div className="mx-4 mb-4 grid grid-cols-2 gap-3 text-[11px]">
          <div className="rounded-xl border border-border/40 bg-white/[0.02] p-3">
            <p className="text-muted-2 mb-0.5">Category</p>
            <p className="font-medium text-white">{ticket.category}</p>
          </div>
          <div className="rounded-xl border border-border/40 bg-white/[0.02] p-3">
            <p className="text-muted-2 mb-0.5">Priority</p>
            <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold ${priorityBadgeStyles[ticket.priority]}`}>
              {ticket.priority}
            </span>
          </div>
          <div className="rounded-xl border border-border/40 bg-white/[0.02] p-3">
            <p className="text-muted-2 mb-0.5">Created At</p>
            <p className="font-medium text-white">{ticket.createdAt}</p>
          </div>
          <div className="rounded-xl border border-border/40 bg-white/[0.02] p-3">
            <p className="text-muted-2 mb-0.5">Last Updated</p>
            <p className="font-medium text-white">{ticket.lastUpdate}</p>
          </div>
        </div>

        {/* Subject + Description */}
        <div className="mx-4 mb-4">
          <p className="text-[10px] text-muted-2 mb-1 font-medium uppercase tracking-wider">Subject</p>
          <p className="text-[12px] font-semibold text-white mb-3">{ticket.subjectTitle}</p>
          <p className="text-[10px] text-muted-2 mb-1 font-medium uppercase tracking-wider">Description</p>
          <p className="text-[11px] text-muted leading-relaxed">{ticket.description}</p>
        </div>

        {/* Conversation */}
        {ticket.messages.length > 0 && (
          <div className="mx-4 mb-4">
            <p className="text-[10px] text-muted-2 mb-3 font-medium uppercase tracking-wider">Conversation</p>
            <div className="flex flex-col gap-3">
              {ticket.messages.map((msg) => {
                const isAdmin = msg.sender === "Admin";
                return (
                  <div key={msg.id} className={`flex ${isAdmin ? "flex-row-reverse" : "flex-row"} gap-2.5`}>
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${isAdmin ? "bg-purple/40 text-purple-bright" : "bg-gray-500/20 text-gray-300"}`}>
                      {getInitials(msg.senderName)}
                    </div>
                    <div className={`flex flex-col gap-0.5 max-w-[75%] ${isAdmin ? "items-end" : "items-start"}`}>
                      <div className="flex items-center gap-2">
                        {!isAdmin && <span className="text-[10px] text-muted-2">{msg.senderName}</span>}
                        <span className="text-[9px] text-muted-2">{msg.timestamp}</span>
                        {isAdmin && <span className="text-[10px] text-muted-2">{msg.senderName}</span>}
                      </div>
                      <div className={`rounded-2xl px-3.5 py-2.5 text-[11px] leading-relaxed ${isAdmin ? "bg-purple text-white rounded-tr-sm" : "bg-white/[0.06] text-white rounded-tl-sm"}`}>
                        {msg.content}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Reply Box */}
      <div className="border-t border-border/50 p-4 shrink-0">
        <div className="relative">
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Type your reply..."
            rows={3}
            className="w-full rounded-xl border border-border bg-card-elevated px-4 py-3 pr-20 text-xs text-white placeholder-muted-2 outline-none focus:border-border-strong focus:ring-1 focus:ring-purple-bright/20 transition resize-none"
          />
          <div className="absolute right-3 bottom-3 flex items-center gap-1.5">
            <button type="button" className="flex h-7 w-7 items-center justify-center text-muted-2 hover:text-white transition cursor-pointer">
              <Paperclip className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <button
          type="button"
          className="mt-2.5 w-full flex items-center justify-center gap-2 rounded-xl bg-purple hover:bg-purple-bright py-2.5 text-xs font-semibold text-white transition shadow-[0_8px_20px_rgba(123,44,255,0.25)] cursor-pointer"
        >
          <Send className="h-3.5 w-3.5" />
          Send Reply
        </button>
      </div>
    </div>
  );
}
