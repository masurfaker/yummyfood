emailjs.init("u7NXPBbhemkcB7EGM");

document.getElementById("orderForm").addEventListener("submit", async e => {
  e.preventDefault();
  const fd = new FormData(e.target);

  const name       = fd.get("name").trim();
  const email      = fd.get("email").trim();
  const cType      = fd.get("contact_type");
  const cValue     = fd.get("contact_value").trim();
  const comment    = fd.get("comment").trim();

  let full = "", filtered = ""; let qty = 0;
  fd.forEach((v, k) => {
    if (!["name", "email", "contact_type", "contact_value", "comment"].includes(k)) {
      const n = parseInt(v) || 0;
      full += `${k} — ${n}\n`;
      if (n > 0) { filtered += `${k} — ${n}\n`; qty += n; }
    }
  });

  if (qty === 0) {
    alert("Выберите хотя бы одно блюдо");
    return;
  }

  const adminParams = {
    name,
    email,
    contact_type: cType,
    contact_value: cValue,
    comment,
    Order: full
  };

  const clientParams = {
    name,
    email,
    comment,
    contactMethod: cType,
    contactvalue: cValue,
    filteredOrder: filtered
  };

  try {
    // Используем корректные IDs
    await emailjs.send("service_p7e7ykn", "template_hwcno8p", adminParams);
    await emailjs.send("service_p7e7ykn", "template_a4vqdxr", clientParams);

    const p = document.getElementById("popup");
    p.textContent = `${name}, спасибо за заявку!\n\nКонтакт: ${cType} — ${cValue}\n\nВы выбрали:\n${filtered}`;
    p.style.display = "block";
    setTimeout(() => p.style.display = "none", 8000);
    e.target.reset();
  } catch (err) {
    console.error("EmailJS:", err);
    alert(`Ошибка отправки: ${err.text || err.message || err}`);
  }
});