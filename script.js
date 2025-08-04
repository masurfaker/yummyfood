let popupShown = false;

function closePopup() {
  document.getElementById("popup").classList.add("hidden");
  popupShown = false;
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById("orderForm");
  const popup = document.getElementById("popup");
  const popupMessage = document.getElementById("popup-message");

  function parseKbju(str) {
    return str.split('/').map(Number);
  }

  function updateKbjuTotal() {
    let total = [0, 0, 0, 0]; // К, Б, Ж, У

    document.querySelectorAll('.dish').forEach(dish => {
      const qty = parseInt(dish.querySelector('select.qty').value);
      if (qty > 0) {
        const kbju = parseKbju(dish.querySelector('.kbju').dataset.kbju);
        for (let i = 0; i < 4; i++) {
          total[i] += kbju[i] * qty;
        }
      }
    });

    document.getElementById('total-kcal').textContent = total[0];
    document.getElementById('total-protein').textContent = total[1];
    document.getElementById('total-fat').textContent = total[2];
    document.getElementById('total-carbs').textContent = total[3];
  }

  // Инициализация селекторов
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

  updateKbjuTotal(); // первичный пересчёт

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const selectedDishes = [];
    document.querySelectorAll(".dish").forEach(dish => {
      const qty = parseInt(dish.querySelector("select.qty").value);
      if (qty > 0) {
        const name = dish.querySelector(".dish-name").textContent.trim();
        selectedDishes.push(`${name} — ${qty} порц.`);
      }
    });

    if (selectedDishes.length === 0) {
      alert("Выберите хотя бы одно блюдо.");
      return;
    }

    const message = selectedDishes.join("\n");

    // ⏱️ Показываем попап СРАЗУ
    if (!popupShown) {
      popupMessage.textContent = "Заявка отправлена:\n" + message;
      popup.classList.remove("hidden");
      popupShown = true;
    }

    // 🚀 Telegram — в фоне
    const telegramToken = "8472899454:AAGiebKRLt6VMei4toaiW11bR2tIACuSFeo";
    const chatId = "7408180116";
    fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message })
    });

    // 📬 Web3Forms — тоже в фоне
    const formData = new FormData(form);
    formData.append("access_key", "14d92358-9b7a-4e16-b2a7-35e9ed71de43");
    formData.append("message", message);

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });
  });
});