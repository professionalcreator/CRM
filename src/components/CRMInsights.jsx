import React, { useState, useRef, useEffect } from "react";
import { Sparkles, MessageSquare, AlertTriangle, ArrowRight, CornerDownRight, CheckSquare, PlusCircle, Send, Loader2 } from "lucide-react";
import { api } from "../services/api";

export default function CRMInsights({
  leads = [],
  customers = [],
  deals = [],
  ideas = [],
  feedback = [],
  tasks = [],
  onAddIdea,
  onAddTask,
  onRefreshData
}) {
  const [isTyping, setIsTyping] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Hello! I am **CRM Insights**, your AI customer strategist. I've analyzed your ClientFlow database. You can ask me questions like:\n- *Who is at risk of leaving?*\n- *Which leads are hot opportunities?*\n- *What are my tasks for today?*\n- *Summarize recent feature requests.*"
    }
  ]);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // AI ANALYTICS CALCULATIONS
  // 1. Identify at-risk customers (keywords in notes or unresolved tickets)
  const atRiskCustomers = customers.map(cust => {
    let riskScore = 15; // baseline
    let reasons = [];

    // Support requests check
    const openTickets = cust.supportRequests?.filter(s => s.status === "Open") || [];
    openTickets.forEach(t => {
      if (t.priority === "Critical") { riskScore += 45; reasons.push(`Open Critical ticket: "${t.title}"`); }
      else if (t.priority === "High") { riskScore += 30; reasons.push(`Open High-priority ticket: "${t.title}"`); }
      else { riskScore += 15; reasons.push(`Open support ticket: "${t.title}"`); }
    });

    // Notes keywords check
    const textToScan = cust.notes?.map(n => n.text.toLowerCase()).join(" ") || "";
    if (textToScan.includes("complain") || textToScan.includes("unhappy") || textToScan.includes("frustrated")) {
      riskScore += 25;
      reasons.push("Negative note keywords detected");
    }
    if (textToScan.includes("delay") || textToScan.includes("slow")) {
      riskScore += 15;
      reasons.push("Delivery delays mentioned");
    }

    const finalScore = Math.min(riskScore, 95);
    return {
      ...cust,
      riskScore: finalScore,
      reasons
    };
  }).filter(c => c.riskScore > 20).sort((a, b) => b.riskScore - a.riskScore);

  // 2. Recommend Promising Sales Opportunities (Qualified status and high values)
  const salesRecommendations = deals.filter(d => d.stage !== "Closed Won" && d.stage !== "Closed Lost")
    .map(deal => {
      let probability = 45; // baseline
      let highlights = [];

      if (deal.stage === "Proposal") { probability += 25; highlights.push("Proposal Sent"); }
      if (deal.stage === "Demo") { probability += 15; highlights.push("Product Demo complete"); }
      if (deal.priority === "Critical" || deal.priority === "High") { probability += 10; highlights.push("High deal urgency"); }
      if (deal.amount >= 75000) { probability += 10; highlights.push("High contract volume"); }

      return {
        ...deal,
        probability: Math.min(probability, 90),
        highlights
      };
    }).sort((a, b) => b.probability - a.probability).slice(0, 3);

  // 3. Next Best Actions for Leads
  const leadNextBestActions = leads.map(l => {
    let action = "Schedule initial qualification call.";
    if (l.status === "Contacted") {
      action = `Schedule product demo showing ${l.interest || "Enterprise features"}.`;
    } else if (l.status === "Qualified") {
      action = "Draft custom integration proposal sheet.";
    }
    return {
      ...l,
      action
    };
  });

  // 4. Feedback Clustering Simulation (Group Dark Mode requests)
  const darkModeFeedbacks = feedback.filter(f => f.feedbackText.toLowerCase().includes("dark mode") || f.feedbackText.toLowerCase().includes("dark ui"));
  const alreadyClustered = ideas.some(i => i.title.includes("Dark Mode"));

  const handleCreateClusterIdea = () => {
    if (alreadyClustered) return;
    onAddIdea({
      title: "Native Application Dark Mode Theme",
      description: "Build a dark UI layout stylesheet to reduce eye strain for operators managing antique catalogs at night.",
      customerProblem: "Multiple clients complaining of screen strain when loading antiquities listings after hours.",
      category: "UX",
      impactScore: 9,
      effortScore: 2,
      priority: "High",
      status: "Approved",
      votes: darkModeFeedbacks.length || 3
    });
    alert("Feedback cluster converted successfully into a Product Idea!");
    onRefreshData();
  };

  // CHAT BOT BACKEND API ENGINE
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessageText = chatInput.trim();
    setMessages(prev => [...prev, { id: Date.now(), sender: "user", text: userMessageText }]);
    setChatInput("");
    setIsTyping(true);

    try {
      const data = await api.insightsChat(userMessageText, "Admin");
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: "ai", text: data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: "ai", text: "Sorry, I had trouble analyzing the database. Please check if the backend server is online." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="crm-insights-view" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Premium AI Header */}
      <div className="ai-console-header">
        <div className="ai-console-logo">
          <div className="ai-pulse-ring"></div>
          <Sparkles size={22} style={{ color: "#a78bfa" }} />
          <div>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>CRM Insights Console</h2>
            <p style={{ fontSize: "0.8rem", color: "#a78bfa" }}>Active Database Analysis Engine</p>
          </div>
        </div>
        <span style={{ fontSize: "0.75rem", backgroundColor: "rgba(255,255,255,0.08)", padding: "4px 10px", borderRadius: "20px" }}>
          Database connection: SECURE
        </span>
      </div>

      <div className="ai-insights-grid">
        {/* Left Side: Strategic Recommendations Boards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Customer Risk Matrix */}
          <div className="dashboard-card">
            <div className="card-header-flex">
              <h3 style={{ fontSize: "1rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 6, color: "var(--text-main)" }}>
                <AlertTriangle size={16} style={{ color: "#ef4444" }} />
                At-Risk Customer Churn Alerts
              </h3>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {atRiskCustomers.length === 0 ? (
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", textAlign: "center", padding: "16px" }}>
                  All accounts currently flag healthy retention values.
                </p>
              ) : (
                atRiskCustomers.map(cust => (
                  <div
                    key={cust.id}
                    style={{
                      padding: "14px",
                      borderRadius: "var(--radius-sm)",
                      backgroundColor: "#fff5f5",
                      border: "1px solid #fee2e2",
                      display: "grid",
                      gridTemplateColumns: "1.5fr auto",
                      alignItems: "center",
                      gap: "12px"
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "#991b1b" }}>
                        {cust.name} ({cust.company})
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#7f1d1d", display: "flex", flexDirection: "column", gap: 3, marginTop: 4 }}>
                        {cust.reasons.map((r, i) => (
                          <span key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <CornerDownRight size={10} /> {r}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="badge badge-risk-high" style={{ fontSize: "0.7rem", padding: "4px 10px" }}>
                      Risk: {cust.riskScore}%
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pipeline recommendations */}
          <div className="dashboard-card">
            <div className="card-header-flex">
              <h3 style={{ fontSize: "1rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 6, color: "var(--text-main)" }}>
                <Sparkles size={16} style={{ color: "var(--primary-color)" }} />
                Promising Deal Opportunities Recommender
              </h3>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {salesRecommendations.map(rec => (
                <div
                  key={rec.id}
                  className="ai-recommendation-item"
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-main)" }}>
                        {rec.name}
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>
                        Company: {rec.company} | Owner: {rec.assignedTo}
                      </span>
                    </div>
                    <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--primary-color)" }}>
                      ${rec.amount.toLocaleString()}
                    </span>
                  </div>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.75rem", marginTop: 4 }}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      {rec.highlights.map((h, i) => (
                        <span key={i} style={{ backgroundColor: "var(--primary-light)", color: "var(--primary-color)", padding: "2px 6px", borderRadius: 4, fontWeight: 500 }}>
                          {h}
                        </span>
                      ))}
                    </div>
                    <strong style={{ color: "#059669" }}>{rec.probability}% Close Probability</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback Clustering Simulator */}
          <div className="dashboard-card">
            <div className="card-header-flex">
              <h3 style={{ fontSize: "1rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 6, color: "var(--text-main)" }}>
                <MessageSquare size={16} style={{ color: "#0d9488" }} />
                AI Feedback Clustering (Dark UI Requests)
              </h3>
            </div>

            <div className="ai-cluster-card">
              <div>
                <span style={{ fontSize: "0.7rem", backgroundColor: "#f5f3ff", color: "#7c3aed", padding: "2px 8px", borderRadius: 4, fontWeight: "bold", textTransform: "uppercase" }}>
                  Identified Cluster (UX Category)
                </span>
                <h4 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-main)", marginTop: 6 }}>
                  Native Application Dark Mode Theme
                </h4>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 4 }}>
                  Multiple customer feedback logs (e.g. from Selina Kyle) request dark mode UI options to avoid screen strain when viewing listing entries at night.
                </p>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-color)", paddingTop: 10 }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)" }}>
                  Cluster Size: {darkModeFeedbacks.length} feedbacks
                </span>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  style={{ backgroundColor: "#0d9488" }}
                  onClick={handleCreateClusterIdea}
                  disabled={alreadyClustered}
                >
                  <PlusCircle size={12} />
                  {alreadyClustered ? "Idea Board Synced" : "Convert to Product Idea"}
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Conversational Assistant Chatbot Console */}
        <div className="chatbot-wrapper">
          <div className="chat-header">
            <Sparkles size={16} style={{ color: "#a78bfa" }} />
            <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>CRM Assistant Chatbot</span>
          </div>

          <div className="chat-messages-container">
            {messages.map(msg => (
              <div key={msg.id} className={`chat-bubble ${msg.sender}`}>
                <p style={{ whiteSpace: "pre-wrap" }}>{msg.text}</p>
              </div>
            ))}
            
            {isTyping && (
              <div className="chat-bubble ai" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Loader2 size={14} className="spinner-loader" style={{ animation: "spin 1s linear infinite" }} />
                <span>AI Assistant is analyzing CRM tables...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleChatSubmit} className="chat-input-bar">
            <input
              type="text"
              className="chat-input"
              placeholder="Ask AI e.g. Who is at risk? or List hot opportunities..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              disabled={isTyping}
            />
            <button type="submit" className="btn btn-primary btn-sm" style={{ padding: "8px 12px" }} disabled={isTyping}>
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
