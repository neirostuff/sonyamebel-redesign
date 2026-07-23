// Interactive Logic for Сон-Я Website & Online Chat Widget
document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const chatTrigger = document.getElementById('chatTrigger');
  const chatWindow = document.getElementById('chatWindow');
  const chatClose = document.getElementById('chatClose');
  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const chatSendBtn = document.getElementById('chatSendBtn');

  const pitchModal = document.getElementById('pitchModal');
  const pitchClose = document.getElementById('pitchClose');
  const openPitchBtn = document.getElementById('openPitchBtn');

  // State for calculation quiz inside chat
  let quizData = {
    product: 'Интерьерная кровать',
    size: '160x200 см',
    fabric: 'Премиум Велюр',
    mechanism: 'С подъемным механизмом'
  };

  // Toggle Chat Window
  function toggleChat(forceOpen = null) {
    const shouldOpen = forceOpen !== null ? forceOpen : !chatWindow.classList.contains('active');
    if (shouldOpen) {
      chatWindow.classList.add('active');
      const tooltip = document.querySelector('.chat-trigger-tooltip');
      if (tooltip) tooltip.style.display = 'none';
      chatInput.focus();
    } else {
      chatWindow.classList.remove('active');
    }
  }

  if (chatTrigger) chatTrigger.addEventListener('click', () => toggleChat());
  if (chatClose) chatClose.addEventListener('click', () => toggleChat(false));

  // Toggle Pitch Commercial Proposal Modal for Vasily
  if (openPitchBtn) {
    openPitchBtn.addEventListener('click', () => pitchModal.classList.add('active'));
  }
  if (pitchClose) {
    pitchClose.addEventListener('click', () => pitchModal.classList.remove('active'));
  }
  if (pitchModal) {
    pitchModal.addEventListener('click', (e) => {
      if (e.target === pitchModal) pitchModal.classList.remove('active');
    });
  }

  // Get current time string
  function getTimeStr() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Append Message to Chat
  function appendMessage(text, sender = 'bot', optionsHtml = '') {
    const msgRow = document.createElement('div');
    msgRow.className = `msg-row ${sender}`;
    
    let content = `
      <div class="msg-bubble">
        <div>${text}</div>
        ${optionsHtml}
        <div class="msg-time">${getTimeStr()}</div>
      </div>
    `;

    msgRow.innerHTML = content;
    chatMessages.appendChild(msgRow);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Initial welcome auto-messages if chat is empty
  setTimeout(() => {
    if (chatMessages.children.length === 0) {
      appendMessage(
        'Здравствуйте! 👋 Я консультант фабрики интерьерной мебели **«Сон-Я»** (г. Новосибирск).',
        'bot'
      );
      setTimeout(() => {
        appendMessage(
          'Хотите за 30 секунд рассчитать стоимость кровати или матраса по вашим размерам с доставкой?',
          'bot',
          `
            <div class="quick-chips-container">
              <button class="chip-btn" onclick="window.startQuiz('bed')">🛏️ Кровать по размерам</button>
              <button class="chip-btn" onclick="window.startQuiz('mattress')">💤 Подобрать матрас</button>
              <button class="chip-btn" onclick="window.startQuiz('panels')">🖼️ Стеновые панели</button>
              <button class="chip-btn" onclick="window.showShowrooms()">📍 Шоурумы в Новосибирске</button>
            </div>
          `
        );
      }, 600);
    }
  }, 300);

  // Global handlers for quick chips inside chat
  window.startQuiz = function(type) {
    if (type === 'bed') {
      quizData.product = 'Интерьерная кровать';
      appendMessage('Вы выбрали: 🛏️ **Интерьерная кровать**', 'user');
      setTimeout(() => {
        appendMessage(
          'Отлично! Выберите желаемый спальный размер кровати:',
          'bot',
          `
            <div class="quiz-card-inline">
              <h5>Шаг 1 из 3: Размер спального места</h5>
              <div class="quiz-options-grid">
                <button class="quiz-opt-btn" onclick="window.selectSize('140x200 см')">140 × 200 см</button>
                <button class="quiz-opt-btn selected" onclick="window.selectSize('160x200 см')">160 × 200 см</button>
                <button class="quiz-opt-btn" onclick="window.selectSize('180x200 см')">180 × 200 см</button>
                <button class="quiz-opt-btn" onclick="window.selectSize('Свой размер')">Свой размер</button>
              </div>
            </div>
          `
        );
      }, 500);
    } else if (type === 'mattress') {
      quizData.product = 'Ортопедический матрас';
      appendMessage('Вы выбрали: 💤 **Ортопедический матрас**', 'user');
      setTimeout(() => {
        appendMessage(
          'Какая жесткость матраса вам предпочтительна?',
          'bot',
          `
            <div class="quick-chips-container">
              <button class="chip-btn" onclick="window.selectFabric('Средняя жесткость (Универсал)')">Средняя жесткость</button>
              <button class="chip-btn" onclick="window.selectFabric('Жесткий (С кокосом)')">Жесткий</button>
              <button class="chip-btn" onclick="window.selectFabric('Мягкий (Анатомический)')">Мягкий</button>
            </div>
          `
        );
      }, 500);
    } else if (type === 'panels') {
      quizData.product = 'Мягкие стеновые панели';
      appendMessage('Вы выбрали: 🖼️ **Стеновые панели**', 'user');
      setTimeout(() => {
        appendMessage('Стеновые панели изготавливаются по вашим размерам (любая геометрия и вертикальная/квадратная утяжка). Желаете рассчитать замер?', 'bot', `
          <div class="quick-chips-container">
            <button class="chip-btn" onclick="window.selectSize('Панели в спальню')">Панели в спальню</button>
            <button class="chip-btn" onclick="window.selectSize('Панели в прихожую')">Панели в прихожую</button>
          </div>
        `);
      }, 500);
    }
  };

  window.selectSize = function(size) {
    quizData.size = size;
    appendMessage(`Размер: **${size}**`, 'user');
    setTimeout(() => {
      appendMessage(
        'Какую обивку рассматриваете?',
        'bot',
        `
          <div class="quiz-card-inline">
            <h5>Шаг 2 из 3: Ткань и цвет обивки</h5>
            <div class="quiz-options-grid">
              <button class="quiz-opt-btn" onclick="window.selectFabric('Бархатистый Велюр')">Бархатистый Велюр</button>
              <button class="quiz-opt-btn" onclick="window.selectFabric('Трендовый Букле')">Трендовый Букле</button>
              <button class="quiz-opt-btn" onclick="window.selectFabric('Премиум Экокожа')">Премиум Экокожа</button>
              <button class="quiz-opt-btn" onclick="window.selectFabric('Рогожка / Замша')">Рогожка / Замша</button>
            </div>
          </div>
        `
      );
    }, 500);
  };

  window.selectFabric = function(fabric) {
    quizData.fabric = fabric;
    appendMessage(`Обивка: **${fabric}**`, 'user');
    setTimeout(() => {
      appendMessage(
        'Требуется ли вам подъемный механизм с ящиком для белья?',
        'bot',
        `
          <div class="quick-chips-container">
            <button class="chip-btn" onclick="window.finishCalculation('С подъемным механизмом + бельевой ящик')">Да, с подъемным механизмом</button>
            <button class="chip-btn" onclick="window.finishCalculation('Без подъемного механизма (ортопедическое основание)')">Нет, стандартное основание</button>
          </div>
        `
      );
    }, 500);
  };

  window.finishCalculation = function(mechanism) {
    quizData.mechanism = mechanism;
    appendMessage(`Опция: **${mechanism}**`, 'user');

    // Calculate dynamic price estimation
    let priceBase = 32000;
    if (quizData.size.includes('180')) priceBase += 6000;
    if (mechanism.includes('подъемным')) priceBase += 7500;

    const formattedPrice = priceBase.toLocaleString('ru-RU');

    setTimeout(() => {
      appendMessage(
        `🎉 **Ориентировочный расчет готов!**<br><br>` +
        `• Изделие: **${quizData.product}**<br>` +
        `• Размер: **${quizData.size}**<br>` +
        `• Обивка: **${quizData.fabric}**<br>` +
        `• Комплектация: **${mechanism}**<br><br>` +
        `💰 Стоимость: **от ${formattedPrice} ₽** *(с учетом персональной скидки -10%)*`,
        'bot',
        `
          <div class="crm-lead-card" id="crmCard">
            <h5>Зафиксировать цену и получить видеокаталог тканей</h5>
            <p>Введите ваш номер телефона (WhatsApp/Telegram). Менеджер «Сон-Я» отправит варианты тканей и закрепит скидку.</p>
            <div class="crm-input-group">
              <input type="text" id="leadName" class="crm-input" placeholder="Ваше имя">
              <input type="tel" id="leadPhone" class="crm-input" placeholder="+7 (9XX) XXX-XX-XX">
              <button class="btn-crm-submit" onclick="window.submitCrmLead()">Получить 3D-проект и спеццену</button>
            </div>
          </div>
        `
      );
    }, 600);
  };

  // Submit Lead & Simulate CRM Fixation (Bitrix24/AmoCRM)
  window.submitCrmLead = function() {
    const nameInput = document.getElementById('leadName');
    const phoneInput = document.getElementById('leadPhone');
    const name = nameInput ? nameInput.value.trim() : 'Клиент';
    const phone = phoneInput ? phoneInput.value.trim() : '';

    if (!phone || phone.length < 7) {
      alert('Пожалуйста, укажите контактный номер телефона.');
      return;
    }

    const crmCard = document.getElementById('crmCard');
    if (crmCard) {
      crmCard.innerHTML = `
        <div style="text-align: center; padding: 10px;">
          <div style="font-size: 32px; margin-bottom: 8px;">✅</div>
          <h5 style="color: #065F46; font-size: 15px; margin-bottom: 4px;">Заявка #1084 передана в CRM!</h5>
          <p style="color: #047857; font-size: 13px;">Спасибо, ${name}! Менеджер «Сон-Я» свяжется с вами в течение 3-5 минут в WhatsApp по номеру <strong>${phone}</strong>.</p>
          <div style="background: rgba(16, 185, 129, 0.15); padding: 8px; border-radius: 8px; font-size: 11px; color: #047857; font-weight: 600; margin-top: 8px;">
            ⚡ Статус в CRM Bitrix24: НОВЫЙ ЛИД • Новосибирск
          </div>
        </div>
      `;
    }
  };

  window.showShowrooms = function() {
    appendMessage('Показать адреса шоурумов в Новосибирске', 'user');
    setTimeout(() => {
      appendMessage(
        `📍 **Наши шоурумы в Новосибирске:**<br><br>` +
        `1. **ТВК «Калейдомор»**: ул. Светлановская, 50 (0 и 2 этаж)<br>` +
        `2. **ТЦ «Калейдоскоп»**: ул. Сибиряков-Гвардейцев, 49/1 к2<br>` +
        `3. **ТЦ «Река»**: ул. Большевистская, 131 к2 (1 этаж)<br>` +
        `4. **Фабричный цех**: ул. Королёва, 40 к128<br><br>` +
        `⏰ Режим работы: ежедневно с 10:00 до 20:00. Ждем вас на тест-драйв матрасов и выбор тканей!`,
        'bot'
      );
    }, 500);
  };

  // Custom User Input Handler
  function handleUserSubmit() {
    const text = chatInput.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    chatInput.value = '';

    const lower = text.toLowerCase();
    setTimeout(() => {
      if (lower.includes('цена') || lower.includes('стоим') || lower.includes('сколько')) {
        appendMessage('Стоимость зависит от размера и выбранной категории ткани. Нажмите кнопку ниже, чтобы за 30 секунд рассчитать цену под ваше спальное место:', 'bot', `
          <div class="quick-chips-container">
            <button class="chip-btn" onclick="window.startQuiz('bed')">🛏️ Рассчитать кровать</button>
          </div>
        `);
      } else if (lower.includes('адрес') || lower.includes('где') || lower.includes('новосибирск') || lower.includes('шоурум')) {
        window.showShowrooms();
      } else if (lower.includes('доставк') || lower.includes('сборк')) {
        appendMessage('🚚 **Доставка и сборка:**<br>Доставляем по Новосибирску и Новосибирской области собственной службой доставки. Возможен подъем на этаж и профессиональная сборка в день доставки!', 'bot');
      } else if (lower.includes('матрас')) {
        window.startQuiz('mattress');
      } else {
        appendMessage(`Спасибо за ваш вопрос! Я передал(а) информацию старшему менеджеру. Хотите получить бесплатную консультацию дизайнеров «Сон-Я»?`, 'bot', `
          <div class="quick-chips-container">
            <button class="chip-btn" onclick="window.startQuiz('bed')">🛏️ Рассчитать стоимость</button>
            <button class="chip-btn" onclick="window.showShowrooms()">📍 Найти близжайший салон</button>
          </div>
        `);
      }
    }, 700);
  }

  if (chatSendBtn) chatSendBtn.addEventListener('click', handleUserSubmit);
  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleUserSubmit();
    });
  }

  // Open chat automatically from Hero CTA
  const heroChatBtn = document.getElementById('heroChatBtn');
  if (heroChatBtn) {
    heroChatBtn.addEventListener('click', () => {
      toggleChat(true);
      window.startQuiz('bed');
    });
  }
});
