// lib/notify.ts
"use client";

export const notify = async (subject: string, body: string, replyTo?: string) => {
  try {
    const r = await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, body, replyTo }),
    });
    const j = await r.json().catch(() => null);
    if (!j?.success) console.error("Notify (admin) email failed:", j?.error || `HTTP ${r.status}`);
  } catch (e) {
    console.error("Notify failed", e);
  }
};

export const notifyAdmin = (subject: string, body: string, replyTo?: string) => notify(subject, body, replyTo);

export const notifyUser = async (to: string, subject: string, body: string) => {
  try {
    const r = await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, body, to, sendToUser: true }),
    });
    const j = await r.json().catch(() => null);
    if (!j?.success) console.error("Notify (user) email failed:", j?.error || `HTTP ${r.status}`);
  } catch (e) {
    console.error("NotifyUser failed", e);
  }
};
