const form = document.getElementById("orderForm");
const popup = document.getElementById("popup");
const popupMessage = document.getElementById("popup-message");

const kbjuSummary = document.getElementById("kbju-summary");

// Таблица КБЖУ: название => [К, Б, Ж, У]
const kbjuData = {
  "Блины с курой и овощами": [854, 22, 87, 26],
  "Блины с курой в сливках": [854, 20, 86, 23],
  "Блины с йогуртом и медом": [582, 20, 26, 69],
  "Блины с сыром и ветчиной": [517, 36, 35, 16],
  "Блины с творогом с йогуртом": [476, 27, 28, 32],
  "Драники из цукини с йогуртом": [451, 17, 24, 42],
  "Драники из картофеля с йогуртом": [464, 18, 25, 43],
  "Йогурт с гранолой и тыквенными семечками": [424, 15, 15, 62],
  "Омлет с брокколи": [76, 5, 4, 8],
  "Омлет с вялеными томатами": [2014, 11, 187, 76],
  "Пенкейки с кленовым сиропом и йогуртом": [818, 17, 32, 117],
  "Сырники с йогуртом": [382, 24, 18, 32],
  "Борщ": [924, 32, 73, 37],
  "Крем-суп из брокколи": [59, 4, 1, 13],
  "Крем-суп грибной": [328, 8, 24, 21],
  "Крем-суп из зеленого горошка": [480, 13, 30, 38],
  "Крем-суп из цветной капусты": [49, 3, 0, 10],
  "Крем-суп куриный": [108, 14, 1, 11],
  "Крем-суп овощной": [59, 2, 0, 13],
  "Крем-суп томатный": [277, 8, 9, 51],
  "Крем-суп тыквенный": [247, 3, 15, 24],
  "Крем-суп чечевичный": [207, 7, 10, 23],
  "Министроне": [33, 1, 0, 7],
  "Бефстроганов с пюре": [472, 18, 25, 44],
  "Греча с овощами и говядиной": [1114, 37, 64, 93],
  "Жульен с пюре": [851, 28, 54, 62],
  "Котлеты из форели с фасолью": [1142, 28, 94, 48],
  "Котлеты куриные с перцем": [1812, 55, 110, 206],
  "Креветки с цукини и соусом": [103, 11, 2, 9],
  "Креветки с цукини и рисом": [564, 25, 18, 70],
  "Куриная грудка с картофельным пюре": [363, 44, 3, 35],
  "Паста карбонара": [836, 31, 49, 60],
  "Паста с креветками в сливочном соусе песто": [699, 27, 36, 59],
  "Паста с курой в сливочном соусе песто": [671, 32, 31, 59],
  "Паста с уткой": [1208, 37, 92, 62],
  "Печень в сметанном соусе": [751, 41, 44, 43],
  "Рататуй": [354, 11, 15, 58],
  "Свинина в барбекю с пюре": [683, 27, 47, 39],
  "Свинина в кислосладком соусе с овощами": [200236, 162, 110, 0],
  "Сибас с пюре из цветной капусты": [635, 29, 46, 28],
  "Сибас с цукини и чесночным соусом": [263, 30, 11, 16],
  "Свинина запеченная с овощами": [365, 34, 25, 10],
  "Стейк из форели с брокколи": [442, 38, 30, 15],
  "Стейк филе миньон с пюре": [616, 36, 36, 37],
  "Булгур": [148, 0, 382, 19],
  "Запеченный баклажан с соусом": [139, 7, 172, 27],
  "Запеченный цукини с соусом": [87, 5, 154, 14],
  "Пюре из цветной капусты": [94, 0, 175, 16],
  "Пюре картофельное": [167, 5, 83, 34],
  "Йогурт": [31, 2, 142, 2],
  "Соус чесночный": [160, 1, 1394, 2]
};

function updateKbjuSummary() {
  let sum = [0, 0, 0, 0]; // К, Б, Ж, У

  document.querySelectorAll(".dish select.qty").forEach(sel => {
    const qty = parseInt(sel.value);
    if (!qty) return;
    const name = sel.name;
    const values = kbjuData[name];
    if (!values) return;
    sum = sum.map((val, i) => val + values[i] * qty);
  });

  kbjuSummary.innerText = `К: ${sum[0]} / Б: ${sum[1]} / Ж: ${sum[2]} / У: ${sum[3]}`;
}

// Создание выпадающих списков и привязка событий
document.querySelectorAll("select.qty").forEach(sel => {
  sel.innerHTML = '<option value="" selected>-</option>' +
    [1, 2, 3, 4, 5, 6].map(n => `<option value="${n}">${n}</option>`).join("");
  sel.addEventListener("change", updateKbjuSummary);
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

  updateKbjuSummary(); // сброс после отправки
});

function closePopup() {
  popup.classList.add("hidden");
}