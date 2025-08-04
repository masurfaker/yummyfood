const form = document.getElementById("orderForm");
const popup = document.getElementById("popup");
const popupMessage = document.getElementById("popup-message");

const telegramBotToken = "8472899454:AAGiebKRLt6VMei4toaiW11bR2tIACuSFeo";
const telegramChatId = "7408180116";
const web3formsKey = "14d92358-9b7a-4e16-b2a7-35e9ed71de43";

function closePopup() {
  popup.classList.add("hidden");
}

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = form.querySelector("input[name='name']").value.trim();
  const phone = form.querySelector("input[name='phone']").value.trim();
  if (!name || !phone) {
    alert("Пожалуйста, введите имя и телефон.");
    return;
  }

  const selectedDishes = Array.from(document.querySelectorAll(".dish"));
  const orderItems = [];
  let kbjuTotal = [0, 0, 0, 0]; // К/Б/Ж/У

  selectedDishes.forEach(dish => {
    const qty = parseInt(dish.querySelector("select.qty").value);
    if (qty > 0) {
      const title = dish.querySelector(".dish-name").textContent.trim();
      const kbjuString = dish.querySelector(".kbju").dataset.kbju;
      const [k, b, j, u] = kbjuString.split("/").map(Number);

      orderItems.push(`${title} — ${qty} шт.`);
      kbjuTotal[0] += k * qty;
      kbjuTotal[1] += b * qty;
      kbjuTotal[2] += j * qty;
      kbjuTotal[3] += u * qty;
    }
  });

  if (orderItems.length === 0) {
    alert("Пожалуйста, выберите хотя бы одно блюдо.");
    return;
  }

  const message = `
Новая заявка с сайта:
Имя: ${name}
Телефон: ${phone}
Заказ:
${orderItems.map((item, index) => `${index + 1}. ${item}`).join("\n")}
К/Б/Ж/У: ${kbjuTotal.join(" / ")}
  `;

  // Отправка в Telegram
  try {
    await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: telegramChatId,
        text: message,
      }),
    });
  } catch (error) {
    console.error("Ошибка при отправке в Telegram:", error);
  }

  // Отправка через Web3Forms
  try {
    await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: web3formsKey,
        name,
        phone,
        message,
      }),
    });
  } catch (error) {
    console.error("Ошибка при отправке на почту:", error);
  }

  // Генерация HTML для popup
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