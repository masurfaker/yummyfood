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
    alert("Пожалуйста, заполните имя и телефон.");
    return;
  }

  const dishes = document.querySelectorAll(".dish");
  const orderItems = [];
  const kbjuTotal = [0, 0, 0, 0]; // К / Б / Ж / У

  dishes.forEach(dish => {
    const qty = parseInt(dish.querySelector("select.qty").value);
    if (qty > 0) {
      const title = dish.querySelector(".dish-name").textContent.trim();
      const kbjuStr = dish.querySelector(".kbju").dataset.kbju;
      const [k, b, j, u] = kbjuStr.split("/").map(x => parseFloat(x));

      kbjuTotal[0] += k * qty;
      kbjuTotal[1] += b * qty;
      kbjuTotal[2] += j * qty;
      kbjuTotal[3] += u * qty;

      orderItems.push(`${title} — ${qty} шт.`);
    }
  });

  if (orderItems.length === 0) {
    alert("Вы не выбрали ни одного блюда.");
    return;
  }

  const message = `🍽️ Новый заказ YUMMY
👤 Имя: ${name}
📞 Телефон: ${phone}

📋 Заказ:
${orderItems.map((x, i) => `${i + 1}. ${x}`).join("\n")}

К/Б/Ж/У: ${kbjuTotal.map(x => Math.round(x)).join(" / ")}`;

  const telegramData = {
    chat_id: "7408180116",
    text: message,
  };

  fetch(`https://api.telegram.org/bot8472899454:AAGiebKRLt6VMei4toaiW11bR2tIACuSFeo/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(telegramData),
  });

  const formData = new FormData();
  formData.append("access_key", "14d92358-9b7a-4e16-b2a7-35e9ed71de43");
  formData.append("Имя", name);
  formData.append("Телефон", phone);
  formData.append("Заказ", orderItems.join("\n"));
  formData.append("КБЖУ", kbjuTotal.map(x => Math.round(x)).join(" / "));

  fetch("https://api.web3forms.com/submit", {
    method: "POST",
    body: formData,
  });

  // ПОКАЗЫВАЕМ ПОПАП СРАЗУ (без задержек)
  const orderHTML = `
    <ul style="padding-left: 20px; margin: 0;">
      ${orderItems.map(item => `<li>${item}</li>`).join("")}
    </ul>
    <div style="margin-top: 10px;">К/Б/Ж/У: ${kbjuTotal.map(x => Math.round(x)).join(" / ")}</div>
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

  form.reset();
});