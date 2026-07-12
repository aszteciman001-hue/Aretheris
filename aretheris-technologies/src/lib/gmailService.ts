/**
 * Gmail Service for Aretheris Application
 */

export interface GmailProfile {
  emailAddress: string;
  messagesTotal: number;
  threadsTotal: number;
  historyId: string;
}

export interface GmailMessageHeader {
  name: string;
  value: string;
}

export interface GmailMessageDetail {
  id: string;
  threadId: string;
  snippet: string;
  internalDate: string;
  payload: {
    headers: GmailMessageHeader[];
    body?: {
      size: number;
      data?: string;
    };
  };
}

export interface ParsedEmail {
  id: string;
  sender: string;
  subject: string;
  date: string;
  snippet: string;
}

/**
 * Helper to parse standard headers from a message detail payload
 */
export function parseEmail(msg: GmailMessageDetail): ParsedEmail {
  const headers = msg.payload?.headers || [];
  const findHeader = (name: string) => 
    headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || "Unknown";

  const sender = findHeader("from");
  const subject = findHeader("subject");
  const rawDate = findHeader("date");
  
  // Format date nicely
  let dateStr = rawDate;
  try {
    const d = new Date(rawDate);
    if (!isNaN(d.getTime())) {
      dateStr = d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  } catch (e) {
    // Fallback to raw header
  }

  return {
    id: msg.id,
    sender,
    subject,
    date: dateStr,
    snippet: msg.snippet || "No snippet available."
  };
}

/**
 * Fetch the logged in user's profile
 */
export async function getGmailProfile(accessToken: string): Promise<GmailProfile> {
  const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/profile", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json"
    }
  });
  if (!res.ok) {
    throw new Error(`Gmail profile API failed with status ${res.status}`);
  }
  return res.json();
}

/**
 * Fetch and parse the latest emails from the user's inbox
 */
export async function fetchInbox(accessToken: string, query: string = "", limit: number = 8): Promise<ParsedEmail[]> {
  let url = `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${limit}`;
  if (query) {
    url += `&q=${encodeURIComponent(query)}`;
  }

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json"
    }
  });

  if (!res.ok) {
    throw new Error(`Gmail List Messages API failed with status ${res.status}`);
  }

  const data = await res.json();
  const messages: Array<{ id: string; threadId: string }> = data.messages || [];

  if (messages.length === 0) {
    return [];
  }

  // Fetch full details of each message in parallel
  const detailsPromises = messages.map(async (msg) => {
    try {
      const detailRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json"
        }
      });
      if (detailRes.ok) {
        const detailData: GmailMessageDetail = await detailRes.json();
        return parseEmail(detailData);
      }
    } catch (err) {
      console.error(`Failed to fetch email details for ${msg.id}:`, err);
    }
    return null;
  });

  const parsedEmails = await Promise.all(detailsPromises);
  return parsedEmails.filter((email): email is ParsedEmail => email !== null);
}

/**
 * Send an email via Gmail API using Raw base64url MIME format
 */
export async function sendGmailMessage(
  accessToken: string,
  to: string,
  subject: string,
  bodyHtml: string
): Promise<{ id: string; threadId: string }> {
  // Construct raw MIME email
  const emailLines = [
    `To: ${to}`,
    `Subject: ${subject}`,
    "Content-Type: text/html; charset=utf-8",
    "MIME-Version: 1.0",
    "",
    bodyHtml
  ];
  
  const emailStr = emailLines.join("\r\n");
  
  // Safe base64url encoding
  const base64UrlSafe = btoa(unescape(encodeURIComponent(emailStr)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      raw: base64UrlSafe
    })
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message = errorData.error?.message || `Status code ${res.status}`;
    throw new Error(`Failed to send email: ${message}`);
  }

  return res.json();
}
