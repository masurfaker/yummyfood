document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("orderForm");
  const popup = document.getElementById("popup");
  const popupMessage = document.getElementById("popup-message");

  const kbjuTotal = document.getElementById("kbju-total");
  const telegramToken = "8472899454:AAGiebKRLt6VMei4toaiW11bR2tIACuSFeo";
  const telegramChatID = "7408180116";

  const kbjuData = {
    "Блины с курой и овощами": [811, 23, 82, 25],
    "Блины с курой в сливках": [484, 21, 81, 23],
    "Блины с йогуртом и медом": [582, 20, 26, 69],
    "Блины с сыром и ветчиной": [517, 36, 35, 16],
    "Блины с творогом с йогуртом": [476, 27, 28, 32],
    "Драники из цукини с йогуртом": [451, 17, 24, 42],
    "Драники из картофеля с йогуртом": [464, 18, 25, 43],
    "Йогурт с гранолой и тыквенными семечками": [424, 15, 15, 62],
    "Омлет с брокколи": [76, 5, 4, 8],
    "Омлет с вялеными томатами": [1189, 6, 113, 39],
    "Пенкейки с кленовым сиропом и йогуртом": [818, 17, 32, 117],
    "Сырники с йогуртом": [382, 24, 18, 32],
    "Крем-суп из брокколи": [59, 4, 1, 13],
    "Крем-суп грибной": [328, 8, 24, 21],
    "Крем-суп из зеленого горошка": [480, 13, 30, 38],
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
    "Котлеты куриные с перцем": [1114, 54, 109, 206],
    "Креветки с цукини и соусом": [103, 11, 2, 9],
    "Креветки с цукини и рисом": [564, 25, 18, 70],
    "Куриная грудка с картофельным пюре": [363, 44, 3, 35],
    "Паста карбонара": [836, 31, 49, 60],
    "Паста с креветками в сливочном соусе песто": [699, 27, 36, 59],
    "Паста с курой в сливочном соусе песто": [671, 32, 31, 59],
    "Паста с уткой": [1208, 37, 92, 62],
    "Печень в сметанном соусе": [751, 41, 44, 43],
    "Рататуй": [210, 5, 13, 21],
    "Свинина в барбекю с пюре": [683, 27, 47, 39],
    "Свинина в кислосладком соусе с овощами": [1114, 29, 100, 59],
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
    "Соус чесночный": [160, 1, 1394, 2],
  };

  document.querySelectorAll(".dish").forEach(dish => {
    const name = dish.querySelector(".dish-name").textContent.trim();
    const select = dish.querySelector("select.qty");

    if (!select) return;

    const kbjuBox = document.createElement("div");
    kbjuBox.className = "kbju";
    if (kbjuData[name]) {
      const [k, b, j, u] = kbjuData[name];
      kbjuBox.textContent = `К/Б/Ж/У: ${k}/${b}/${j}/${u}`;
    }

    dish.insertBefore(kbjuBox, select);

    select.innerHTML = "";
    for (let i = 0; i <= 5; i++) {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = i;
      select.appendChild(option);
    }
  });

  function calculateTotalKBJU() {
    let total = [0, 0, 0, 0];
    document.querySelectorAll(".dish").forEach(dish => {
      const name = dish.querySelector(".name").textContent.trim();
      const qty = +dish.querySelector("select.qty").value;
      if (kbjuData[name] && qty > 0) {
        const [k, b, j, u] = kbjuData[name];
        total[0] += k * qty;
        total[1] += b * qty;
        total[2] += j * qty;
        total[3] += u * qty;
      }
    });
    kbjuTotal.value = `К/Б/Ж/У: ${total[0]}/${total[1]}/${total[2]}/${total[3]}`;
  }

  document.querySelectorAll("select.qty").forEach(select => {
    select.addEventListener("change", calculateTotalKBJU);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    calculateTotalKBJU();

    const formData = new FormData(form);
    const name = formData.get("name") || "Имя не указано";
    const contact = formData.get("social") || "Контакт не указан";
    const comment = formData.get("comment") || "-";

    const selectedDishes = [];
    document.querySelectorAll(".dish").forEach(dish => {
      const dishName = dish.querySelector(".name").textContent.trim();
      const qty = +dish.querySelector("select.qty").value;
      if (qty > 0) {
        selectedDishes.push(`${dishName} x${qty}`);
      }
    });

    const kbju = kbjuTotal.value;

    const message = `
🍽️ Новый заказ:
👤 Имя: ${name}
📱 Контакт: ${contact}
🥗 Блюда:
${selectedDishes.join("\n")}
🧮 ${kbju}
💬 Комментарий: ${comment}
    `.trim();

    // Telegram
    await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: telegramChatID,
        text: message,
      }),
    });

    // Web3Forms
    await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: new FormData(form),
    });

    form.reset();
    kbjuTotal.value = "";
    popupMessage.textContent = "Спасибо! Заказ отправлен.";
    popup.style.display = "flex";
  });

  document.getElementById("popup-close").addEventListener("click", () => {
    popup.style.display = "none";
  });
});