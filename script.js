const form = document.getElementById("orderForm");
const popup = document.getElementById("popup");
const popupMessage = document.getElementById("popup-message");

// Заполняем селекты от 0 до 6
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

  const name = form.querySelector('input[name="name"]').value.trim();
  const contactMethod = form.querySelector('select[name="contact-method"]').value;
  const contactHandle = form.querySelector('input[name="contact"]').value.trim();
  const comment = form.querySelector('textarea[name="comment"]').value.trim();

  if (!name || !contactHandle) {
    alert("Пожалуйста, заполните имя и контактные данные.");
    return;
  }

  const orderItems = [];
  const kbjuTotal = [0, 0, 0, 0];

  document.querySelectorAll(".dish").forEach(dish => {
    const qty = parseInt(dish.querySelector("select.qty").value);
    if (qty > 0) {
      const name = dish.querySelector(".dish-name").textContent.trim();
      const kbjuStr = dish.querySelector(".kbju").dataset.kbju;
      const kbju = kbjuStr.split("/").map(Number);

      for (let i = 0; i < 4; i++) kbjuTotal[i] += kbju[i] * qty;

      orderItems.push(`${name} — ${qty} порц.`);
    }
  });

  if (orderItems.length === 0) {
    alert("Вы не выбрали ни одного блюда.");
    return;
  }

  // === ПОКАЗ ПОПАПА СРАЗУ ===
  popupMessage.innerHTML = `
    <strong>Заказ отправлен!</strong><br><br>
    <u>Блюда:</u><br>${orderItems.map(x => `• ${x}`).join("<br>")}<br><br>
    <b>К/Б/Ж/У:</b> ${kbjuTotal.join(" / ")}
  `;
  popup.classList.remove("hidden");

  setTimeout(() => popup.classList.add("hidden"), 10000);

  const emailBody = `
Имя: ${name}
Контакт: ${contactMethod} - ${contactHandle}
Комментарий: ${comment}

Блюда:
${orderItems.map((x, i) => `${i + 1}. ${x}`).join("\n")}

К/Б/Ж/У: ${kbjuTotal.join(" / ")}
  `;

  // === ОТПРАВКА EMAIL ===
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