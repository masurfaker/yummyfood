document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("orderForm");
  const popup = document.getElementById("popup");
  const popupMessage = document.getElementById("popup-message");
  const kbjuTotal = document.getElementById("kbju-total");

  const telegramToken = "8472899454:AAGiebKRLt6VMei4toaiW11bR2tIACuSFeo";
  const telegramChatID = "7408180116";

  function parseKBJU(text) {
    const match = text.match(/(\d+)\s*\/\s*(\d+)\s*\/\s*(\d+)\s*\/\s*(\d+)/);
    if (!match) return [0, 0, 0, 0];
    return match.slice(1).map(Number);
  }

  function calculateTotalKBJU() {
    let total = [0, 0, 0, 0];
    document.querySelectorAll(".dish").forEach(dish => {
      const qty = +dish.querySelector("select.qty").value;
      const kbjuBox = dish.querySelector(".kbju-box");
      if (qty > 0 && kbjuBox) {
        const values = parseKBJU(kbjuBox.textContent);
        total = total.map((val, i) => val + values[i] * qty);
      }
    });
    kbjuTotal.value = `К/Б/Ж/У: ${total[0]}/${total[1]}/${total[2]}/${total[3]}`;
  }

  document.querySelectorAll("select.qty").forEach(select => {
    select.addEventListener("change", calculateTotalKBJU);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    calculateTotalKBJU();

    const formData = new FormData(form);
    const name = formData.get("name") || "Имя не указано";
    const contact = formData.get("social") || "Контакт не указан";
    const comment = formData.get("comment") || "-";

    const selectedDishes = [];
    document.querySelectorAll(".dish").forEach(dish => {
      const dishName = dish.querySelector(".name").textContent.trim();
      const qty = +dish.querySelector("select.qty").value;
      if (qty > 0) {
        selectedDishes.push(`${dishName} x${qty}`);
      }
    });

    const kbju = kbjuTotal.value;

    const message = `
🍽️ Новый заказ:
👤 Имя: ${name}
📱 Контакт: ${contact}
🥗 Блюда:
${selectedDishes.join("\n")}
🧮 ${kbju}
💬 Комментарий: ${comment}
    `.trim();

    // Отправка в Telegram
    await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: telegramChatID,
        text: message,
      }),
    });

    // Отправка в Web3Forms
    const web3Data = new FormData(form);
    web3Data.append("access_key", "2c3c09c4-d450-4f5c-8183-6aef94cf3655");
    web3Data.append("КБЖУ", kbju);

    selectedDishes.forEach((dish, index) => {
      web3Data.append(`Блюдо ${index + 1}`, dish);
    });

    await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: web3Data,
    });

    form.reset();
    kbjuTotal.value = "";
    popupMessage.textContent = "Спасибо! Заявка принята.";
    popup.style.display = "flex";
  });

  document.getElementById("popup-close").addEventListener("click", () => {
    popup.style.display = "none";
  });
});