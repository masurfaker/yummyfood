const form = document.getElementById("orderForm");
const nameInput = document.getElementById("name");
const contactInput = document.getElementById("contact");
const contactMethodSelect = document.getElementById("contactMethod");
const commentInput = document.getElementById("comment");
const popup = document.getElementById("popup");
const popupMessage = document.getElementById("popup-message");

// Заполнение селекторов от 0 до 6
document.querySelectorAll("select.qty").forEach(select => {
  for (let i = 0; i <= 6; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    select.appendChild(option);
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const contact = contactInput.value.trim();
  const contactMethod = contactMethodSelect.value;
  const comment = commentInput.value.trim();

  if (!name || !contact) {
    alert("Пожалуйста, заполните имя и контактные данные.");
    return;
  }

  let orderList = "";
  let totalCalories = 0, totalProteins = 0, totalFats = 0, totalCarbs = 0;

  document.querySelectorAll(".dish").forEach(dish => {
    const qty = parseInt(dish.querySelector(".qty").value);
    if (qty > 0) {
      const dishName = dish.querySelector(".dish-name").textContent.trim();
      const [k, b, j, u] = dish.querySelector(".kbju").dataset.kbju.split("/").map(Number);

      totalCalories += k * qty;
      totalProteins += b * qty;
      totalFats += j * qty;
      totalCarbs += u * qty;

      orderList += `• ${dishName} — ${qty} шт\n`;
    }
  });

  if (!orderList) {
    alert("Вы не выбрали ни одного блюда.");
    return;
  }

  const kbju = `Калорий: ${totalCalories}\nБелки: ${totalProteins} г\nЖиры: ${totalFats} г\nУглеводы: ${totalCarbs} г`;
  const fullMessage = `Новый заказ:\n\nИмя: ${name}\nКонтакт: ${contact} (${contactMethod})\n\nЗаказ:\n${orderList}\n${kbju}\n\nКомментарий: ${comment}`;

  // Показываем попап сразу
  popupMessage.innerText = `Спасибо! Ваш заказ отправлен.\n\n${orderList}\n${kbju}`;
  popup.classList.remove("hidden");

  // Асинхронная отправка в Telegram и Web3Forms
  (async () => {
    try {
      await fetch("https://api.telegram.org/bot8472899454:AAGiebKRLt6VMei4toaiW11bR2tIACuSFeo/sendMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: "7408180116",
          text: fullMessage
        }),
      });
    } catch (error) {
      console.error("Ошибка отправки в Telegram:", error);
    }

    try {
      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "14d92358-9b7a-4e16-b2a7-35e9ed71de43",
          name: name,
          contact: contact,
          message: fullMessage
        }),
      });
    } catch (error) {
      console.error("Ошибка отправки в Web3Forms:", error);
    }
  })();
});