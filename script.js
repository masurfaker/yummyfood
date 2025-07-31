document.addEventListener("DOMContentLoaded", () => {
  const selects = document.querySelectorAll(".qty");
  const popup = document.getElementById("popup");
  const popupMessage = document.getElementById("popup-message");
  const form = document.getElementById("orderForm");

  // Заполняем выпадающие списки значениями от 0 до 5
  selects.forEach(select => {
    for (let i = 0; i <= 5; i++) {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = i;
      select.appendChild(option);
    }
  });

  form.addEventListener("submit", e => {
    e.preventDefault();

    let total = { К: 0, Б: 0, Ж: 0, У: 0 };
    let заказ = [];

    selects.forEach(select => {
      const count = parseInt(select.value);
      if (count > 0) {
        const dish = select.parentElement.textContent.trim().split('\n')[0].trim();
        const [К, Б, Ж, У] = select.dataset.info.split("/").map(Number);

        total.К += К * count;
        total.Б += Б * count;
        total.Ж += Ж * count;
        total.У += У * count;

        заказ.push(`${dish} — ${count} шт.`);
      }
    });

    const contact = document.getElementById("contactHandle").value;

    popupMessage.innerText =
      заказ.join("\n") +
      `\n\nКонтакт: ${contact}\n\nИтого:\nКкал: ${total.К}\nБ: ${total.Б} г\nЖ: ${total.Ж} г\nУ: ${total.У} г`;

    popup.classList.remove("hidden");

    // Очистить форму после отправки (по желанию)
    // form.reset();
    // selects.forEach(s => s.value = "0");
  });
document.addEventListener("DOMContentLoaded", () => {
  const menu = {
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

  // Добавляем под каждое блюдо строку К/Б/Ж/У
  document.querySelectorAll(".dish").forEach(dishEl => {
    const name = dishEl.childNodes[0]?.textContent?.trim();
    if (menu[name]) {
      const infoLine = document.createElement("div");
      infoLine.className = "kbju-line";
      infoLine.textContent = `К/Б/Ж/У: ${menu[name].join("/")}`;
      infoLine.style.fontSize = "13px";
      infoLine.style.color = "#666";
      infoLine.style.marginTop = "4px";
      dishEl.appendChild(infoLine);
    }
  });

  // Создаём итоговый блок перед комментарием
  const commentBlock = document.querySelector("textarea")?.closest(".input-block");
  if (commentBlock) {
    const resultBlock = document.createElement("div");
    resultBlock.className = "input-block";
    resultBlock.id = "kbju-result";
    resultBlock.style.marginBottom = "16px";
    resultBlock.innerHTML = `<label><strong>К/Б/Ж/У итого:</strong></label><div id="kbju-values">0/0/0/0</div>`;
    commentBlock.parentNode.insertBefore(resultBlock, commentBlock);
  }

  // Обновление итогов
  function updateTotals() {
    let total = [0, 0, 0, 0]; // К, Б, Ж, У
    document.querySelectorAll(".dish").forEach(dishEl => {
      const name = dishEl.childNodes[0]?.textContent?.trim();
      const qty = parseInt(dishEl.querySelector("select")?.value || 0);
      if (menu[name] && qty > 0) {
        menu[name].forEach((val, i) => total[i] += val * qty);
      }
    });
    document.getElementById("kbju-values").textContent = total.map(v => Math.round(v)).join("/");
  }

  // Следим за изменением всех select
  document.querySelectorAll(".dish select").forEach(select => {
    select.addEventListener("change", updateTotals);
  });

  updateTotals(); // начальный подсчёт
});