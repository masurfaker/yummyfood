const form = document.getElementById("orderForm");
const popup = document.getElementById("popup");
const popupMessage = document.getElementById("popup-message");

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
  "Свинина в кислосладком соусе с овощами": [200236, 162, 110, 0],  // ← проверь это значение, возможно ошибка
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

// Генерация select и КБЖУ
document.querySelectorAll(".dish").forEach((dish) => {
  const name = dish.dataset.name;
  const select = dish.querySelector("select");

  for (let i = 0; i <= 6; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.text = i;
    select.appendChild(option);
  }

  const kbjuBox = document.createElement("div");
  kbjuBox.className = "kbju-box";

  if (kbjuData[name]) {
    const [k, b, j, u] = kbjuData[name];
    kbjuBox.textContent = `К/Б/Ж/У: ${k}/${b}/${j}/${u}`;
  } else {
    kbjuBox.textContent = "КБЖУ: нет данных";
  }

  dish.insertBefore(kbjuBox, select);
});

// Обработка формы
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(form);
  let result = "";
  let total = [0, 0, 0, 0];

  document.querySelectorAll(".dish").forEach((dish) => {
    const name = dish.dataset.name;
    const qty = parseInt(dish.querySelector("select").value);
    if (qty > 0) {
      const [k, b, j, u] = kbjuData[name] || [0, 0, 0, 0];
      total[0] += k * qty;
      total[1] += b * qty;
      total[2] += j * qty;
      total[3] += u * qty;
      result += `${name} — ${qty} шт\n`;
    }
  });

  result += `\nИтог КБЖУ: ${total[0]}/${total[1]}/${total[2]}/${total[3]}\n`;
  result += `\nКонтакты: ${formData.get("contact") || "Не указаны"}\nКомментарий: ${formData.get("comment") || "—"}`;

  popupMessage.textContent = result;
  popup.classList.remove("hidden");

  // Web3Forms
  fetch("https://api.web3forms.com/submit", {
    method: "POST",
    body: formData,
  });

  // Telegram
  const tgText = encodeURIComponent(result);
  const botToken = "<ТВОЙ_ТОКЕН>";
  const chatId = "<ТВОЙ_CHAT_ID>";
  fetch(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${tgText}`);
});