document.getElementById('orderForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const form = e.target;
  const data = new FormData(form);
  let hasOrder = false;
  let message = 'Вы выбрали:\n';

  for (const [key, value] of data.entries()) {
    if (!['name', 'email', 'comment', 'contact', 'access_key'].includes(key) && value && parseInt(value) > 0) {
      message += `• ${key} — ${value}\n`;
      hasOrder = true;
    }
  }

  if (!hasOrder) {
    alert("Пожалуйста, выберите хотя бы одно блюдо.");
    return;
  }

  const payload = Object.fromEntries(data.entries());
  payload.subject = "Новая заявка с сайта";
  payload.from_name = payload.name;
  payload.message = message + "\nКомментарий: " + (payload.comment || "-") + "\nКонтакт: " + payload.contact;

  const resultModal = document.getElementById("resultModal");
  const resultText = document.getElementById("resultText");

  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const json = await res.json();

    if (json.success) {
      resultText.textContent = payload.message;
      resultModal.classList.remove("hidden");
      form.reset();
    } else {
      alert("Ошибка отправки: " + json.message);
    }
  } catch (err) {
    alert("Ошибка отправки. Проверьте форму.");
  }
});

document.getElementById("closeModal").addEventListener("click", function () {
  document.getElementById("resultModal").classList.add("hidden");
});