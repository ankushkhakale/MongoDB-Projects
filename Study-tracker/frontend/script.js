const API = "http://127.0.0.1:5000";

let toastTimer;
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = `toast toast-${type} show`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.className = "toast"; }, 3500);
}

function setLoading(section, isLoading) {
  const loader = document.getElementById(`${section}-loading`);
  if (loader) loader.hidden = !isLoading;
}

function setButtonLoading(btn, isLoading) {
  const text = btn.querySelector(".btn-text");
  const loader = btn.querySelector(".btn-loader");
  if (text) text.hidden = isLoading;
  if (loader) loader.hidden = !isLoading;
  btn.disabled = isLoading;
}

async function handleAddSession(event) {
  event.preventDefault();
  const topic    = document.getElementById("topic").value.trim();
  const duration = parseInt(document.getElementById("duration").value);
  const focus    = parseInt(document.getElementById("focus").value);

  if (!topic) { showToast("Please enter a topic.", "error"); return; }
  if (isNaN(duration) || duration < 1 || duration > 600) {
    showToast("Duration must be between 1 and 600 minutes.", "error"); return;
  }
  if (isNaN(focus) || focus < 1 || focus > 5) {
    showToast("Focus level must be between 1 and 5.", "error"); return;
  }

  const btn = document.getElementById("add-btn");
  setButtonLoading(btn, true);
  try {
    const res = await fetch(`${API}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, duration, focus }),
    });
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    document.getElementById("session-form").reset();
    showToast(`✅ Session "${topic}" added!`, "success");
    await loadSessions();
  } catch (err) {
    console.error("Add session failed:", err);
    showToast("❌ Failed to add session. Is the backend running?", "error");
  } finally {
    setButtonLoading(btn, false);
  }
}

async function loadSessions() {
  const list     = document.getElementById("sessions");
  const emptyMsg = document.getElementById("sessions-empty");
  setLoading("sessions", true);
  list.innerHTML = "";
  emptyMsg.hidden = true;
  emptyMsg.classList.remove("empty-state-error");
  try {
    const res = await fetch(`${API}/sessions`);
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    const data = await res.json();
    if (data.length === 0) {
      emptyMsg.hidden = false;
    } else {
      data.forEach((s) => {
        const li = document.createElement("li");
        li.className = "session-item";
        const focusDots = "●".repeat(s.focus_level) + "○".repeat(5 - s.focus_level);
        const date = s.created_at
          ? new Date(s.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })
          : "";
        li.innerHTML = `
          <div class="session-topic">${escapeHTML(s.topic)}</div>
          <div class="session-meta">
            <span class="badge badge-blue">⏱ ${s.duration} min</span>
            <span class="badge badge-purple" title="Focus level ${s.focus_level}/5">🎯 ${focusDots}</span>
            ${date ? `<span class="session-date">${date}</span>` : ""}
          </div>`;
        list.appendChild(li);
      });
    }
  } catch (err) {
    console.error("Load sessions failed:", err);
    emptyMsg.textContent = "⚠️ Could not connect to backend. Make sure Flask is running on port 5000.";
    emptyMsg.hidden = false;
    emptyMsg.classList.add("empty-state-error");
  } finally {
    setLoading("sessions", false);
  }
}

async function loadInsights() {
  const list     = document.getElementById("insights");
  const emptyMsg = document.getElementById("insights-empty");
  const btn      = document.getElementById("insights-btn");
  setLoading("insights", true);
  list.innerHTML = "";
  emptyMsg.hidden = true;
  btn.disabled = true;
  try {
    const res = await fetch(`${API}/insights`);
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    const data = await res.json();
    if (data.length === 0) {
      emptyMsg.hidden = false;
    } else {
      const maxTime = Math.max(...data.map((i) => i.total_time));
      data.forEach((i) => {
        const avgFocus = typeof i.avg_focus === "number" ? i.avg_focus.toFixed(2) : "N/A";
        const barWidth = maxTime > 0 ? Math.round((i.total_time / maxTime) * 100) : 0;
        const li = document.createElement("li");
        li.className = "insight-item";
        li.innerHTML = `
          <div class="insight-header">
            <span class="insight-topic">${escapeHTML(i._id || "Unknown")}</span>
            <span class="insight-stats">
              <span class="badge badge-blue">⏱ ${i.total_time} min</span>
              <span class="badge badge-green">🎯 Avg ${avgFocus}</span>
            </span>
          </div>
          <div class="insight-bar-track">
            <div class="insight-bar-fill" style="width: ${barWidth}%"></div>
          </div>`;
        list.appendChild(li);
      });
    }
  } catch (err) {
    console.error("Load insights failed:", err);
    showToast("❌ Could not load insights. Is the backend running?", "error");
  } finally {
    setLoading("insights", false);
    btn.disabled = false;
  }
}

async function checkBestTime() {
  const result = document.getElementById("besttime-result");
  const btn    = document.getElementById("besttime-btn");
  setLoading("besttime", true);
  result.textContent = "";
  btn.disabled = true;
  try {
    const res = await fetch(`${API}/best-time`);
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    const data = await res.json();
    if (data.length > 0) {
      const hour   = data[0]._id;
      const focus  = typeof data[0].avg_focus === "number" ? data[0].avg_focus.toFixed(2) : "N/A";
      const hour12 = hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`;
      result.innerHTML = `🏆 Your peak focus hour is <strong>${hour12}</strong> with an average focus score of <strong>${focus} / 5</strong>.`;
    } else {
      result.textContent = "Not enough data yet. Add more sessions to get insights!";
    }
  } catch (err) {
    console.error("Best time failed:", err);
    result.textContent = "⚠️ Could not fetch data. Make sure the backend is running.";
  } finally {
    setLoading("besttime", false);
    btn.disabled = false;
  }
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

document.addEventListener("DOMContentLoaded", loadSessions);
