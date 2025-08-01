const kbjuData = {
  // Завтраки
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
  // Супы
  "Крем-суп из брокколи": [59, 4, 1, 13],
  "Крем-суп грибной": [328, 8, 24, 21],
  "Крем-суп из зеленого горошка": [480, 13, 30, 38],
  "Крем-суп из цветной капусты": [49, 3, 0, 10],
  "Крем-суп куриный": [108, 14, 1, 11],
  "Крем-суп овощной": [59, 2, 0, 13],
  "Крем-суп томатный": [277, 8, 9, 51],
  "Крем-суп тыквенный": [247, 3, 15, 24],
  "Крем-суп чечевичный": [207, 7, 10, 23],
  // Основные
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
  // Гарниры/соусы
  "Булгур": [148, 0, 382, 19],
  "Запеченный баклажан с соусом": [139, 7, 172, 27],
  "Запеченный цукини с соусом": [87, 5, 154, 14],
  "Пюре из цветной капусты": [94, 0, 175, 16],
  "Пюре картофельное": [167, 5, 83, 34],
  "Йогурт": [31, 2, 142, 2],
  "Соус чесночный": [160, 1, 1394, 2]
};

document.addEventListener("DOMContentLoaded", function () {
  const dishes = document.querySelectorAll(".dish");
  const totalBlock = document.getElementById("total-kbju");

  dishes.forEach((dish) => {
    const name = dish.querySelector("label").textContent.trim();
    const select = dish.querySelector("select.qty");

    // Создаем и вставляем блок с КБЖУ
    const kbjuBox = document.createElement("div");
    kbjuBox.className = "kbju";
    if (kbjuData[name]) {
      const [k, b, j, u] = kbjuData[name];
      kbjuBox.textContent = `К/Б/Ж/У: ${k}/${b}/${j}/${u}`;
    } else {
      kbjuBox.textContent = ""; // Убираем надпись "нет данных"
    }
    dish.insertBefore(kbjuBox, select);

    // Обновление общего КБЖУ при изменении количества
    select.addEventListener("change", updateTotal);
  });

  function updateTotal() {
    let totalK = 0, totalB = 0, totalJ = 0, totalU = 0;

    dishes.forEach((dish) => {
      const name = dish.querySelector("label").textContent.trim();
      const qty = parseInt(dish.querySelector("select.qty").value);
      if (qty > 0 && kbjuData[name]) {
        const [k, b, j, u] = kbjuData[name];
        totalK += k * qty;
        totalB += b * qty;
        totalJ += j * qty;
        totalU += u * qty;
      }
    });

    totalBlock.textContent = `Итого К/Б/Ж/У: ${totalK}/${totalB}/${totalJ}/${totalU}`;
  }

  // Отправка формы
  const form = document.getElementById("orderForm");
  const popup = document.getElementById("popup");
  const popupMessage = document.getElementById("popup-message");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const entries = [];

    dishes.forEach((dish) => {
      const name = dish.querySelector("label").textContent.trim();
      const qty = dish.querySelector("select.qty").value;
      if (qty !== "0") {
        entries.push(`${name}: ${qty}`);
      }
    });

    const kbjuSummary = totalBlock.textContent;
    const tgText = `
🍽️ Новый заказ!
👤 Имя: ${formData.get("name")}
📱 Соцсеть: ${formData.get("contact")}
📝 Комментарий: ${formData.get("comment")}
📦 Заказ:
${entries.join("\n")}
${kbjuSummary}
    `.trim();

    // Отправка в Telegram
    await fetch(`https://api.telegram.org/bot8472899454:AAGiebKRLt6VMei4toaiW11bR2tIACuSFeo/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: "7408180116",
        text: tgText,
      }),
    });

    // Отправка через Web3Forms
    formData.append("access_key", "14d92358-9b7a-4e16-b2a7-35e9ed71de43");
    formData.append("order", entries.join(", "));
    formData.append("kbju", kbjuSummary);

    await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    popupMessage.textContent = "Заказ отправлен!";
    popup.classList.add("show");

    setTimeout(() => {
      popup.classList.remove("show");
      form.reset();
      updateTotal();
    }, 3000);
  });
});