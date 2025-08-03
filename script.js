const form = document.getElementById("orderForm");
const popup = document.getElementById("popup");
const popupMessage = document.getElementById("popup-message");
const closeBtn = document.getElementById("close-popup");

// Автозаполнение select от 0 до 6
document.querySelectorAll("select.qty").forEach(select => {
  for (let i = 0; i <= 6; i++) {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = i;
    select.appendChild(opt);
  }
});

// Закрытие попапа
closeBtn.addEventListener("click", () => {
  popup.classList.add("hidden");
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = form.querySelector("input[name='name']").value.trim();
  const contactMethod = form.querySelector("select[name='contactMethod']").value;
  const contactHandle = form.querySelector("input[name='contact']").value.trim();
  const comment = form.querySelector("textarea[name='comment']").value.trim();

  if (!name || !contactHandle) {
    alert("Пожалуйста, заполните имя и контактные данные.");
    return;
  }

  const orderItems = [];
  let totalCalories = 0, totalProtein = 0, totalFat = 0, totalCarbs = 0;

  document.querySelectorAll(".dish").forEach(dish => {
    const title = dish.querySelector(".dish-name").textContent.trim();
    const kbju = dish.querySelector(".kbju")?.dataset.kbju;
    const qty = parseInt(dish.querySelector("select.qty").value);

    if (qty > 0 && kbju) {
      const [k, b, j, u] = kbju.split("/").map(Number);
      totalCalories += k * qty;
      totalProtein  += b * qty;
      totalFat      += j * qty;
      totalCarbs    += u * qty;

      orderItems.push(`${title} — ${qty} шт.`);
    }
  });

  if (orderItems.length === 0) {
    alert("Выберите хотя бы одно блюдо.");
    return;
  }

  const kbjuTotal = [totalCalories, totalProtein, totalFat, totalCarbs];
  const orderHTML = orderItems.map(item => `<div>${item}</div>`).join("");

  popupMessage.innerHTML = `
    <div style="font-family:Arial;font-size:16px;">
      <div>${name}!</div>
      <div style="margin-top:6px;">Ваша заявка отправлена!</div>
      <div style="margin:14px 0 6px;">Ваш заказ:</div>
      ${orderHTML}
      <div style="margin-top:14px;">К/Б/Ж/У: ${kbjuTotal.join(" / ")}</div>
      <div style="margin-top:16px;">В ближайшее время с вами свяжутся.<br>Благодарим, что выбрали YUMMY!</div>
    </div>
  `;
  popup.classList.remove("hidden");

  // === ОТПРАВКА EMAIL ===
  const emailBody = `
Имя: ${name}
Контакт: ${contactMethod} - ${contactHandle}
Комментарий: ${comment}

Заказ:
${orderItems.map((x, i) => `${i + 1}. ${x}`).join("\n")}

К/Б/Ж/У: ${kbjuTotal.join(" / ")}
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