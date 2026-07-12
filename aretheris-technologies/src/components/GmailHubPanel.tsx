import React, { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { motion, AnimatePresence } from "motion/react";
import { 
  initAuth, 
  googleSignIn, 
  logout 
} from "../lib/firebaseAuth";
import { 
  getGmailProfile, 
  fetchInbox, 
  sendGmailMessage, 
  ParsedEmail, 
  GmailProfile 
} from "../lib/gmailService";
import { SavedInquiry } from "./InquiryForm";
// @ts-ignore
import aretherisOfficialLogoImg from "../assets/images/aretheris_logo_official_1783868280406.jpg";

// Helper icons
function MailIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function SendIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  );
}

function SearchIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function RefreshIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89H18" />
    </svg>
  );
}

function SparklesIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}

interface GmailHubPanelProps {
  selectedInquiry: SavedInquiry | null;
}

export default function GmailHubPanel({ selectedInquiry }: GmailHubPanelProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Profile and Emails states
  const [profile, setProfile] = useState<GmailProfile | null>(null);
  const [emails, setEmails] = useState<ParsedEmail[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingEmails, setIsLoadingEmails] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<"inbox" | "compose">("inbox");

  // Email Compose form state
  const [composeForm, setComposeForm] = useState({
    to: "",
    subject: "",
    body: ""
  });
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [sendSuccess, setSendSuccess] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<ParsedEmail | null>(null);

  // Initialize auth state
  useEffect(() => {
    const unsubscribe = initAuth(
      (authUser, authToken) => {
        setUser(authUser);
        setToken(authToken);
        setNeedsAuth(false);
      },
      () => {
        setUser(null);
        setToken(null);
        setNeedsAuth(true);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch data when authenticated
  useEffect(() => {
    if (token) {
      loadGmailData();
    }
  }, [token]);

  const loadGmailData = async () => {
    if (!token) return;
    setIsLoadingProfile(true);
    setIsLoadingEmails(true);
    setEmailError("");

    try {
      // Get profile
      const userProfile = await getGmailProfile(token);
      setProfile(userProfile);
    } catch (err: any) {
      console.error("Failed to fetch Gmail profile:", err);
    } finally {
      setIsLoadingProfile(false);
    }

    try {
      // Get recent messages
      const fetchedEmails = await fetchInbox(token, searchQuery);
      setEmails(fetchedEmails);
    } catch (err: any) {
      console.error("Failed to fetch Gmail messages:", err);
      setEmailError("Could not retrieve inbox messages. Try searching or verifying permissions.");
    } finally {
      setIsLoadingEmails(false);
    }
  };

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setEmailError("");
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
        setNeedsAuth(false);
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      setEmailError(err.message || "Authentication aborted or failed.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setToken(null);
      setProfile(null);
      setEmails([]);
      setNeedsAuth(true);
      setSelectedEmail(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadGmailData();
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!composeForm.to || !composeForm.subject || !composeForm.body) {
      setEmailError("All compose fields are required.");
      return;
    }

    // Confirm mutating/sending action
    const confirmed = window.confirm(`Send this email from your account to ${composeForm.to}?`);
    if (!confirmed) return;

    setIsSendingEmail(true);
    setEmailError("");
    setSendSuccess(false);

    try {
      // If the body is raw HTML, do not replace linebreaks with `<br />` to prevent formatting issues
      const htmlBody = composeForm.body.includes("<div") || composeForm.body.includes("<img")
        ? composeForm.body
        : composeForm.body.replace(/\n/g, "<br />");
      await sendGmailMessage(token, composeForm.to, composeForm.subject, htmlBody);
      setSendSuccess(true);
      setComposeForm({ to: "", subject: "", body: "" });
      
      // Auto switch back to inbox or clear success status after 3s
      setTimeout(() => setSendSuccess(false), 5000);
    } catch (err: any) {
      console.error("Failed to send message:", err);
      setEmailError(err.message || "Failed to dispatch email. Please verify the recipient address.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const generateInquiryReceipt = () => {
    if (!selectedInquiry) return;
    
    const subject = `[Aretheris Audit] Certified Inquiry Record - ${selectedInquiry.id}`;
    const body = `Dear ${selectedInquiry.name},\n\n` +
      `This is your official certified Inquiry & Verification receipt from Aretheris. Your requirements have been encrypted and submitted to our core networks.\n\n` +
      `=== CERTIFIED METADATA ===\n` +
      `Verification ID: ${selectedInquiry.id}\n` +
      `Timestamp: ${selectedInquiry.timestamp}\n` +
      `Organization: ${selectedInquiry.org || "None"}\n` +
      `Target Sector: ${selectedInquiry.sector.toUpperCase()}\n` +
      `Projected Traffic: ${selectedInquiry.bandwidth} GB / month\n\n` +
      `Notes Provided:\n"${selectedInquiry.notes}"\n\n` +
      `=========================\n` +
      `Status: SECURE VALIDATED (OFFLINE BYPASS CERTIFIED)\n\n` +
      `Thank you for trusting Aretheris. Our coordinating staff will follow up on your telemetry metrics shortly.\n\n` +
      `Best regards,\n` +
      `Aretheris Technical Operations & Systems Auditor`;

    setComposeForm({
      to: selectedInquiry.email,
      subject,
      body
    });
    setSendSuccess(false);
  };

  const generateLogoPackage = () => {
    const to = profile?.emailAddress || user?.email || "";
    const subject = `[Aretheris Brand Identity] Official High-Resolution JPG Logo`;
    const imageUrl = `${window.location.origin}/src/assets/images/aretheris_logo_official_1783868280406.jpg`;
    const body = `<div style="font-family: sans-serif; background-color: #020617; color: #f1f5f9; padding: 40px 20px; border-radius: 24px; max-width: 600px; margin: 0 auto; border: 1px solid #1e293b;">
  <div style="text-align: center; margin-bottom: 30px;">
    <span style="font-size: 10px; font-family: monospace; font-weight: bold; letter-spacing: 0.2em; color: #38bdf8; background-color: rgba(56, 189, 248, 0.1); padding: 6px 12px; border-radius: 9999px; text-transform: uppercase;">
      Official Brand Identity Package
    </span>
    <h2 style="font-size: 26px; color: #ffffff; margin-top: 15px; margin-bottom: 5px; font-weight: 800; letter-spacing: -0.025em;">
      Aretheris Technologies
    </h2>
    <p style="font-size: 11px; font-family: monospace; color: #64748b; margin: 0;">
      RECONSTRUCTION // HIGH-RES JPG ASSET
    </p>
  </div>

  <div style="text-align: center; margin: 30px 0;">
    <div style="display: inline-block; background-color: #090d16; border: 1px solid #334155; border-radius: 16px; padding: 12px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);">
      <img src="${imageUrl}" alt="Aretheris Official Logo Picture" style="width: 280px; height: 280px; border-radius: 10px; object-fit: cover; display: block;" />
    </div>
    <p style="font-size: 11px; font-family: monospace; color: #475569; margin-top: 10px;">
      Figure 1.0: Live cryptographic mesh (high-res .jpg render)
    </p>
  </div>

  <div style="border-top: 1px solid #1e293b; padding-top: 20px; font-size: 14px; line-height: 1.6; color: #cbd5e1; font-weight: 300;">
    <p>Dear Operator,</p>
    <p>
      At your request, we have exported the official high-resolution <strong>Aretheris Mesh</strong> logo image as a standard picture (JPEG) matching the live application.
    </p>
    <p>
      This graphic depicts our iconic self-healing neural lattice, combining sky-blue, deep indigo, and hot pink purple telemetry orbits around a central quantum synchronization core.
    </p>
  </div>

  <div style="margin-top: 30px; padding: 15px; background-color: #0b1329; border-radius: 12px; border: 1px solid #1e293b; font-family: monospace; font-size: 11px;">
    <strong style="color: #38bdf8; display: block; margin-bottom: 8px;">FILE METADATA</strong>
    <span style="color: #64748b;">Asset Type:</span> <span style="color: #e2e8f0;">Joint Photographic Experts Group (.jpg)</span><br />
    <span style="color: #64748b;">Local Path:</span> <span style="color: #e2e8f0;">/src/assets/images/aretheris_logo_official_1783868280406.jpg</span><br />
    <span style="color: #64748b;">CDN Hosting:</span> <a href="${imageUrl}" target="_blank" style="color: #38bdf8; text-decoration: none;">${imageUrl}</a>
  </div>

  <div style="border-top: 1px solid #1e293b; margin-top: 30px; padding-top: 20px; text-align: center; font-size: 11px; font-family: monospace; color: #475569;">
    Sent via Aretheris Brand Hub • Authenticated Google Session
  </div>
</div>`;

    setComposeForm({
      to,
      subject,
      body
    });
    setSendSuccess(false);
  };

  // Render Login Card if not authenticated
  if (needsAuth) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-10 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
          <MailIcon className="w-8 h-8" />
        </div>

        <div className="space-y-2 max-w-sm">
          <h4 className="text-lg font-display font-bold text-slate-100">
            Aretheris Mailroom & Gmail Center
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed font-light">
            Connect your Google Workspace Account to manage inquiry receipts, explore your Gmail inbox, perform instant context searches, and dispatch certified reports directly with permission.
          </p>
        </div>

        {emailError && (
          <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3 max-w-xs">
            {emailError}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={isLoggingIn}
          className="gsi-material-button hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
          style={{ cursor: "pointer" }}
        >
          <div className="gsi-material-button-state"></div>
          <div className="gsi-material-button-content-wrapper">
            <div className="gsi-material-button-icon">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: "block" }}>
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                <path fill="none" d="M0 0h48v48H0z"></path>
              </svg>
            </div>
            <span className="gsi-material-button-contents text-slate-800 text-sm font-semibold">
              {isLoggingIn ? "Authorizing Account..." : "Sign in with Google"}
            </span>
          </div>
        </button>
      </div>
    );
  }

  // Render Full Gmail Hub Interface
  return (
    <div className="flex flex-col flex-1 min-h-[360px] text-xs font-mono">
      {/* Account Info Bar */}
      <div className="flex items-center justify-between bg-slate-950/60 border border-slate-900 rounded-xl p-3 mb-4 shrink-0">
        <div className="flex items-center space-x-3 truncate">
          {user?.photoURL ? (
            <img 
              src={user.photoURL} 
              alt="Avatar" 
              className="w-8 h-8 rounded-full border border-blue-500/20" 
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center font-bold text-blue-400">
              {user?.displayName?.[0] || user?.email?.[0] || "U"}
            </div>
          )}
          <div className="truncate">
            <span className="text-slate-200 block font-semibold font-sans leading-tight">
              {user?.displayName || "Google Operator"}
            </span>
            <span className="text-[10px] text-slate-500 block truncate leading-tight">
              {profile?.emailAddress || user?.email || "Gmail Active"}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="px-2 py-1 rounded bg-slate-900 border border-slate-800 hover:border-red-500/40 text-slate-400 hover:text-red-400 transition-colors shrink-0 text-[10px] cursor-pointer"
        >
          Sign Out
        </button>
      </div>

      {/* Local Sub-Tabs for Gmail (Inbox Explorer vs Send email) */}
      <div className="flex space-x-1.5 border-b border-slate-900 pb-3 mb-3 shrink-0">
        <button
          onClick={() => {
            setActiveSubTab("inbox");
            setSelectedEmail(null);
          }}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeSubTab === "inbox"
              ? "bg-slate-950 border border-slate-900 text-blue-400 font-bold"
              : "text-slate-500 hover:text-slate-300 border border-transparent"
          }`}
        >
          <MailIcon className="w-3.5 h-3.5" />
          <span>Gmail Inbox</span>
        </button>
        <button
          onClick={() => setActiveSubTab("compose")}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeSubTab === "compose"
              ? "bg-slate-950 border border-slate-900 text-blue-400 font-bold"
              : "text-slate-500 hover:text-slate-300 border border-transparent"
          }`}
        >
          <SendIcon className="w-3.5 h-3.5" />
          <span>Compose Mail</span>
        </button>
      </div>

      {/* Main Gmail Work Area */}
      <div className="flex-1 flex flex-col overflow-y-auto max-h-[250px]">
        {activeSubTab === "inbox" ? (
          /* GMAIL INBOX SUB-TAB */
          <div className="space-y-3 flex flex-col flex-1">
            {/* Search Form */}
            <form onSubmit={handleSearchSubmit} className="flex space-x-1.5 shrink-0">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter inbox (e.g. from:Aretheris or subject:Audit)..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-900 rounded-lg focus:outline-none focus:border-blue-500 text-[11px] text-slate-300"
                />
                <div className="absolute left-2.5 top-2 text-slate-600">
                  <SearchIcon className="w-3.5 h-3.5" />
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoadingEmails}
                className="p-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 hover:border-blue-500/40 text-blue-400 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
                title="Search Gmail"
              >
                {isLoadingEmails ? (
                  <div className="w-3.5 h-3.5 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                ) : (
                  <RefreshIcon className="w-3.5 h-3.5" />
                )}
              </button>
            </form>

            {/* Email List or Detailed view */}
            {selectedEmail ? (
              /* Expanded Email Details View */
              <div className="p-3 bg-slate-950/80 border border-slate-900 rounded-xl space-y-3">
                <div className="flex justify-between items-start border-b border-slate-900 pb-2">
                  <div className="space-y-1">
                    <span className="text-[10px] text-blue-500 block">SUBJECT:</span>
                    <span className="text-slate-100 font-sans font-bold leading-tight block">
                      {selectedEmail.subject}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedEmail(null)}
                    className="text-[10px] text-slate-500 hover:text-slate-200 border border-slate-800 px-2 py-0.5 rounded"
                  >
                    Close
                  </button>
                </div>

                <div className="space-y-1 text-[10px]">
                  <div>
                    <span className="text-slate-500">From: </span>
                    <span className="text-slate-300 font-sans font-semibold">{selectedEmail.sender}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Date: </span>
                    <span className="text-slate-400">{selectedEmail.date}</span>
                  </div>
                </div>

                <div className="text-[11px] font-sans leading-relaxed text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-900/60 whitespace-pre-wrap max-h-[120px] overflow-y-auto">
                  {selectedEmail.snippet}
                </div>
              </div>
            ) : (
              /* Email Inbox Feed */
              <div className="space-y-2 flex-1 overflow-y-auto pr-1">
                {isLoadingEmails && emails.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-slate-500">
                    <div className="w-5 h-5 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-2" />
                    <span className="text-[10px]">Connecting to mail servers...</span>
                  </div>
                ) : emails.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <p>No messages found matching query.</p>
                    <button
                      onClick={loadGmailData}
                      className="text-blue-400 hover:underline mt-2 text-[10px] cursor-pointer"
                    >
                      Refresh Inbox
                    </button>
                  </div>
                ) : (
                  emails.map((email) => (
                    <div
                      key={email.id}
                      onClick={() => setSelectedEmail(email)}
                      className="p-2.5 bg-slate-950/40 border border-slate-900/60 rounded-xl hover:border-blue-500/30 transition-all cursor-pointer group flex flex-col space-y-1 text-left"
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-sans font-semibold text-slate-300 group-hover:text-blue-400 transition-colors truncate max-w-[65%]">
                          {email.sender.split("<")[0] || email.sender}
                        </span>
                        <span className="text-[9px] text-slate-600 font-light whitespace-nowrap shrink-0">
                          {email.date.split(" ")[0]}
                        </span>
                      </div>
                      <span className="text-slate-200 font-sans font-semibold truncate block leading-tight">
                        {email.subject || "(No Subject)"}
                      </span>
                      <p className="text-[10px] font-sans font-light text-slate-500 truncate leading-snug">
                        {email.snippet}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ) : (
          /* GMAIL COMPOSE SUB-TAB */
          <form onSubmit={handleSendEmail} className="space-y-3 text-left">
            {/* Quick pre-populate shortcuts block */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {selectedInquiry ? (
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-2.5 flex items-center justify-between">
                  <div className="truncate pr-1">
                    <span className="text-[10px] text-blue-400 font-bold flex items-center space-x-1">
                      <SparklesIcon className="w-3 h-3 animate-pulse" />
                      <span>Inquiry Receipt Shortcut</span>
                    </span>
                    <span className="text-[9px] text-slate-500 block truncate">
                      Generate email for Inquiry {selectedInquiry.id}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={generateInquiryReceipt}
                    className="px-2 py-1 bg-blue-600/10 hover:bg-blue-600/25 border border-blue-500/30 text-blue-300 text-[10px] rounded transition-colors cursor-pointer shrink-0"
                  >
                    Generate
                  </button>
                </div>
              ) : (
                <div className="bg-slate-950/40 border border-slate-900 rounded-xl p-2.5 flex items-center justify-center text-center">
                  <span className="text-[9px] text-slate-500 italic">Select an Inquiry in Logs to unlock custom receipts</span>
                </div>
              )}

              <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-2.5 flex flex-col space-y-2.5 sm:col-span-2">
                <div className="flex items-center space-x-3">
                  <img 
                    src={aretherisOfficialLogoImg} 
                    alt="Aretheris High-Res Logo Preview" 
                    className="w-12 h-12 object-cover rounded-lg border border-indigo-500/30 shrink-0" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="truncate flex-1">
                    <span className="text-[10px] text-indigo-400 font-bold flex items-center space-x-1">
                      <SparklesIcon className="w-3 h-3 animate-pulse" />
                      <span>Official High-Resolution Aretheris Picture (.jpg)</span>
                    </span>
                    <span className="text-[9px] text-slate-400 block truncate">
                      Decentralized Self-Healing Quantum-Neural Mesh
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2 w-full justify-end">
                  <a
                    href={aretherisOfficialLogoImg}
                    download="aretheris_logo_official.jpg"
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 bg-indigo-500 hover:bg-indigo-600 border border-indigo-400/30 text-white text-[10px] font-bold rounded-lg transition-colors cursor-pointer shrink-0 flex items-center space-x-1"
                  >
                    <span>Download Image</span>
                  </a>
                  <button
                    type="button"
                    onClick={generateLogoPackage}
                    className="px-2.5 py-1 bg-indigo-600/10 hover:bg-indigo-600/25 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold rounded-lg transition-colors cursor-pointer shrink-0"
                  >
                    Load into Compose
                  </button>
                </div>
              </div>
            </div>

            {emailError && (
              <div className="text-[10px] text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-2">
                {emailError}
              </div>
            )}

            {sendSuccess && (
              <div className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2.5 font-bold">
                ✓ Email dispatched successfully via Gmail! A copy has been saved to your Sent folder.
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[9px] text-slate-500 uppercase font-bold block">To Address *</label>
              <input
                required
                type="email"
                value={composeForm.to}
                onChange={(e) => setComposeForm(prev => ({ ...prev, to: e.target.value }))}
                placeholder="recipient@domain.com"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-900 rounded-lg focus:outline-none focus:border-blue-500 text-slate-300 font-sans"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] text-slate-500 uppercase font-bold block">Subject *</label>
              <input
                required
                type="text"
                value={composeForm.subject}
                onChange={(e) => setComposeForm(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Inquiry registration feedback"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-900 rounded-lg focus:outline-none focus:border-blue-500 text-slate-300 font-sans"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] text-slate-500 uppercase font-bold block">Message Body *</label>
              <textarea
                required
                rows={4}
                value={composeForm.body}
                onChange={(e) => setComposeForm(prev => ({ ...prev, body: e.target.value }))}
                placeholder="Write your email body..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-900 rounded-lg focus:outline-none focus:border-blue-500 text-slate-300 font-sans leading-relaxed text-[11px]"
              />
            </div>

            <button
              type="submit"
              disabled={isSendingEmail}
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 text-[11px]"
            >
              {isSendingEmail ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Dispatching Message...</span>
                </>
              ) : (
                <>
                  <SendIcon className="w-3.5 h-3.5" />
                  <span>Send Email via Gmail</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
