const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const imageInput = document.getElementById("image-input");

const openrouterKeyInput = document.getElementById("openrouter-key");
const huggingfaceKeyInput = document.getElementById("huggingface-key");

function addMessage(message, sender) {
const messageDiv = document.createElement("div");
messageDiv.classList.add("message", sender);
messageDiv.innerText = message;
chatBox.appendChild(messageDiv);
chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
const userMessage = userInput.value.trim();
const OPENROUTER_API_KEY = openrouterKeyInput.value.trim();

if (!OPENROUTER_API_KEY) {
alert("Please enter OpenRouter API key");
return;
}

if (!userMessage) return;

addMessage(userMessage, "user");
userInput.value = "";

const typing = document.createElement("div");
typing.classList.add("message", "bot");
typing.innerText = "AI is typing...";
chatBox.appendChild(typing);

try {
const response = await fetch(
"https://openrouter.ai/api/v1/chat/completions",
{
method: "POST",
headers: {
Authorization: `Bearer ${OPENROUTER_API_KEY}`,
"HTTP-Referer": "https://aischatbot.netlify.app",
"Content-Type": "application/json"
},
body: JSON.stringify({
model: "openai/gpt-3.5-turbo",
messages: [
{
role: "system",
content: `
You are AIS Chatbot created by Shanmukha Sai.
Be smart, concise and helpful.
`
},
{
role: "user",
content: userMessage
}
]
})
}
);

const data = await response.json();

typing.remove();

if (data.choices && data.choices.length > 0) {
const botReply = data.choices[0].message.content;
addMessage(botReply, "bot");
} else {
addMessage("Failed to fetch because of server issue", "bot");
}

} catch (error) {
typing.remove();
addMessage("Failed to fetch because of server issue", "bot");
}
}

sendBtn.addEventListener("click", sendMessage);

userInput.addEventListener("keypress", function (e) {
if (e.key === "Enter") {
sendMessage();
}
});

// Image generation
imageInput.addEventListener("change", async function () {

const HUGGINGFACE_API_KEY = huggingfaceKeyInput.value.trim();

if (!HUGGINGFACE_API_KEY) {
alert("Please enter HuggingFace API key");
return;
}

const file = imageInput.files[0];
if (!file) return;

addMessage("Generating image...", "bot");

try {
const response = await fetch(
"https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2",
{
method: "POST",
headers: {
Authorization: `Bearer ${HUGGINGFACE_API_KEY}`
},
body: file
}
);

const blob = await response.blob();
const imageUrl = URL.createObjectURL(blob);

const img = document.createElement("img");
img.src = imageUrl;
img.style.maxWidth = "250px";

const messageDiv = document.createElement("div");
messageDiv.classList.add("message", "bot");
messageDiv.appendChild(img);

chatBox.appendChild(messageDiv);
chatBox.scrollTop = chatBox.scrollHeight;

} catch (error) {
addMessage("Image generation failed", "bot");
}

});