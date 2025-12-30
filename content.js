//content.js
(function() {
  // Tránh chạy 2 lần
  if (window.hasProSiderLoaded) return;
  window.hasProSiderLoaded = true;

  let sidebarIframe = null;
  let toggleButton = null;
  let textMenu = null;

  // 1. Tạo khung Sidebar
  function createSidebar() {
    sidebarIframe = document.createElement('iframe');
    // Lấy đường dẫn file sidebar.html
    const sidebarURL = chrome.runtime.getURL('sidebar.html');
    console.log("ProSider: URL Sidebar là", sidebarURL); // Để kiểm tra lỗi

    sidebarIframe.src = sidebarURL;
    sidebarIframe.style.cssText = `
      position: fixed; top: 0; right: 0; width: 400px; height: 100vh;
      border: none; border-left: 1px solid #ccc;
      z-index: 2147483647; background: #fff;
      box-shadow: -5px 0 15px rgba(0,0,0,0.1);
      transition: transform 0.3s ease;
      transform: translateX(100%); /* Mặc định ẩn sang phải */
    `;
    document.body.appendChild(sidebarIframe);
  }

  // 2. Tạo nút Robot
  function createToggleButton() {
    toggleButton = document.createElement('div');
    toggleButton.innerHTML = '🤖'; 
    toggleButton.title = "Mở ProSider AI";
    toggleButton.style.cssText = `
      position: fixed; bottom: 30px; right: 30px; 
      width: 60px; height: 60px;
      background: linear-gradient(135deg, #4a90e2, #9013fe); 
      color: white; border-radius: 50%; 
      display: flex; align-items: center; justify-content: center;
      font-size: 30px; cursor: pointer; z-index: 2147483647;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      transition: transform 0.2s;
    `;
    
    // Khi bấm vào Robot -> Mở Sidebar
    toggleButton.onclick = () => {
      console.log("ProSider: Đã bấm nút Robot");
      toggleSidebar(true);
    };
    
    document.body.appendChild(toggleButton);
  }

  // 3. Hàm Đóng/Mở
  function toggleSidebar(show) {
    if (!sidebarIframe || !toggleButton) return;

    if (show) {
      console.log("ProSider: Đang mở Sidebar...");
      sidebarIframe.style.transform = 'translateX(0)'; // Trượt ra
      toggleButton.style.display = 'none'; // Giấu Robot đi
    } else {
      console.log("ProSider: Đang đóng Sidebar...");
      sidebarIframe.style.transform = 'translateX(100%)'; // Trượt vào
      toggleButton.style.display = 'flex'; // Hiện Robot lại
    }
  }

  // 4. Gửi tin nhắn cho Sidebar
  function sendToSidebar(promptText) {
    console.log("ProSider: Đang gửi lệnh:", promptText);
    toggleSidebar(true); // Mở lên trước
    
    // Đợi 0.5 giây để iframe kịp hiện rồi mới gửi tin
    setTimeout(() => {
      sidebarIframe.contentWindow.postMessage({ type: 'AUTO_PROMPT', text: promptText }, '*');
    }, 500);
  }

  // 5. Xử lý bôi đen văn bản
  function handleTextSelection(event) {
    const selection = window.getSelection();
    const text = selection.toString().trim();

    if (textMenu) {
      textMenu.remove();
      textMenu = null;
    }

    if (text.length > 0) {
      textMenu = document.createElement('div');
      textMenu.style.cssText = `
        position: absolute; left: ${event.pageX + 5}px; top: ${event.pageY + 10}px;
        background: #222; color: #fff; padding: 6px; border-radius: 6px;
        z-index: 2147483648; display: flex; gap: 8px; 
        font-family: sans-serif; font-size: 13px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      `;

      // Nút Dịch
      const btnTranslate = document.createElement('button');
      btnTranslate.innerText = 'Dịch 🇻🇳';
      btnTranslate.style.cssText = 'background:#4a90e2; border:none; color:white; border-radius:4px; padding:4px 8px; cursor:pointer;';
      btnTranslate.onclick = (e) => {
        e.stopPropagation(); // Ngăn lỗi click
        sendToSidebar('Dịch đoạn này sang tiếng Việt: ' + text);
        textMenu.remove();
      };
      
      // Nút Giải thích
      const btnExplain = document.createElement('button');
      btnExplain.innerText = 'Giải thích 🧠';
      btnExplain.style.cssText = 'background:#f5a623; border:none; color:white; border-radius:4px; padding:4px 8px; cursor:pointer;';
      btnExplain.onclick = (e) => {
        e.stopPropagation();
        sendToSidebar('Giải thích đoạn này dễ hiểu cho học sinh lớp 7: ' + text);
        textMenu.remove();
      };

      textMenu.appendChild(btnTranslate);
      textMenu.appendChild(btnExplain);
      document.body.appendChild(textMenu);
    }
  }

  // Khởi động
  createSidebar();
  createToggleButton(); // Tạo nút Robot ngay lập tức

  // Lắng nghe chuột để hiện menu
  document.addEventListener('mouseup', handleTextSelection);
  document.addEventListener('mousedown', (e) => {
    if (textMenu && !textMenu.contains(e.target)) {
      textMenu.remove();
      textMenu = null;
    }
  });

  // Lắng nghe lệnh đóng từ bên trong Sidebar
  window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'CLOSE_SIDEBAR') {
      toggleSidebar(false);
    }
  });

})();
