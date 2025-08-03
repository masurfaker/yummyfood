const form = document.getElementById("orderForm");
const popup = document.getElementById("popup");
const popupMessage = document.getElementById("popup-message");
const popupClose = document.getElementById("popup-close");

// === ЗАПОЛНЕНИЕ СЕЛЕКТОРОВ КОЛИЧЕСТВА ===
document.querySelectorAll("select.qty").forEach(select => {
  for (let i = 0; i <= 6; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    select.appendChild(option);
  }
});

// === ПОКАЗАТЬ ПОПАП ===
function showPopup(message) {
  popupMessage.innerHTML = message;
  popup.classList.remove("hidden");
}

// === ЗАКРЫТЬ ПОПАП ===
popupClose.addEventListener("click", () => {
  popup.classList.add("hidden");
});

// === ОБРАБОТКА ФОРМЫ ===
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = form.elements["name"].value.trim();
  const contactMethod = form.elements["contact-method"].value;
  const contactHandle = form.elements["contact"].value.trim();
  const comment = form.elements["comment"].value.trim();

  if (!name || !contactHandle) {
    alert("Пожалуйста, заполните имя и контакт.");
    return;
  }

  const orderItems = [];
  let kbjuTotal = [0, 0, 0, 0]; // К/Б/Ж/У

  document.querySelectorAll(".dish").forEach((dish) => {
    const qty = parseInt(dish.querySelector("select.qty").value);
    if (qty > 0) {
      const name = dish.querySelector(".dish-name").textContent.trim();
      const kbjuString = dish.querySelector(".kbju").dataset.kbju; // например: 500/30/20/40
      const [k, b, j, u] = kbjuString.split("/").map(Number);

      orderItems.push(`${name} — ${qty} шт.`);

      kbjuTotal[0] += k * qty;
      kbjuTotal[1] += b * qty;
      kbjuTotal[2] += j * qty;
      kbjuTotal[3] += u * qty;
    }
  });

  if (orderItems.length === 0) {
    alert("Выберите хотя бы одно блюдо.");
    return;
  }

  const orderHTML = `
    <strong>Имя:</strong> ${name}<br>
    <strong>Контакт:</strong> ${contactMethod} — ${contactHandle}<br>
    <strong>Комментарий:</strong> ${comment}<br><br>
    <strong>Заказ:</strong><br>${orderItems.map(x => "- " + x).join("<br>")}<br><br>
    <strong>К/Б/Ж/У:</strong> ${kbjuTotal.join(" / ")}
  `;

  const emailBody = `
Имя: ${name}
Контакт: ${contactMethod} - ${contactHandle}
Комментарий: ${comment}

Заказ:
${orderItems.map(x => "- " + x).join("\n")}

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

  // === ПОКАЗАТЬ ПОПАП ПОСЛЕ ОТПРАВКИ ===
  showPopup(orderHTML);
});