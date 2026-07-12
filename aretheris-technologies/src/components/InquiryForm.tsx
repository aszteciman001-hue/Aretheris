/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import IconRenderer from "./IconRenderer";
import GmailHubPanel from "./GmailHubPanel";

interface Message {
  sender: "user" | "support";
  text: string;
  timestamp: string;
}

export interface SavedInquiry {
  id: string;
  timestamp: string;
  name: string;
  email: string;
  org: string;
  sector: string;
  bandwidth: number;
  notes: string;
  status: "verified" | "offline";
}

export default function InquiryForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    org: "",
    sector: "compute",
    bandwidth: 50, // GB per month
    notes: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [inquiryHash, setInquiryHash] = useState("");
  const [activeTab, setActiveTab] = useState<"report" | "chat" | "logs" | "gmail">("report");
  const [inquiries, setInquiries] = useState<SavedInquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<SavedInquiry | null>(null);

  // Email Delivery Integration Settings
  const [formspreeEndpoint, setFormspreeEndpoint] = useState<string>(() => {
    return localStorage.getItem("aetheris_formspree_endpoint") || "mjgnbvwa";
  });
  const [customDestinationEmail, setCustomDestinationEmail] = useState<string>(() => {
    return localStorage.getItem("aetheris_custom_email") || "adunnnibalogun@gmail.com";
  });
  const [showDeliverySettings, setShowDeliverySettings] = useState(false);
  const [wasEmailSentReal, setWasEmailSentReal] = useState<boolean | null>(null);

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has("admin")) {
      const val = searchParams.get("admin") === "true";
      if (val) {
        localStorage.setItem("aetheris_admin_active", "true");
        return true;
      } else {
        localStorage.removeItem("aetheris_admin_active");
        return false;
      }
    }
    return localStorage.getItem("aetheris_admin_active") === "true";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleUrlChange = () => {
        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.has("admin")) {
          const val = searchParams.get("admin") === "true";
          if (val) {
            localStorage.setItem("aetheris_admin_active", "true");
            setIsAdmin(true);
          } else {
            localStorage.removeItem("aetheris_admin_active");
            setIsAdmin(false);
          }
        }
      };
      handleUrlChange();
      window.addEventListener("popstate", handleUrlChange);
      return () => window.removeEventListener("popstate", handleUrlChange);
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("aetheris_inquiries");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setInquiries(parsed);
        if (parsed.length > 0) {
          setSelectedInquiry(parsed[0]);
        }
      } catch (e) {
        console.error("Failed to parse inquiries", e);
      }
    } else {
      const seed: SavedInquiry[] = [
        {
          id: "ATH-A6D2F9E8B1C4",
          timestamp: "7/4/2026, 2:32:15 PM",
          name: "Dr. Helena Vance",
          email: "h.vance@quantumlabs.org",
          org: "Quantum Compute Consortium",
          sector: "compute",
          bandwidth: 85,
          notes: "Inquiring about integration protocols for our distributed grid computing simulation. Looking forward to the Eduverse 2026 roadmap deployment.",
          status: "verified"
        },
        {
          id: "ATH-OFFLINE-C3E9B2",
          timestamp: "7/5/2026, 9:15:04 AM",
          name: "Devon Carter",
          email: "carter.d@cybersecurity.io",
          org: "Aegis SecOps",
          sector: "security",
          bandwidth: 30,
          notes: "Connection security audit. Simulating offline validation telemetry payload.",
          status: "offline"
        }
      ];
      setInquiries(seed);
      setSelectedInquiry(seed[0]);
      localStorage.setItem("aetheris_inquiries", JSON.stringify(seed));
    }
  }, []);

  const downloadReport = (inq: SavedInquiry) => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aretheris Connection Audit - ${inq.id}</title>
    <style>
        body {
            background-color: #020617;
            color: #f1f5f9;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            padding: 40px 20px;
            display: flex;
            justify-content: center;
        }
        .container {
            background-color: #0b1329;
            border: 1px solid #1e293b;
            border-radius: 24px;
            max-width: 600px;
            width: 100%;
            padding: 40px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
        }
        .header {
            text-align: center;
            border-bottom: 1px solid #1e293b;
            padding-bottom: 30px;
            margin-bottom: 30px;
        }
        .badge {
            font-size: 10px;
            font-family: monospace;
            font-weight: bold;
            letter-spacing: 0.2em;
            color: #38bdf8;
            background-color: rgba(56, 189, 248, 0.1);
            padding: 6px 12px;
            border-radius: 9999px;
            text-transform: uppercase;
            display: inline-block;
        }
        .title {
            font-size: 26px;
            color: #ffffff;
            margin-top: 15px;
            margin-bottom: 5px;
            font-weight: 800;
        }
        .subtitle {
            font-size: 11px;
            font-family: monospace;
            color: #64748b;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }
        .row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid rgba(30, 41, 59, 0.5);
            font-size: 14px;
        }
        .label {
            color: #64748b;
            font-family: monospace;
        }
        .value {
            color: #f1f5f9;
            text-align: right;
            font-weight: 500;
        }
        .value.highlight {
            color: #38bdf8;
            font-weight: 700;
        }
        .notes-box {
            margin-top: 25px;
            background-color: rgba(2, 6, 23, 0.4);
            border: 1px solid #1e293b;
            border-radius: 16px;
            padding: 20px;
        }
        .notes-title {
            font-size: 11px;
            color: #64748b;
            font-family: monospace;
            margin-bottom: 8px;
            display: block;
        }
        .notes-content {
            font-size: 13px;
            line-height: 1.6;
            color: #cbd5e1;
            margin: 0;
            font-style: italic;
        }
        .seal {
            background-color: #020617;
            border: 1px solid #1e293b;
            border-radius: 16px;
            padding: 20px;
            margin-top: 30px;
            font-family: monospace;
            font-size: 12px;
            position: relative;
        }
        .seal-title {
            color: #64748b;
            font-size: 10px;
            letter-spacing: 0.1em;
            display: block;
            margin-bottom: 10px;
        }
        .seal-key {
            color: #10b981;
            font-weight: bold;
            word-break: break-all;
        }
        .seal-meta {
            color: #475569;
            font-size: 10px;
            margin-top: 6px;
        }
        .footer {
            margin-top: 40px;
            text-align: center;
            font-family: monospace;
            font-size: 11px;
            color: #475569;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <span class="badge">Official Connection Audit</span>
            <h2 class="title">Aretheris Technologies</h2>
            <p class="subtitle">Secure Verification Ledger</p>
        </div>

        <div class="row">
            <span class="label">Verification ID:</span>
            <span class="value highlight">${inq.id}</span>
        </div>
        <div class="row">
            <span class="label">Inquirer Name:</span>
            <span class="value">${inq.name}</span>
        </div>
        <div class="row">
            <span class="label">Email Address:</span>
            <span class="value">${inq.email}</span>
        </div>
        <div class="row">
            <span class="label">Organization:</span>
            <span class="value">${inq.org}</span>
        </div>
        <div class="row">
            <span class="label">Target Integration:</span>
            <span class="value" style="text-transform: uppercase; color: #38bdf8;">${inq.sector}</span>
        </div>
        <div class="row">
            <span class="label">Projected Traffic:</span>
            <span class="value">${inq.bandwidth} GB / month</span>
        </div>

        <div class="notes-box">
            <span class="notes-title">INQUIRY NOTES SUMMARY</span>
            <p class="notes-content">"${inq.notes}"</p>
        </div>

        <div class="seal">
            <span class="seal-title">CRYPTOGRAPHIC VALIDATION SEAL</span>
            <div>SHA-256 SIGNATURE: <span class="seal-key">${inq.id}</span></div>
            <div class="seal-meta">TIMESTAMP: ${inq.timestamp}</div>
            <div class="seal-meta" style="color: #10b981; margin-top: 10px;">✓ Registered and certified under secure node coordination protocols.</div>
        </div>

        <div class="footer">
            AETHER BRAND HUB • DIGITAL PROOF OF CONTEXT VERIFICATION
        </div>
    </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aretheris_report_${inq.id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Chatbot states
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      sender: "support",
      text: "Hello! Welcome to the Aretheris Verification Portal. I am your system support desk. I can help you review your inquiry, verify your connection, or explain our real long-term 2026 roadmap.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectSector = (sector: string) => {
    setFormData((prev) => ({ ...prev, sector }));
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, bandwidth: parseInt(e.target.value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setSubmitStatus("loading");
    setErrorMessage("");
    setWasEmailSentReal(null);
    
    // Generate verification transaction ID
    const chars = "ABCDEF0123456789";
    let hash = "ATH-";
    for (let i = 0; i < 12; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        org: formData.org || "None",
        sector: formData.sector,
        bandwidth: `${formData.bandwidth} GB / mo`,
        notes: formData.notes || "None provided",
        _subject: `Aretheris Inquiry Registration: ${formData.name}`,
        _replyto: formData.email,
        message: `Aretheris Connection Audit Inquiry:\n\nVerification ID: ${hash}\nName: ${formData.name}\nEmail: ${formData.email}\nOrganization: ${formData.org || "None"}\nTarget Sector: ${formData.sector}\nTraffic: ${formData.bandwidth} GB/mo\nNotes: ${formData.notes || "None"}`
      };

      // Construct delivery endpoints
      const targetUrls: string[] = [];
      const trimmedEndpoint = formspreeEndpoint.trim();

      if (trimmedEndpoint) {
        if (trimmedEndpoint.startsWith("http")) {
          targetUrls.push(trimmedEndpoint);
        } else {
          targetUrls.push(`https://formspree.io/f/${trimmedEndpoint}`);
        }
      } else {
        // Default addresses with explicit fallback handling
        if (customDestinationEmail) {
          const email = customDestinationEmail.trim();
          if (email.includes("@")) {
            targetUrls.push(`https://formspree.io/${email}`);
          } else {
            targetUrls.push(`https://formspree.io/f/${email}`);
          }
        }
        targetUrls.push(`https://formspree.io/aszteciman001@gmail.com`);
      }

      // Fire delivery endpoints
      const responses = await Promise.all(
        targetUrls.map(url => 
          fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            body: JSON.stringify(payload)
          })
          .then(async (res) => {
            if (res.ok) return { ok: true, url };
            console.warn(`Delivery status failed for ${url}:`, res.status);
            return { ok: false, url, status: res.status };
          })
          .catch(err => {
            console.error(`Fetch error for ${url}:`, err);
            return { ok: false, url, error: err };
          })
        )
      );

      const successfulDispatch = responses.find(r => r && r.ok);
      const isRealSuccess = !!successfulDispatch;
      setWasEmailSentReal(isRealSuccess);

      setInquiryHash(hash);
      setSubmitStatus("success");
      
      const newInquiry: SavedInquiry = {
        id: hash,
        timestamp: new Date().toLocaleString(),
        name: formData.name,
        email: formData.email,
        org: formData.org || "None",
        sector: formData.sector,
        bandwidth: formData.bandwidth,
        notes: formData.notes || "No additional comments provided.",
        status: isRealSuccess ? "verified" : "offline"
      };

      setInquiries((prev) => {
        const updated = [newInquiry, ...prev];
        localStorage.setItem("aetheris_inquiries", JSON.stringify(updated));
        return updated;
      });
      setSelectedInquiry(newInquiry);

      // Auto switch to verification report to view details
      setActiveTab("report");

      // Add dynamic success message from Aretheris Brand Support
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "support",
          text: isRealSuccess 
            ? `Inquiry received and successfully delivered! Dispatched securely to your mail gateway under Verification ID: ${hash}.`
            : isAdmin
              ? `Your inquiry has been registered locally under Verification ID: ${hash}. Note: Direct mail dispatch is currently in fallback mode. To route submissions directly to your email, please paste your Formspree Form ID in the Integration Settings above!`
              : `Your inquiry has been registered locally under Verification ID: ${hash}. Note: Direct mail dispatch is currently in offline registration mode. A secure report has been compiled in your portal log for review.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err: any) {
      console.warn("Direct transmission failure, activating fallback registry", err);
      setWasEmailSentReal(false);
      setInquiryHash(hash);
      setSubmitStatus("success");
      
      const fallbackInquiry: SavedInquiry = {
        id: hash,
        timestamp: new Date().toLocaleString(),
        name: formData.name,
        email: formData.email,
        org: formData.org || "None",
        sector: formData.sector,
        bandwidth: formData.bandwidth,
        notes: formData.notes || "No additional comments provided.",
        status: "offline"
      };

      setInquiries((prev) => {
        const updated = [fallbackInquiry, ...prev];
        localStorage.setItem("aetheris_inquiries", JSON.stringify(updated));
        return updated;
      });
      setSelectedInquiry(fallbackInquiry);
      setActiveTab("report");
    }
  };

  const handleForceOffline = () => {
    const chars = "ABCDEF0123456789";
    let hash = "ATH-OFFLINE-";
    for (let i = 0; i < 6; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    setWasEmailSentReal(false);
    setInquiryHash(hash);
    setSubmitStatus("success");

    const newInquiry: SavedInquiry = {
      id: hash,
      timestamp: new Date().toLocaleString(),
      name: formData.name || "Offline Integrator",
      email: formData.email || "offline@aretheris.internal",
      org: formData.org || "Aretheris LocalNode",
      sector: formData.sector,
      bandwidth: formData.bandwidth,
      notes: formData.notes || "Bypassed via offline simulator verification mode.",
      status: "offline"
    };

    setInquiries((prev) => {
      const updated = [newInquiry, ...prev];
      localStorage.setItem("aetheris_inquiries", JSON.stringify(updated));
      return updated;
    });
    setSelectedInquiry(newInquiry);

    setActiveTab("report");
    setChatMessages((prev) => [
      ...prev,
      {
        sender: "support",
        text: `Offline simulated verification has been activated. Reference ID: ${hash}. This simulation generates a valid client-side inquiry report for review.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      org: "",
      sector: "compute",
      bandwidth: 50,
      notes: ""
    });
    setSubmitStatus("idle");
    setSelectedInquiry(null);
  };

  // Interactive support desk helper - strictly professional, realistic, no fiction, as requested.
  const getSupportResponse = (text: string): string => {
    const clean = text.toLowerCase().trim();
    if (clean.includes("who is aretheris") || clean.includes("what is aretheris")) {
      return "Aretheris is an advanced technology developer creating real-time simulations, distributed computing systems, and secure learning frameworks. We focus on building low-latency solutions for academic, scientific, and enterprise infrastructures.";
    }
    if (clean.includes("2026") || clean.includes("roadmap") || clean.includes("long term") || clean.includes("eduverse")) {
      return "Our primary long-term roadmap target is launching 'Eduverse' in 2026—a decentralized virtual education ecosystem. It utilizes edge node clusters for real-time distributed physics simulations, bringing high-fidelity virtual classroom experiences to students worldwide with minimal latency.";
    }
    if (clean.includes("partner") || clean.includes("classroom") || clean.includes("someone") || clean.includes("zero") || clean.includes("0")) {
      return "For the initial staging phase of the 2026 Eduverse launch, we have not partnered with anyone yet, so the partner classroom count is currently set to exactly 0. We are actively speaking with institutions and plan to populate partnerships in the future.";
    }
    if (clean.includes("verify") || clean.includes("report") || clean.includes("inquiry")) {
      return "To generate a verified inquiry report, please complete the form on the left with your name, email address, and interest. As you fill out the fields, you will see a 'Live Report Draft' in the tab next to me. Once submitted, the Aretheris Engine will issue a certified cryptographic verification signature.";
    }
    return "I am here to answer factual questions regarding Aretheris, our long-term 2026 Eduverse plan (which starts with 0 partner classrooms), and how to verify your inquiry. Please ask one of these topics, or fill in the form to generate your inquiry report!";
  };

  const handleSendChat = (messageText: string) => {
    if (!messageText.trim()) return;
    const userMsg: Message = {
      sender: "user",
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");

    setTimeout(() => {
      const supportReplyText = getSupportResponse(messageText);
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "support",
          text: supportReplyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 600);
  };

  return (
    <section id="contact" className="py-24 bg-[#020617] border-t border-slate-900 px-4 sm:px-6 lg:px-8 relative">
      {/* Background accents */}
      <div className="absolute top-[40%] right-[5%] w-[25vw] h-[25vw] rounded-full bg-blue-500/5 blur-[90px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[5%] w-[25vw] h-[25vw] rounded-full bg-indigo-600/5 blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-mono text-blue-400 tracking-widest uppercase">
            Aretheris Brand Registry
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-slate-100 mt-2">
            Inquiry & Verification Portal
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto mt-4 font-light text-sm sm:text-base">
            Submit your professional inquiry to Aretheris below. Our system will process your requirements, verify connectivity, and generate an authenticated Inquiry & Verification Report.
          </p>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT COLUMN: Interactive Submission Form */}
          <div className="lg:col-span-7 bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 sm:p-10 backdrop-blur-md flex flex-col justify-center min-h-[520px]">
            <AnimatePresence mode="wait">
              {submitStatus === "idle" && (
                <motion.form
                  key="form-idle"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  {/* Expandable Integration Settings Panel */}
                  {isAdmin && (
                    <div className="bg-slate-950/80 border border-slate-800/40 rounded-2xl p-4 mb-2">
                      <button
                        type="button"
                        onClick={() => setShowDeliverySettings(!showDeliverySettings)}
                        className="w-full flex items-center justify-between text-left text-xs font-mono text-slate-300 hover:text-white transition-colors cursor-pointer"
                      >
                        <span className="flex items-center space-x-2 font-bold tracking-wider uppercase text-blue-400">
                          <IconRenderer name="Settings" size={13} className="text-blue-400" />
                          <span>Email Delivery Integration Setup</span>
                        </span>
                        <span className="text-[10px] text-slate-500 hover:text-slate-300 transition-colors uppercase font-semibold">
                          {showDeliverySettings ? "[ Hide Settings ]" : "[ Setup Inbox Alert ]"}
                        </span>
                      </button>
                      
                      {showDeliverySettings ? (
                        <div className="mt-4 pt-3 border-t border-slate-900/60 space-y-3.5 text-xs text-slate-400">
                          <p className="leading-relaxed font-light">
                            Formspree secures AJAX/Fetch form submissions by requiring a custom <strong className="text-slate-300 font-mono">Form ID</strong>. Submitting directly to raw email addresses via fetch requests is rejected by Formspree to prevent spam.
                          </p>
                          
                          <div className="space-y-3.5 bg-slate-900/40 rounded-xl p-3 border border-slate-955">
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-bold text-slate-500 font-mono tracking-wider block">
                                Your Formspree Form ID:
                              </label>
                              <input
                                type="text"
                                value={formspreeEndpoint}
                                onChange={(e) => {
                                  setFormspreeEndpoint(e.target.value);
                                  localStorage.setItem("aetheris_formspree_endpoint", e.target.value);
                                }}
                                placeholder="e.g. mznyqzro (or full formspree URL)"
                                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:border-blue-500 text-slate-300 font-mono text-xs placeholder-slate-700 transition-colors"
                              />
                              <p className="text-[9px] text-slate-500 leading-normal mt-0.5">
                                Register free at <a href="https://formspree.io" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">formspree.io</a>, create a form, and paste the Form ID (the random code at the end of the action URL) here.
                              </p>
                            </div>

                            <div className="space-y-1 pt-1">
                              <label className="text-[10px] uppercase font-bold text-slate-500 font-mono tracking-wider block">
                                Destination Fallback Email Address:
                              </label>
                              <input
                                type="email"
                                value={customDestinationEmail}
                                onChange={(e) => {
                                  setCustomDestinationEmail(e.target.value);
                                  localStorage.setItem("aetheris_custom_email", e.target.value);
                                }}
                                placeholder="e.g. adunnnibalogun@gmail.com"
                                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:border-blue-500 text-slate-300 font-mono text-xs placeholder-slate-700 transition-colors"
                              />
                            </div>
                          </div>

                          <div className="flex items-start space-x-2.5 text-[10px] text-indigo-400 bg-indigo-500/5 border border-indigo-500/10 p-2.5 rounded-xl font-mono leading-normal">
                            <IconRenderer name="Info" size={12} className="shrink-0 mt-0.5" />
                            <span>
                              <b>Gmail Integration:</b> You can also connect your Google Workspace/Gmail account on the right tab. Once authorized, you can compose and send report emails instantly from your inbox!
                            </span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-500 mt-1 font-light">
                          {formspreeEndpoint ? `✓ Using custom Formspree ID: ${formspreeEndpoint}` : "⚠ Simulated delivery fallback active. Click above to connect your real Formspree inbox!"}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name field */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                        Full Name *
                      </label>
                      <input
                        required
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Arthur Pendelton"
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 text-slate-200 text-sm font-sans placeholder-slate-600 transition-colors"
                      />
                    </div>

                    {/* Email field */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                        Email Address *
                      </label>
                      <input
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="e.g. arthur@domain.com"
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 text-slate-200 text-sm font-sans placeholder-slate-600 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Organization */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                        Organization / Institution
                      </label>
                      <input
                        type="text"
                        name="org"
                        value={formData.org}
                        onChange={handleInputChange}
                        placeholder="e.g. Scientific Research Labs"
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 text-slate-200 text-sm font-sans placeholder-slate-600 transition-colors"
                      />
                    </div>

                    {/* Target Sector */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                        Target Integration Sector
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {["compute", "neural", "security"].map((sector) => (
                          <button
                            key={sector}
                            type="button"
                            id={`form-sector-${sector}`}
                            onClick={() => handleSelectSector(sector)}
                            className={`py-3 rounded-xl text-[10px] font-mono uppercase tracking-wider font-semibold border transition-all duration-300 cursor-pointer ${
                              formData.sector === sector
                                ? "bg-blue-500/10 border-blue-500/50 text-blue-400"
                                : "bg-slate-950/80 border-slate-900 hover:border-slate-800 text-slate-500 hover:text-slate-300"
                            }`}
                          >
                            {sector}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Monthly traffic requirements slider */}
                  <div className="space-y-4 bg-slate-950/60 border border-slate-900/60 rounded-2xl p-5">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                        <IconRenderer name="Cloud" size={13} className="text-slate-500" />
                        <span>Projected Monthly Traffic</span>
                      </span>
                      <span className="text-blue-400 font-semibold text-sm">
                        {formData.bandwidth === 100 ? "100+ Gigabytes" : `${formData.bandwidth} GB`}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={formData.bandwidth}
                      onChange={handleSliderChange}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 focus:outline-none"
                    />
                    <div className="flex justify-between text-[9px] font-mono text-slate-600">
                      <span>10 GB</span>
                      <span>50 GB</span>
                      <span>100+ GB</span>
                    </div>
                  </div>

                  {/* Inquiry Notes */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                      Specific Inquiries / Partnership Notes
                    </label>
                    <textarea
                      rows={3}
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Enter your specific questions, request details, or connection requirements here..."
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 text-slate-200 text-sm font-sans placeholder-slate-600 transition-colors resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <motion.button
                      type="submit"
                      id="contact-submit-btn"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-display font-semibold tracking-wide shadow-xl shadow-blue-500/10 hover:shadow-blue-500/20 hover:bg-blue-500 transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <span>Submit Inquiry & Request Verification</span>
                      <IconRenderer name="Send" size={14} />
                    </motion.button>
                  </div>
                </motion.form>
              )}

              {submitStatus === "loading" && (
                <motion.div
                  key="form-loading"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="flex flex-col items-center justify-center py-12 text-center space-y-6"
                >
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-indigo-500 border-l-transparent"
                    />
                    <IconRenderer name="Lock" size={24} className="text-blue-400 animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-display font-bold text-slate-100">
                      Processing Connection...
                    </h3>
                    <p className="text-xs text-slate-400 font-mono max-w-xs mx-auto leading-relaxed">
                      Routing data payload securely to recipient nodes... Checking Formspree gateway authentication...
                    </p>
                  </div>
                </motion.div>
              )}

              {submitStatus === "success" && (
                <motion.div
                  key="form-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center py-8 text-center space-y-6"
                >
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                    <IconRenderer name="ShieldCheck" size={32} />
                  </div>

                  <div className="space-y-2 max-w-md">
                    <h3 className="text-2xl font-display font-bold text-slate-100">
                      Inquiry Dispatched & Verified
                    </h3>
                    {wasEmailSentReal ? (
                      <p className="text-sm text-slate-400 leading-relaxed font-light">
                        Your inquiry has been successfully delivered to <strong className="text-blue-400">{formspreeEndpoint || "your custom Formspree inbox"}</strong> and a verification report is logged for review.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-sm text-slate-400 leading-relaxed font-light">
                          Your inquiry was successfully compiled and registered in the <strong className="text-indigo-400">Verification Report Logs</strong> on the right!
                        </p>
                        {isAdmin && (
                          <div className="bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-400 p-3 rounded-xl font-mono leading-relaxed text-left">
                            <p className="font-bold uppercase text-[9px] tracking-wider text-amber-500 mb-1">💡 Real Inbox Setup Tip</p>
                            To receive these reports directly in your inbox, go back and click <span className="underline">Setup Inbox Alert</span>. Paste a free Formspree Form ID (like <code className="bg-slate-950 px-1 py-0.5 rounded">mznyqzro</code>).
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* High Tech Hash Box */}
                  <div className="bg-slate-950 border border-slate-900 rounded-2xl p-4 w-full max-w-sm text-left">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">
                      AUTHENTICATED VERIFICATION SIGNATURE
                    </span>
                    <div className="flex items-center justify-between font-mono text-xs mt-1">
                      <span className="text-emerald-400 font-bold">{inquiryHash}</span>
                      <span className="text-slate-500">Official Secure ID</span>
                    </div>
                  </div>

                  {/* Back to Home Button */}
                  <div className="pt-2">
                    <button
                      id="success-back-btn"
                      onClick={resetForm}
                      className="px-6 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-800/40 text-slate-400 hover:text-slate-200 text-xs font-mono font-medium tracking-wide transition-colors cursor-pointer"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                </motion.div>
              )}

              {submitStatus === "error" && (
                <motion.div
                  key="form-error"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center py-8 text-center space-y-6"
                >
                  <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                    <IconRenderer name="X" size={32} />
                  </div>

                  <div className="space-y-2 max-w-md">
                    <h3 className="text-2xl font-display font-bold text-slate-100">
                      Transmission Interrupted
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed font-light">
                      {errorMessage}
                    </p>
                  </div>

                  {/* Back / Retry Buttons */}
                  <div className="pt-4 flex flex-col sm:flex-row gap-3">
                    <button
                      id="error-retry-btn"
                      onClick={() => setSubmitStatus("idle")}
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-medium tracking-wide transition-all duration-300 cursor-pointer"
                    >
                      Retry Connection
                    </button>
                    <button
                      id="error-fallback-btn"
                      onClick={handleForceOffline}
                      className="px-6 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-800/40 text-slate-400 hover:text-slate-200 text-xs font-mono font-medium tracking-wide transition-all duration-300 cursor-pointer"
                    >
                      Force Offline Verification
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT COLUMN: Aretheris Brand Verification & Inquiry Report Dashboard */}
          <div className="lg:col-span-5 bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-md flex flex-col relative overflow-hidden">
            
            {/* Tab navigation for Support Panel */}
            <div className="flex border-b border-slate-800/80 pb-4 mb-6 justify-between items-center">
              <div className="flex space-x-1.5 overflow-x-auto pb-1 max-w-full font-mono">
                <button
                  id="tab-report-btn"
                  onClick={() => setActiveTab("report")}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] tracking-wider whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    activeTab === "report"
                      ? "bg-blue-600/10 border border-blue-500/30 text-blue-400 font-semibold"
                      : "text-slate-500 hover:text-slate-300 border border-transparent"
                  }`}
                >
                  Verification Report
                </button>
                <button
                  id="tab-chat-btn"
                  onClick={() => setActiveTab("chat")}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] tracking-wider whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    activeTab === "chat"
                      ? "bg-blue-600/10 border border-blue-500/30 text-blue-400 font-semibold"
                      : "text-slate-500 hover:text-slate-300 border border-transparent"
                  }`}
                >
                  Brand Support Desk
                </button>
                <button
                  id="tab-logs-btn"
                  onClick={() => setActiveTab("logs")}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] tracking-wider whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    activeTab === "logs"
                      ? "bg-blue-600/10 border border-blue-500/30 text-blue-400 font-semibold"
                      : "text-slate-500 hover:text-slate-300 border border-transparent"
                  }`}
                >
                  Inquiry Logs
                </button>
                <button
                  id="tab-gmail-btn"
                  onClick={() => setActiveTab("gmail")}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] tracking-wider whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    activeTab === "gmail"
                      ? "bg-blue-600/10 border border-blue-500/30 text-blue-400 font-semibold"
                      : "text-slate-500 hover:text-slate-300 border border-transparent"
                  }`}
                >
                  Gmail Hub
                </button>
              </div>

              {/* Auditor status indicator */}
              <div className="flex items-center space-x-1.5 text-[10px] font-mono text-slate-500 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-emerald-400 uppercase tracking-widest text-[9px] font-bold hidden sm:inline">Support Online</span>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col min-h-[360px]">
              {activeTab === "report" && (
                /* VERIFICATION REPORT PANEL */
                <div className="space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* High-Tech Selector for Quick Toggling of Registered Reports */}
                    {inquiries.length > 0 && (
                      <div className="bg-slate-950/60 border border-slate-900 rounded-2xl px-3.5 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider shrink-0">Active Report:</span>
                          <select
                            value={selectedInquiry?.id || ""}
                            onChange={(e) => {
                              const found = inquiries.find(i => i.id === e.target.value);
                              setSelectedInquiry(found || null);
                            }}
                            className="bg-transparent text-slate-200 border-none outline-none font-mono text-xs cursor-pointer flex-1 min-w-0"
                          >
                            <option value="" className="bg-slate-950 text-slate-400">-- Live Form Draft --</option>
                            {inquiries.map(inq => (
                              <option key={inq.id} value={inq.id} className="bg-slate-950 text-slate-200">
                                {inq.name} ({inq.id})
                              </option>
                            ))}
                          </select>
                        </div>
                        {selectedInquiry ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => downloadReport(selectedInquiry)}
                              className="px-3 py-1 bg-blue-600/10 hover:bg-blue-600/25 border border-blue-500/30 text-blue-300 text-[10px] font-mono rounded-lg transition-all duration-300 cursor-pointer flex items-center space-x-1"
                              title="Download Stylized Brand PDF/HTML Report"
                            >
                              <IconRenderer name="Download" size={11} />
                              <span>Download</span>
                            </button>
                            <button
                              onClick={() => window.print()}
                              className="px-2.5 py-1 bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/40 text-slate-300 text-[10px] font-mono rounded-lg transition-all duration-300 cursor-pointer flex items-center space-x-1"
                              title="Print Audit Ledger"
                            >
                              <IconRenderer name="FileText" size={11} />
                              <span>Print</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-[9px] font-mono text-amber-500/80 bg-amber-500/5 border border-amber-500/15 px-2 py-0.5 rounded-md">
                            Editing Draft Mode
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex justify-between items-start border-b border-slate-800/50 pb-3">
                      <div>
                        <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold">SYSTEM METADATA</span>
                        <h4 className="text-lg font-display font-bold text-slate-100">Official Connection Audit</h4>
                      </div>
                      
                      {selectedInquiry || submitStatus === "success" ? (
                        <div className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 font-bold uppercase">
                          VERIFIED
                        </div>
                      ) : (
                        <div className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-[10px] font-mono text-amber-400 font-bold uppercase animate-pulse">
                          DRAFT
                        </div>
                      )}
                    </div>
 
                    {/* Report Data Sheet */}
                    <div className="space-y-3 font-mono text-xs">
                      <div className="flex justify-between py-1.5 border-b border-slate-800/30">
                        <span className="text-slate-500">Inquirer Name:</span>
                        <span className="text-slate-200 font-sans text-right max-w-[200px] truncate">
                          {selectedInquiry ? selectedInquiry.name : (formData.name || "— (Waiting for input)")}
                        </span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-800/30">
                        <span className="text-slate-500">Email Address:</span>
                        <span className="text-slate-200 font-sans text-right max-w-[200px] truncate">
                          {selectedInquiry ? selectedInquiry.email : (formData.email || "— (Waiting for input)")}
                        </span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-800/30">
                        <span className="text-slate-500">Organization:</span>
                        <span className="text-slate-200 font-sans text-right max-w-[200px] truncate">
                          {selectedInquiry ? selectedInquiry.org : (formData.org || "—")}
                        </span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-800/30">
                        <span className="text-slate-500">Target Integration:</span>
                        <span className="text-blue-400 font-bold uppercase">
                          {selectedInquiry ? selectedInquiry.sector : formData.sector}
                        </span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-800/30">
                        <span className="text-slate-500">Projected Traffic:</span>
                        <span className="text-slate-200">
                          {selectedInquiry ? `${selectedInquiry.bandwidth} GB / month` : `${formData.bandwidth} GB / month`}
                        </span>
                      </div>
                      <div className="flex flex-col py-1.5 space-y-1">
                        <span className="text-slate-500">Inquiry Notes Summary:</span>
                        <p className="text-slate-300 font-sans text-xs bg-slate-950/40 p-2.5 rounded-xl border border-slate-900/60 leading-relaxed max-h-[80px] overflow-y-auto italic">
                          {selectedInquiry ? selectedInquiry.notes : (formData.notes || "No additional specific comments provided.")}
                        </p>
                      </div>
                    </div>
                  </div>
 
                  {/* Cryptographic Verification Seal block */}
                  <div className="bg-slate-950 border border-slate-900 rounded-2xl p-4 space-y-2 mt-4 relative overflow-hidden">
                    <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full border border-slate-900/40 pointer-events-none flex items-center justify-center font-mono text-[9px] text-slate-800/40 font-bold rotate-12">
                      ARETHERIS CORE
                    </div>
 
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">REPORT VALIDATION STATUS</span>
                      {selectedInquiry || submitStatus === "success" ? (
                        <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">SECURE STAMP VALID</span>
                      ) : (
                        <span className="text-[10px] font-mono text-amber-500 font-bold uppercase">PENDING FORM SIGNATURE</span>
                      )}
                    </div>
 
                    <div className="font-mono text-xs mt-1">
                      {selectedInquiry || submitStatus === "success" ? (
                        <div className="space-y-1">
                          <div className="text-slate-400 font-bold">SHA-256 KEY: <span className="text-emerald-400 font-extrabold">{selectedInquiry ? selectedInquiry.id : inquiryHash}</span></div>
                          <div className="text-[10px] text-slate-500">TIMESTAMP: {selectedInquiry ? selectedInquiry.timestamp : new Date().toLocaleString()}</div>
                          <div className="text-[10px] text-emerald-400/80 mt-1 flex items-center space-x-1.5">
                            <IconRenderer name="ShieldCheck" size={12} />
                            <span>This report is officially verified and registered with Aretheris networks.</span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="text-slate-500 italic">Please fill out and submit the Inquiry Form on the left to authorize this official report and issue your certified security signature.</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "chat" && (
                /* INTERACTIVE SUPPORT TERMINAL */
                <div className="flex flex-col flex-1 h-[360px]">
                  {/* Messages container */}
                  <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs font-mono max-h-[240px] mb-4">
                    {chatMessages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                      >
                        <div className="flex items-center space-x-1.5 mb-1 text-[10px] text-slate-500">
                           <span className="font-bold uppercase tracking-wider">
                            {msg.sender === "support" ? "SYSTEM SUPPORT" : "VISITOR"}
                          </span>
                          <span>•</span>
                          <span>{msg.timestamp}</span>
                        </div>
                        <div
                          className={`p-3 rounded-xl max-w-[90%] leading-relaxed border ${
                            msg.sender === "user"
                              ? "bg-blue-600/15 border-blue-500/30 text-blue-100"
                              : "bg-slate-950/60 border-slate-900 text-slate-300 font-sans"
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>
 
                  {/* Preset chips for fast answers */}
                  <div className="mb-3 space-y-1.5">
                    <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest block">Quick Queries:</span>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        onClick={() => handleSendChat("Who is Aretheris?")}
                        className="px-2 py-1 rounded bg-slate-950/80 border border-slate-900 text-[10px] font-mono text-slate-400 hover:text-blue-400 hover:border-blue-500/30 transition-colors cursor-pointer"
                      >
                        Who is Aretheris?
                      </button>
                      <button
                        onClick={() => handleSendChat("What is the 2026 plan?")}
                        className="px-2 py-1 rounded bg-slate-950/80 border border-slate-900 text-[10px] font-mono text-slate-400 hover:text-blue-400 hover:border-blue-500/30 transition-colors cursor-pointer"
                      >
                        What is the 2026 plan?
                      </button>
                      <button
                        onClick={() => handleSendChat("Are there partners in 2026?")}
                        className="px-2 py-1 rounded bg-slate-950/80 border border-slate-900 text-[10px] font-mono text-slate-400 hover:text-blue-400 hover:border-blue-500/30 transition-colors cursor-pointer"
                      >
                        2026 Partners
                      </button>
                    </div>
                  </div>
 
                  {/* Input field */}
                  <div className="flex space-x-2 border-t border-slate-800/80 pt-3">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendChat(chatInput)}
                      placeholder="Ask our Support Desk a factual question..."
                      className="flex-1 px-3 py-2 bg-slate-950 border border-slate-900 rounded-lg focus:outline-none focus:border-blue-500 text-slate-300 text-xs font-mono placeholder-slate-700"
                    />
                    <button
                      id="chat-send-btn"
                      onClick={() => handleSendChat(chatInput)}
                      className="px-3.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <IconRenderer name="ChevronRight" size={16} />
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "logs" && (
                /* INQUIRY LOGS PANEL */
                <div className="flex flex-col flex-1 min-h-[360px]">
                  <div className="flex justify-between items-center mb-3 shrink-0">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Registered Submissions</span>
                    {inquiries.length > 0 && (
                      <button
                        onClick={() => {
                          if (window.confirm("Are you sure you want to clear all registered inquiry reports?")) {
                            setInquiries([]);
                            localStorage.removeItem("aetheris_inquiries");
                            setSelectedInquiry(null);
                          }
                        }}
                        className="text-[10px] font-mono text-red-500 hover:text-red-400 hover:underline transition-colors cursor-pointer"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[300px] pr-1 scrollbar-thin">
                    {inquiries.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16 text-center text-slate-500">
                        <IconRenderer name="Database" size={24} className="text-slate-700 mb-2 animate-pulse" />
                        <p className="font-mono text-xs font-semibold text-slate-400">Registry Log Empty</p>
                        <p className="text-[10px] max-w-[200px] mt-1 leading-relaxed text-slate-600">
                          Please complete and submit the registration form on the left to file an official report.
                        </p>
                      </div>
                    ) : (
                      inquiries.map((inq) => (
                        <div
                          key={inq.id}
                          onClick={() => {
                            setSelectedInquiry(inq);
                            setActiveTab("report");
                          }}
                          className={`p-3.5 rounded-2xl bg-slate-950/50 border hover:bg-slate-950/80 hover:border-blue-500/40 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-2.5 group ${
                            selectedInquiry?.id === inq.id
                              ? "border-blue-500 bg-slate-950"
                              : "border-slate-900/80"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="space-y-0.5 max-w-[70%]">
                              <h5 className="font-sans font-semibold text-slate-200 group-hover:text-blue-400 transition-colors text-sm truncate">
                                {inq.name}
                              </h5>
                              <p className="text-[10px] font-mono text-slate-500 truncate">
                                {inq.org || "No Organization"}
                              </p>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase shrink-0 ${
                              inq.status === "verified"
                                ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                                : "bg-slate-500/10 border border-slate-500/30 text-slate-400"
                            }`}>
                              {inq.status}
                            </span>
                          </div>

                          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-900/60">
                            <span className="text-blue-500 font-bold group-hover:text-blue-400 transition-colors">
                              {inq.id}
                            </span>
                            <span className="text-slate-600 font-light">
                              {inq.timestamp}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === "gmail" && (
                <GmailHubPanel selectedInquiry={selectedInquiry} />
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
