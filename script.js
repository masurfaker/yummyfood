const form = document.getElementById("orderForm");
const popup = document.getElementById("popup");
const popupMessage = document.getElementById("popup-message");

// Заполняем селекторы от 0 до 6
document.querySelectorAll("select.qty").forEach(select => {
  for (let i = 0; i <= 6; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    select.appendChild(option);
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = form.name.value.trim();
  const contactMethod = form.contact.value;
  const contactHandle = form.handle.value.trim();
  const comment = form.comment.value.trim();

  if (!name || !contactHandle) {
    alert("Пожалуйста, заполните имя и контакт.");
    return;
  }

  const orderItems = [];
  let totalK = 0, totalB = 0, totalJ = 0, totalU = 0;

  document.querySelectorAll(".dish").forEach(dish => {
    const qty = parseInt(dish.querySelector("select.qty").value);
    if (qty > 0) {
      const title = dish.querySelector(".dish-name").textContent.trim();
      const kbju = dish.querySelector(".kbju").dataset.kbju.split("/").map(x => parseFloat(x));
      const [k, b, j, u] = kbju.map(x => x * qty);

      totalK += k;
      totalB += b;
      totalJ += j;
      totalU += u;

      orderItems.push(`${title} — ${qty} шт.`);
    }
  });

  if (orderItems.length === 0) {
    alert("Вы не выбрали ни одного блюда.");
    return;
  }

  const kbjuTotal = [
    Math.round(totalK),
    Math.round(totalB),
    Math.round(totalJ),
    Math.round(totalU)
  ];

  // Попап
  popupMessage.innerHTML = `
    <div style="font-family:Arial;font-size:16px;">
      <div>${name}!</div>
      <div style="margin-top:6px;">Ваша заявка отправлена!</div>
      <div style="margin:14px 0 6px;">Ваш заказ:</div>
      <ul style="margin:0;padding-left:20px;">
        ${orderItems.map(item => `<li>${item}</li>`).join("")}
      </ul>
      <div style="margin-top:10px;">К/Б/Ж/У: <b>${kbjuTotal.join(" / ")}</b></div>
      <div style="margin-top:16px;">В ближайшее время с вами свяжутся.<br>Благодарим, что выбрали YUMMY!</div>
    </div>
  `;
  popup.classList.remove("hidden");

  // Формируем текст для отправки
  const emailBody = `
Имя: ${name}
Контакт: ${contactMethod} - ${contactHandle}
Комментарий: ${comment}

Заказ:
${orderItems.map((x, i) => `${i + 1}. ${x}`).join("\n")}

К/Б/Ж/У: ${kbjuTotal.join(" / ")}
  `;

  // === ОТПРАВКА В Web3Forms ===
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

    if (!res.success) {
      alert("Ошибка отправки. Проверьте форму.");
      return;
    } else {
      form.reset();
    }
  } catch (err) {
    alert("Ошибка отправки (email): " + err.message);
    return;
  }

  // === ОТПРАВКА В TELEGRAM ===
  const tgMessage = `
Новый заказ от ${name}
Контакт: ${contactMethod} - ${contactHandle}
Комментарий: ${comment}

Заказ:
${orderItems.map((x, i) => `${i + 1}. ${x}`).join("\n")}

К/Б/Ж/У: ${kbjuTotal.join(" / ")}
  `;

  try {
    await fetch("https://api.telegram.org/bot8472899454:AAGiebKRLt6VMei4toaiW11bR2tIACuSFeo/sendMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: 7408180116,
        text: tgMessage
      })
    });
  } catch (err) {
    console.error("Ошибка отправки в Telegram: ", err.message);
  }
});