<script>
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("orderForm");
  const popup = document.getElementById("popup");
  const popupMessage = document.getElementById("popup-message");

  const telegramToken = "8472899454:AAGiebKRLt6VMei4toaiW11bR2tIACuSFeo";
  const telegramChatID = "7408180116";
  const web3formsAccessKey = "2c3c09c4-d450-4f5c-8183-6aef94cf3655";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

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

    if (selectedDishes.length === 0) {
      popupMessage.textContent = "Выберите хотя бы одно блюдо.";
      popup.style.display = "flex";
      return;
    }

    const message = `
🍽️ Новый заказ:
👤 Имя: ${name}
📱 Контакт: ${contact}
🥗 Блюда:
${selectedDishes.join("\n")}
💬 Комментарий: ${comment}
    `.trim();

    try {
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
      const web3Data = new FormData(form);
      web3Data.append("access_key", web3formsAccessKey);
      web3Data.append("Состав заказа", selectedDishes.join(", "));

      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: web3Data,
      });

      form.reset();
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