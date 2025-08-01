<script>
document.addEventListener("DOMContentLoaded", () => {
const form = document.getElementById("orderForm");
const popup = document.getElementById("popup");
const popupMessage = document.getElementById("popup-message");

/* Заполняем выпадающие списки: "-", "1…6" */
document.querySelectorAll("select.qty").forEach(sel => {
  sel.innerHTML = '<option value="" selected>-</option>' +
    [1, 2, 3, 4, 5, 6].map(n => `<option value="${n}">${n}</option>`).join("");
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fd = new FormData(form);
  const name = fd.get("name");
  const contactMethod = fd.get("contactMethod");
  const contactHandle = fd.get("contactHandle");
  const comment = fd.get("comment");

  const orderItems = [];
  document.querySelectorAll(".dish select.qty").forEach(sel => {
    const qty = parseInt(sel.value);
    if (qty) {
      orderItems.push(`${sel.name} — ${qty}`);
    }
  });

  if (!orderItems.length) {
    alert("Выберите хотя бы одно блюдо.");
    return;
  }

  const orderHTML = orderItems
    .map((item, i) => `<div style="text-align:left;">${i + 1}. ${item}</div>`).join("");

  popupMessage.innerHTML = `
    <div style="font-family:Arial;font-size:16px;">
      <div>${name}!</div>
      <div style="margin-top:6px;">Ваша заявка отправлена!</div>
      <div style="margin:14px 0 6px;">Ваш заказ:</div>
      ${orderHTML}
      <div style="margin-top:16px;">В ближайшее время с вами свяжутся.<br>Благодарим, что выбрали YUMMY!</div>
    </div>
  `;
  popup.classList.remove("hidden");

  const emailBody = `
Имя: ${name}
Контакт: ${contactMethod} - ${contactHandle}
Комментарий: ${comment}

Заказ:
${orderItems.map((x, i) => `${i + 1}. ${x}`).join("\n")}
`;

  const telegramMessage = `
<b>Новый заказ YUMMY</b>
👤 Имя: ${name}
📬 Контакт: ${contactMethod} - ${contactHandle}
📝 Комментарий: ${comment || "–"}

🍽 Заказ:
${orderItems.map((x, i) => `${i + 1}. ${x}`).join("\n")}
`;

  // Отправка на почту
  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: "14d92358-9b7a-4e16-b2a7-35e9ed71de43",
        subject: "Новый заказ Yummy",
        from_name: "Yummy Food Form",
        message: emailBody,
        reply_to: contactHandle,
        name: name
      })
    }).then(r => r.json());

    if (!res.success) alert("Ошибка отправки на почту. Проверьте форму.");
  } catch (err) {
    alert("Ошибка при отправке на почту: " + err.message);
  }

  // Отправка в Telegram
  try {
    await fetch("https://api.telegram.org/bot8472899454:AAGiebKRLt6VMei4toaiW11bR2tIACuSFeo/sendMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: "495064227", // @yummyfood7
        text: telegramMessage,
        parse_mode: "HTML"
      })
    });
  } catch (err) {
    alert("Ошибка при отправке в Telegram: " + err.message);
  }

  form.reset();
});

function closePopup() {
  popup.classList.add("hidden");
}







