
// init Supabase
const supabaseClient = supabase.createClient(
  "https://project.supabase.co", // ganti sama project url
"anonkey"                     // ganti sama anon key
);

// login with GitHub
document.getElementById("login-github")?.addEventListener("click", async () => {
  const { data, error } = await supabaseClient.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: "https://URL/chat.html" // ganti domain hosting lo
    }
  });

  if (error) {
    // You should handle the error here, e.g., show a toast message or an alert.
    console.error("Error signing in with Github:", error.message);
    alert("Login failed. Please try again.");
  } else {
    // The user has been redirected, so this block may not be reached immediately.
    // However, it's good practice for other types of sign-in methods.
    console.log("Redirecting to Google/Github for sign-in...");
  }
});

// cek session biar ga login ulang
async function checkSession() {
  const { data: { session } } = await supabaseClient.auth.getSession();

  if (session && window.location.pathname.includes("index.html")) {
    window.location.href = "chat.html"; // udah login → langsung pindah chat
  }
}

checkSession();

// ================== CHAT ==================
const messagesContainer = document.getElementById("messages");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");

const MOCKAPI_URL = "mockapi_url"; // ganti dgn mockapi lo

async function loadMessages() {
  const res = await fetch(MOCKAPI_URL);
  const data = await res.json();
  messagesContainer.innerHTML = "";
  data.forEach(msg => {
    const div = document.createElement("div");
    div.textContent = `${msg.username}: ${msg.text}`;
    messagesContainer.appendChild(div);
  });
}

async function sendMessage() {
  const { data: { user } } = await supabaseClient.auth.getUser();
  const username = user?.user_metadata?.user_name || "anon";

  const text = messageInput.value.trim();
  if (!text) return;

  await fetch(MOCKAPI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, text })
  });

  messageInput.value = "";
  await loadMessages();
}

sendButton?.addEventListener("click", sendMessage);

// auto load pesan setiap 2 detik
if (messagesContainer) {
  loadMessages();
  setInterval(loadMessages, 2000);
}
