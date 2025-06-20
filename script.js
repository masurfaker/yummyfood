const form = document.getElementById("orderForm");
const popup = document.getElementById("popup");
const popupMessage = document.getElementById("popup-message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const name = formData.get("name");
  const contactMethod = formData.get("contactMethod");
  const contactHandle = formData.get("contactHandle");
  const comment = formData.get("comment");

  const orderItems = [];
  form.querySelectorAll(".dish").forEach((dish) => {
    const input = dish.querySelector("input[type='number']");
    const value = parseInt(input.value);
    if (value > 0) {
      const dishName = input.name;
      orderItems.push(`${dishName} — ${value}`);
    }
  });

  if (orderItems.length === 0) {
    alert("Выберите хотя бы одно блюдо.");
    return;
  }

  const orderListHTML = orderItems
    .map((item, i) => `<div style="text-align:left;">${i + 1}. ${item}</div>`)
    .join("");

  popupMessage.innerHTML = `
    <div style="font-family: Arial, sans-serif; font-size: 16px;">
      <div>${name}!</div>
      <div style="margin-top: 6px;">Ваша заявка отправлена!</div>
      <div style="margin: 14px 0 6px;">Ваш заказ:</div>
      ${orderListHTML}
      <div style="margin-top: 16px;">В ближайшее время с вами свяжутся.<br>Благодарим, что выбрали YUMMY!</div>
    </div>
  `;

  popup.classList.remove("hidden");

  const emailBody = `
Имя: ${name}
Контакт: ${contactMethod} - ${contactHandle}
Комментарий: ${comment}

Заказ:
${orderItems.map((item, index) => `${index + 1}. ${item}`).join("\n")}
`;

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
      }),
    });

    const result = await res.json();

    if (!result.success) {
      alert("Ошибка отправки. Проверьте форму.");
    } else {
      form.reset();
    }
  } catch (err) {
    alert("Ошибка отправки: " + err.message);
  }
});

function closePopup() {
  popup.classList.add("hidden");
}