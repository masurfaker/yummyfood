const form = document.getElementById("orderForm");
const popup = document.getElementById("popup");
const popupMessage = document.getElementById("popup-message");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = form.name.value.trim();
  const contactMethod = form.contactMethod.value.trim();
  const contactHandle = form.contactHandle.value.trim();
  const comment = form.comment.value.trim();

  if (!name || !contactMethod || !contactHandle) {
    alert("Пожалуйста, заполните все контактные поля");
    return;
  }

  const orderItems = [];
  const kbjuTotal = [0, 0, 0, 0]; // К / Б / Ж / У

  const dishes = form.querySelectorAll(".dish");
  dishes.forEach((dish) => {
    const qty = parseInt(dish.querySelector("select.qty").value);
    if (qty > 0) {
      const title = dish.querySelector(".dish-name").textContent.trim();
      const kbjuString = dish.querySelector(".kbju").dataset.kbju;
      const [k, b, j, u] = kbjuString.split("/").map(Number);
      orderItems.push(`${title} — ${qty} порц.`);

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

  const emailBody = `
Новый заказ от ${name}
Контакт: ${contactMethod} - ${contactHandle}
Комментарий: ${comment}

Заказ:
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

// === ПОКАЗ POPUP ===
  popupMessage.innerHTML = `
<strong>Спасибо за заказ!</strong><br>
Контакт: ${contactMethod} - ${contactHandle}<br><br>
<strong>Заказ:</strong><br>
${orderItems.map((x, i) => `${i + 1}. ${x}`).join("<br>")}
<br><br>
<b>К/Б/Ж/У:</b> ${kbjuTotal.join(" / ")}
  `;
  popup.classList.remove("hidden");
});

// === ЗАКРЫТИЕ POPUP ===
function closePopup() {
  popup.classList.add("hidden");
}

  