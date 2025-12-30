//sidebar.js
const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const btnSend = document.getElementById('btn-send');
const btnClose = document.getElementById('btn-close');
const btnSettings = document.getElementById('btn-settings');
const modelSelect = document.getElementById('model-select');

// Danh sách các tên Robot để thử lần lượt (Nếu con này lỗi thì gọi con kia)
const GOOGLE_MODELS_TO_TRY = [
  "gemini-1.5-flash",
  "gemini-1.5-flash-latest",
  "gemini-1.5-pro",
  "gemini-pro",
  "gemini-1.0-pro"
];

// Thêm tin nhắn vào khung chat
function addMessage(text, sender) {
  const div = document.createElement('div');
  div.className = `message ${sender}`;
  // Chuyển đổi xuống dòng thành <br>
  div.innerHTML = text.replace(/\n/g, '<br>');
  chatContainer.appendChild(div);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Hàm gọi Google (thử nhiều model)
async function callGoogleGemini(prompt, apiKey) {
  let lastError = null;

  // Thử từng model trong danh sách
  for (const modelName of GOOGLE_MODELS_TO_TRY) {
    try {
      console.log("Đang thử model:", modelName);
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });

      const json = await res.json();

      // Nếu có lỗi từ Google, ném lỗi để vòng lặp bắt được và thử model tiếp theo
      if (json.error) {
        throw new Error(json.error.message);
      }

      // Nếu thành công -> Trả về kết quả ngay
      return json.candidates?.[0]?.content?.parts?.[0]?.text;

    } catch (err) {
      console.warn(`Model ${modelName} bị lỗi:`, err.message);
      lastError = err.message;
      // Tiếp tục vòng lặp để thử model tiếp theo...
    }
  }

  // Nếu thử hết danh sách mà vẫn lỗi
  throw new Error("Tất cả các model đều bận hoặc lỗi: " + lastError);
}

// Hàm gọi OpenAI
async function callOpenAI(prompt, apiKey) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }]
    })
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error.message);
  return json.choices?.[0]?.message?.content;
}

// Hàm xử lý chính
async function callAI(prompt) {
  addMessage("Đang suy nghĩ... (Chờ chút nhé)", 'ai');
  const loadingMsg = chatContainer.lastElementChild;
  
  const data = await chrome.storage.local.get('apiKeys');
  const keys = data.apiKeys || {};
  
  const modelType = modelSelect.value;
  const googleKey = (keys.google || '').trim();
  const openaiKey = (keys.openai || '').trim();

  let responseText = "";

  try {
    if (modelType === 'gemini') {
      if (!googleKey) throw new Error("Cháu chưa nhập Google API Key trong Cài đặt.");
      responseText = await callGoogleGemini(prompt, googleKey);
    } 
    else if (modelType === 'openai') {
      if (!openaiKey) throw new Error("Cháu chưa nhập OpenAI API Key.");
      responseText = await callOpenAI(prompt, openaiKey);
    }
  } catch (err) {
    responseText = "⚠️ Lỗi: " + err.message;
  }

  // Cập nhật kết quả
  if (!responseText) responseText = "AI không trả lời (Lỗi kết nối).";
  loadingMsg.innerHTML = responseText.replace(/\n/g, '<br>');
}

// Xử lý nút Gửi
btnSend.addEventListener('click', () => {
  const text = userInput.value.trim();
  if (!text) return;
  addMessage(text, 'user');
  userInput.value = '';
  callAI(text);
});

// Xử lý nút Đóng
btnClose.addEventListener('click', () => {
  window.parent.postMessage({ type: 'CLOSE_SIDEBAR' }, '*');
});

// Xử lý nút Cài đặt
btnSettings.addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'openOptions' });
});

// Nhận tin nhắn từ Menu bôi đen
window.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'AUTO_PROMPT') {
    const prompt = event.data.text;
    addMessage(prompt, 'user');
    callAI(prompt);
  }
});
