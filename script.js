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
});