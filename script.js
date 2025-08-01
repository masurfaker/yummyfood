document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("orderForm");
  const popup = document.getElementById("popup");
  const popupMessage = document.getElementById("popup-message");

  const kbjuTotal = document.getElementById("kbju-total");
  const telegramToken = "8472899454:AAGiebKRLt6VMei4toaiW11bR2tIACuSFeo";
  const telegramChatID = "7408180116";

  document.querySelectorAll(".dish").forEach(dish => {
    const select = dish.querySelector("select.qty");

    if (!select) return;

    select.innerHTML = "";
    for (let i = 0; i <= 5; i++) {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = i;
      select.appendChild(option);
    }
  });

  function calculateTotalKBJU() {
    let total = [0, 0, 0, 0];

    document.querySelectorAll(".dish").forEach(dish => {
      const qty = +dish.querySelector("select.qty").value;
      const kbjuText = dish.querySelector(".kbju-box")?.textContent;

      if (qty > 0 && kbjuText) {
        const match = kbjuText.match(/(\d+)\s*\/\s*(\d+)\s*\/\s*(\d+)\s*\/\s*(\d+)/);
        if (match) {
          const [_, k, b, j, u] = match.map(Number);
          total[0] += k * qty;
          total[1] += b * qty;
          total[2] += j * qty;
          total[3] += u * qty;
        }
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

    // Telegram
    await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: telegramChatID,
        text: message,
      }),
    });

    // Web3Forms
    await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: new FormData(form),
    });

    form.reset();
    kbjuTotal.value = "";
    popupMessage.textContent = "Спасибо! Заказ отправлен.";
    popup.style.display = "flex";
  });

  document.getElementById("popup-close").addEventListener("click", () => {
    popup.style.display = "none";
  });
});