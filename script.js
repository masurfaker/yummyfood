document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("orderForm");
  const popup = document.getElementById("popup");
  const popupMessage = document.getElementById("popup-message");

  // Заполняем select.qty значениями от 1 до 6
  document.querySelectorAll("select.qty").forEach(sel => {
    sel.innerHTML = '<option value="">—</option>' +
      Array.from({ length: 6 }, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join("");
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

    const orderHTML = orderItems.map((item, i) =>
      `<div style="text-align:left;">${i + 1}. ${item}</div>`).join("");

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

      if (!res.success) alert("Ошибка отправки. Проверьте форму.");
      else form.reset();
    } catch (err) {
      alert("Ошибка отправки (email): " + err.message);
    }

    // === ОТПРАВКА В TELEGRAM ===
    const tgMessage = `
Новый заказ от ${name}
Контакт: ${contactMethod} - ${contactHandle}
Комментарий: ${comment}

Заказ:
${orderItems.map((x, i) => `${i + 1}. ${x}`).join("\n")}
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

  const kbjuMap = {
    "Блины кура овощи": [854, 22, 87, 26],
    "Блины кура сливки": [854, 20, 86, 23],
    "Блины с йогуртом и медом": [582, 20, 26, 69],
    "Блины с сыром и ветчиной": [517, 36, 35, 16],
    "Блины с творогом и йогуртом": [476, 27, 28, 32],
    "Драники с йогуртом": [464, 18, 25, 43],
    "Йогурт с гранолой и тыквенными семечками": [424, 15, 15, 62],
    "Омлет с брокколи": [76, 5, 4, 8],
    "Омлет с вялеными томатами": [2014, 11, 187, 76],
    "Пенкейки с кленовым сиропом и йогуртом": [818, 17, 32, 117],
    "Сырники": [382, 24, 18, 32],
    "Крем-суп из брокколи": [59, 4, 1, 13],
    "Крем-суп грибной": [328, 8, 24, 21],
    "Крем-суп из цветной капусты": [49, 3, 0, 10],
    "Крем-суп куриный": [108, 14, 1, 11],
    "Крем-суп овощной": [59, 2, 0, 13],
    "Крем-суп томатный": [277, 8, 9, 51],
    "Крем-суп тыквенный": [247, 3, 15, 24],
    "Крем-суп чечевичный": [207, 7, 10, 23],
    "Бефстроганов с пюре": [472, 18, 25, 44],
    "Греча с овощами и говядиной": [1114, 37, 64, 93],
    "Жульен с пюре": [851, 28, 54, 62],
    "Котлеты из форели с фасолью": [1142, 28, 94, 48],
    "Котлеты куриные с запеченным перцем": [1812, 55, 110, 206],
    "Креветки с цукини и рисом": [564, 25, 18, 70],
    "Куриная грудка с пюре": [363, 44, 3, 35],
    "Паста карбонара": [836, 31, 49, 60],
    "Паста с креветками в сливочном соусе песто": [699, 27, 36, 59],
    "Паста с курой в сливочном соусе песто": [671, 32, 31, 59],
    "Паста с уткой": [1208, 37, 92, 62],
    "Печень в сметанном соусе с пюре": [751, 41, 44, 43],
    "Свинина в барбекю с пюре": [683, 27, 47, 39],
    "Свинина в кислосладком соусе с овощами": [236, 16, 2, 110],
    "Сибас на пару с цукини и чесночным соусом": [263, 30, 11, 16],
    "Стейк из форели с брокколи": [442, 38, 30, 15],
    "Стейк филе миньон с пюре": [616, 36, 36, 37],
    "Булгур": [148, 0, 382, 19],
    "Запеченный баклажан с соусом": [139, 7, 172, 27],
    "Запеченный цукини с соусом": [87, 5, 154, 14],
    "Пюре картофельное": [167, 5, 83, 34],
    "Пюре цветная капуста": [94, 0, 175, 16]
  };

  function updateKbjuSummary() {
    let k = 0, b = 0, j = 0, u = 0;
    document.querySelectorAll(".dish select.qty").forEach(sel => {
      const qty = parseInt(sel.value);
      const name = sel.name;
      if (qty && kbjuMap[name]) {
        const [kk, bb, jj, uu] = kbjuMap[name];
        k += kk * qty;
        b += bb * qty;
        j += jj * qty;
        u += uu * qty;
      }
    });
    const summary = document.getElementById("kbju-summary");
    if (summary) {
      summary.textContent = `К: ${k} / Б: ${b} / Ж: ${j} / У: ${u}`;
    }
  }

  document.querySelectorAll(".dish select.qty").forEach(sel => {
    sel.addEventListener("change", updateKbjuSummary);
  });

  updateKbjuSummary();
});