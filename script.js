const form = document.getElementById("orderForm");
const popup = document.getElementById("popup");
const popupMessage = document.getElementById("popup-message");

function closePopup() {
  popup.classList.add("hidden");
}

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = form.elements["name"].value.trim();
  const phone = form.elements["phone"].value.trim();

  if (!name || !phone) {
    alert("Пожалуйста, введите имя и телефон.");
    return;
  }

  const selectedDishes = document.querySelectorAll(".dish");
  const orderItems = [];
  let totalK = 0, totalB = 0, totalJ = 0, totalU = 0;

  selectedDishes.forEach((dish) => {
    const qty = parseInt(dish.querySelector(".qty").value);
    if (qty > 0) {
      const name = dish.querySelector(".dish-name").textContent.trim();
      const kbjuRaw = dish.querySelector(".kbju").dataset.kbju.split("/").map(x => parseFloat(x));

      totalK += kbjuRaw[0] * qty;
      totalB += kbjuRaw[1] * qty;
      totalJ += kbjuRaw[2] * qty;
      totalU += kbjuRaw[3] * qty;

      orderItems.push(`${name} — ${qty} шт.`);
    }
  });

  if (orderItems.length === 0) {
    alert("Пожалуйста, выберите хотя бы одно блюдо.");
    return;
  }

  const kbjuTotal = [
    Math.round(totalK),
    Math.round(totalB),
    Math.round(totalJ),
    Math.round(totalU),
  ];

  // Отправка в Web3Forms
  const formData = new FormData();
  formData.append("access_key", "14d92358-9b7a-4e16-b2a7-35e9ed71de43");
  formData.append("name", name);
  formData.append("phone", phone);
  formData.append("order", orderItems.join("\n"));
  formData.append("kbju", kbjuTotal.join(" / "));

  try {
    await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });
  } catch (error) {
    alert("Ошибка при отправке на почту.");
  }

  // Отправка в Telegram
  const token = "8472899454:AAGiebKRLt6VMei4toaiW11bR2tIACuSFeo";
  const chat_id = "7408180116";
  const message = `
<b>Новая заявка YUMMY</b>
👤 Имя: ${name}
📞 Телефон: ${phone}

🧾 Заказ:
${orderItems.map((item, i) => `${i + 1}. ${item}`).join("\n")}

К/Б/Ж/У: ${kbjuTotal.join(" / ")}
`;

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id,
        text: message,
        parse_mode: "HTML"
      })
    });
  } catch (error) {
    alert("Ошибка при отправке в Telegram.");
  }

  // Генерируем HTML для popup
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
});