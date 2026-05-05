const API = "http://127.0.0.1:5000";

// ─── Toast Notification ────────────────────────────────────────────────────

let toastTimer;
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = `toast toast-${type} show`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.className = "toast";
  }, 3500);
}

// ─── Loading State Helpers ─────────────────────────────────────────────────

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

// ─── Add Session ───────────────────────────────────────────────────────────

async function handleAddSession(event) {
  event.preventDefault();

  const topic    = document.getElementById("topic").value.trim();
  const duration = parseInt(document.getElementById("duration").value);
  const focus    = parseInt(document.getElementById("focus").value);

  // Client-side validation
  if (!topic) {
    showToast("Please enter a topic.", "error");
    return;
  }
  if (isNaN(duration) || duration < 1 || duration > 600) {
    showToast("Duration must be between 1 and 600 minutes.", "error");
    return;
  }
  if (isNaN(focus) || focus < 1 || focus > 5) {
    showToast("Focus level must be between 1 and 5.", "error");
    return;
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

// ─── Load Sessions ─────────────────────────────────────────────────────────

async function loadSessions() {
  const list      = document.getElementById("sessions");
  const emptyMsg  = document.getElementById("sessions-empty");

  setLoading("sessions", true);
  list.innerHTML = "";
  emptyMsg.hidden = true;

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
          <div class="session-header-row" style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div class="session-topic">${escapeHTML(s.topic)}</div>
            <div class="session-actions" style="display: flex; gap: 0.5rem;">
              <button class="btn btn-secondary btn-sm" onclick="openEditModal('${s._id}', '${escapeHTML(s.topic).replace(/'/g, "\\'")}', ${s.duration}, ${s.focus_level})" aria-label="Edit session">✏️ Edit</button>
              <button class="btn btn-secondary btn-sm btn-danger" onclick="deleteSession('${s._id}')" aria-label="Delete session" style="color: var(--red); border-color: rgba(248,81,73,0.3);">🗑️ Delete</button>
            </div>
          </div>
          <div class="session-meta">
            <span class="badge badge-blue">⏱ ${s.duration} min</span>
            <span class="badge badge-purple" title="Focus level ${s.focus_level}/5">🎯 ${focusDots}</span>
            ${date ? `<span class="session-date">${date}</span>` : ""}
          </div>
        `;
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

// ─── Load Insights ─────────────────────────────────────────────────────────

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
          </div>
        `;
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

// ─── Best Study Time ───────────────────────────────────────────────────────

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
      const hour    = data[0]._id;
      const focus   = typeof data[0].avg_focus === "number" ? data[0].avg_focus.toFixed(2) : "N/A";
      const hour12  = hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`;
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

// ─── Edit & Delete Sessions ──────────────────────────────────────────────────

async function deleteSession(id) {
  if (!confirm("Are you sure you want to delete this session?")) return;

  try {
    const res = await fetch(`${API}/sessions/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Server error: ${res.status}`);

    showToast("🗑️ Session deleted successfully", "success");
    await loadSessions();
    if (document.getElementById("insights").children.length > 0) loadInsights();
  } catch (err) {
    console.error("Delete session failed:", err);
    showToast("❌ Failed to delete session.", "error");
  }
}

function openEditModal(id, topic, duration, focus_level) {
  document.getElementById("edit-id").value = id;
  document.getElementById("edit-topic").value = topic;
  document.getElementById("edit-duration").value = duration;
  document.getElementById("edit-focus").value = focus_level;
  
  document.getElementById("edit-modal").hidden = false;
  document.getElementById("edit-modal").classList.add("show");
}

function closeEditModal() {
  document.getElementById("edit-modal").classList.remove("show");
  setTimeout(() => {
    document.getElementById("edit-modal").hidden = true;
  }, 300); // Wait for transition
}

async function handleEditSession(event) {
  event.preventDefault();

  const id = document.getElementById("edit-id").value;
  const topic = document.getElementById("edit-topic").value.trim();
  const duration = parseInt(document.getElementById("edit-duration").value);
  const focus = parseInt(document.getElementById("edit-focus").value);

  // Client-side validation
  if (!topic || isNaN(duration) || duration < 1 || duration > 600 || isNaN(focus) || focus < 1 || focus > 5) {
    showToast("Invalid input values.", "error");
    return;
  }

  const btn = document.getElementById("save-edit-btn");
  setButtonLoading(btn, true);

  try {
    const res = await fetch(`${API}/sessions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, duration, focus }),
    });

    if (!res.ok) throw new Error(`Server error: ${res.status}`);

    showToast(`✅ Session updated!`, "success");
    closeEditModal();
    await loadSessions();
    if (document.getElementById("insights").children.length > 0) loadInsights();
  } catch (err) {
    console.error("Edit session failed:", err);
    showToast("❌ Failed to update session.", "error");
  } finally {
    setButtonLoading(btn, false);
  }
}

// ─── Utility ───────────────────────────────────────────────────────────────

function escapeHTML(str) {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// ─── Init ──────────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  // Only auto-load sessions on DOMContentLoaded — not on raw script parse
  loadSessions();
});