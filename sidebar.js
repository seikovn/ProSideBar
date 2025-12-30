<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ProSidebar</title>
  <link rel="stylesheet" href="sidebar.css">
</head>
<body>
  <div class="header">
    <div class="title">✨ ProSider AI</div>
    <div class="actions">
      <button id="btn-settings" title="Cài đặt API Key">⚙️</button>
      <button id="btn-close" title="Thu nhỏ">✖</button>
    </div>
  </div>

  <div class="chat-area" id="chat-container">
    <div class="message ai">
      Chào cháu! Chú là trợ lý Google Gemini.<br>
      - Bôi đen văn bản để Dịch.<br>
      - Hoặc bấm nút <b>"Tóm tắt"</b> bên dưới để đọc nhanh cả bài!
    </div>
  </div>

  <div class="input-area">
    <div style="font-size: 12px; color: green; margin-bottom: 5px; font-weight: bold;">
      ✅ Đang dùng: Google Gemini (Miễn phí)
    </div>
    
    <textarea id="user-input" placeholder="Nhập câu hỏi hoặc yêu cầu..."></textarea>
    
    <div class="toolbar">
      <button id="btn-summarize" style="background-color: #9013fe; margin-right: auto;">📝 Tóm tắt</button>
      
      <button id="btn-send">Gửi ➢</button>
    </div>
  </div>

  <script src="sidebar.js"></script>
</body>
</html>
