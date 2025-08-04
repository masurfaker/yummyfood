const form = document.getElementById("orderForm");
const popup = document.getElementById("popup");
const popupMessage = document.getElementById("popup-message");

// Автозаполнение селекторов с 0 до 6
document.querySelectorAll("select.qty").forEach(select => {
  for (let i = 0; i <= 6; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    select.appendChild(option);
  }
});

function closePopup() {
  popup.classList.add("hidden");
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = form.name.value.trim();
  const phone = form.phone.value.trim();
  if (!name || !phone) {
    alert("Пожалуйста, введите имя и телефон.");
    return;
  }

  const selected = Array.from(document.querySelectorAll(".dish"))
    .map(dish => {
      const qty = parseInt(dish.querySelector(".qty").value);
      const name = dish.querySelector(".dish-name").textContent.trim();
      const kbju = dish.querySelector(".kbju").dataset.kbju.trim();
      return { name, qty, kbju };
    })
    .filter(item => item.qty > 0);

  if (selected.length === 0) {
    alert("Выберите хотя бы одно блюдо.");
    return;
  }

  const orderItems = selected.map(item => `${item.name} — ${item.qty} шт.`);
  const kbjuTotal = [0, 0, 0, 0];

  selected.forEach(item => {
    const [k, b, j, u] = item.kbju.split("/").map(Number);
    kbjuTotal[0] += k * item.qty;
    kbjuTotal[1] += b * item.qty;
    kbjuTotal[2] += j * item.qty;
    kbjuTotal[3] += u * item.qty;
  });

  // Показываем попап сразу
  const orderHTML = `
    <ul style="padding-left: 20px; margin: 0;">
      ${orderItems.map(item => `<li>${item}</li>`).join("")}
    </ul>
    <div style="margin-top: 10px;">К/Б/Ж/У: ${kbjuTotal.join(" / ")}</div>
  `;

  popupMessage.innerHTML = `
    <div style="font-family:Arial;font-size:16px;">
      <div><b>${name}</b>!</div>
      <div style="margin-top:6px;">Ваша заявка отправлена!</div>
      <div style="margin:14px 0 6px;">Ваш заказ:</div>
      ${orderHTML}
      <div style="margin-top:16px;">В ближайшее время с вами свяжутся.<br>Благодарим, что выбрали YUMMY!</div>
      <button id="close-popup" style="margin-top:14px;">Закрыть</button>
    </div>
  `;
  popup.classList.remove("hidden");
  document.getElementById("close-popup").addEventListener("click", closePopup);

  // Отправка в Telegram
  const telegramToken = "8472899454:AAGiebKRLt6VMei4toaiW11bR2tIACuSFeo";
  const telegramChatId = "7408180116";
  const telegramMessage = `
<b>Имя:</b> ${name}
<b>Телефон:</b> ${phone}
<b>Заказ:</b>
${orderItems.map((item, i) => `${i + 1}. ${item}`).join("\n")}
<b>К/Б/Ж/У:</b> ${kbjuTotal.join(" / ")}
  `;

  fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: telegramChatId,
      text: telegramMessage,
      parse_mode: "HTML"
    }),
  }).catch(console.error);

  // Отправка в Web3Forms
  const formData = new FormData();
  formData.append("access_key", "14d92358-9b7a-4e16-b2a7-35e9ed71de43");
  formData.append("Имя", name);
  formData.append("Телефон", phone);
  selected.forEach((item, i) => {
    formData.append(`Блюдо ${i + 1}`, `${item.name} — ${item.qty} шт.`);
  });
  formData.append("КБЖУ", kbjuTotal.join(" / "));

  fetch("https://api.web3forms.com/submit", {
    method: "POST",
    body: formData,
  }).catch(console.error);
});