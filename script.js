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

  // собрать заказанные блюда
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

  const messageText = `${name}! Ваша заявка отправлена!\n\nВаш заказ:\n` +
    orderItems.map((item, index) => `${index + 1}. ${item}`).join("\n") +
    `\n\nВ ближайшее время с вами свяжутся.\nБлагодарим, что выбрали YUMMY!`;

  popupMessage.textContent = messageText;
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