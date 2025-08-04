Скрипт в 2


document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById("orderForm");
  const popup = document.getElementById("popup");
  const popupMessage = document.getElementById("popup-message");

  function parseKbju(str) {
    return str.split('/').map(Number); // К/Б/Ж/У → [ккал, белки, жиры, углеводы]
  }

  function updateKbjuTotal() {
    let total = [0, 0, 0, 0]; // [Ккал, Б, Ж, У]

    document.querySelectorAll('.dish').forEach(dish => {
      const qty = parseInt(dish.querySelector('select.qty')?.value) || 0;
      const kbjuStr = dish.querySelector('.kbju')?.dataset.kbju;

      if (!kbjuStr || qty === 0) return;

      const kbju = parseKbju(kbjuStr);
      for (let i = 0; i < 4; i++) {
        total[i] += kbju[i] * qty;
      }
    });

    document.getElementById('total-kcal').textContent = total[0];
    document.getElementById('total-protein').textContent = total[1];
    document.getElementById('total-fat').textContent = total[2];
    document.getElementById('total-carbs').textContent = total[3];
  }

  // Заполнение select'ов 0–6 и добавление слушателей
  document.querySelectorAll('select.qty').forEach(select => {
    if (select.options.length === 0) {
      for (let i = 0; i <= 6; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        select.appendChild(option);
      }
    }
    select.addEventListener('change', updateKbjuTotal);
  });

  updateKbjuTotal();

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

    const orderHTML = `
      <ol style="margin: 0; padding-left: 18px;text-align: left;">
        ${orderItems.map(x => `<li>${x}</li>`).join("")}
      </ol>
      <br>
      <b>К/Б/Ж/У:</b> ${kbjuTotal.join(" / ")}
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

    // === Web3Forms ===
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
        updateKbjuTotal();
      }
    } catch (err) {
      alert("Ошибка отправки (email): " + err.message);
      return;
    }

    // === Telegram ===
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

  function closePopup() {
    popup.classList.add("hidden");
  }

});