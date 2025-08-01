<script>
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("orderForm");
  const popup = document.getElementById("popup");
  const popupMessage = document.getElementById("popup-message");
  const kbjuBox = document.getElementById("kbju-total-box");

  const telegramToken = "8472899454:AAGiebKRLt6VMei4toaiW11bR2tIACuSFeo";
  const telegramChatID = "7408180116";
  const web3formsAccessKey = "2c3c09c4-d450-4f5c-8183-6aef94cf3655";

  function parseKBJU(text) {
    const match = text.match(/(\d+)\s*\/\s*(\d+)\s*\/\s*(\d+)\s*\/\s*(\d+)/);
    if (!match) return [0, 0, 0, 0];
    return match.slice(1).map(Number);
  }

  function calculateTotalKBJU() {
    let total = [0, 0, 0, 0];

    document.querySelectorAll(".dish").forEach(dish => {
      const qty = +dish.querySelector("select.qty").value;
      const kbjuDiv = dish.querySelector(".kbju-box");
      if (qty > 0 && kbjuDiv) {
        const values = parseKBJU(kbjuDiv.textContent);
        total = total.map((val, i) => val + values[i] * qty);
      }
    });

    const resultText = `К/Б/Ж/У: ${total[0]}/${total[1]}/${total[2]}/${total[3]}`;
    if (kbjuBox) kbjuBox.textContent = resultText;
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
      const dishName = dish.querySelector(".dish-name").textContent.trim();
      const qty = +dish.querySelector("select.qty").value;
      if (qty > 0) {
        selectedDishes.push(`${dishName} x${qty}`);
      }
    });

    const kbju = kbjuBox ? kbjuBox.textContent : "К/Б/Ж/У: 0/0/0/0";

    const message = `
🍽️ Новый заказ:
👤 Имя: ${name}
📱 Контакт: ${contact}
🥗 Блюда:
${selectedDishes.join("\n")}
🧮 ${kbju}
💬 Комментарий: ${comment}
    `.trim();

    try {
      await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: telegramChatID,
          text: message,
        }),
      });

      const web3Data = new FormData(form);
      web3Data.append("access_key", web3formsAccessKey);
      web3Data.append("КБЖУ", kbju);
      selectedDishes.forEach((dish, i) => {
        web3Data.append(`Блюдо ${i + 1}`, dish);
      });

      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: web3Data,
      });

      form.reset();
      if (kbjuBox) kbjuBox.textContent = "";
      popupMessage.textContent = "Спасибо! Заявка принята.";
      popup.style.display = "flex";

    } catch (error) {
      popupMessage.textContent = "Ошибка при отправке. Попробуйте снова.";
      popup.style.display = "flex";
    }
  });

  document.getElementById("popup-close").addEventListener("click", () => {
    popup.style.display = "none";
  });
});
</script>