const API = "http://127.0.0.1:5000";

async function addSession() {
  const topic = document.getElementById("topic").value;
  const duration = document.getElementById("duration").value;
  const focus = document.getElementById("focus").value;

  await fetch(API + "/add", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ topic, duration, focus })
  });

  loadSessions();
}

async function loadSessions() {
  const res = await fetch(API + "/sessions");
  const data = await res.json();

  const list = document.getElementById("sessions");
  list.innerHTML = "";

  data.forEach(s => {
    const li = document.createElement("li");
    li.innerText = `${s.topic} - ${s.duration} min (Focus: ${s.focus_level})`;
    list.appendChild(li);
  });
}

async function loadInsights() {
  const res = await fetch(API + "/insights");
  const data = await res.json();

  const list = document.getElementById("insights");
  list.innerHTML = "";

  data.forEach(i => {
    const li = document.createElement("li");
    li.innerText = `${i._id}: ${i.total_time} min (Avg Focus: ${i.avg_focus.toFixed(2)})`;
    list.appendChild(li);
  });
}

async function bestTime() {
  const res = await fetch(API + "/best-time");
  const data = await res.json();

  if (data.length > 0) {
    document.getElementById("bestTime").innerText =
      `Best hour: ${data[0]._id}:00 (Focus: ${data[0].avg_focus.toFixed(2)})`;
  }
}

loadSessions();