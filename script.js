// Инициализация EmailJS
emailjs.init("u7NXPBbhemkcB7EGM");

document.getElementById("orderForm").addEventListener("submit", async function(e){
  e.preventDefault();

  const form = e.target;
  const fd = new FormData(form);

  // базовые поля
  const name          = fd.get("name").trim();
  const email         = fd.get("email").trim();
  const contact_type  = fd.get("contact_type");
  const contact_value = fd.get("contact_value").trim();
  const comment       = fd.get("comment").trim();

  // формируем заказы
  let fullOrder = "";
  let filtered  = "";
  let totalQty  = 0;

  for (let [key,val] of fd.entries()){
    if(["name","email","contact_type","contact_value","comment"].includes(key)) continue;
    const q = parseInt(val)||0;
    fullOrder += `${key} — ${q}\n`;
    if(q>0){
      filtered += `${key} — ${q}\n`;
      totalQty += q;
    }
  }

  if(totalQty===0){
    alert("Выберите хотя бы одно блюдо 😊");
    return;
  }

  // параметры для EmailJS
  const adminParams = {
    name,
    email,
    contact_type,
    contact_value,
    comment,
    Order: fullOrder          // дОЛЖЕН совпасть c {{Order}} в template_admin
  };

  const clientParams = {
    name,
    email,
    comment,
    contactMethod: contact_type, // {{contactMethod}}
    contactvalue: contact_value, // {{contactvalue}}
    filteredOrder: filtered      // {{filteredOrder}} в template_customer
  };

  try{
    await emailjs.send("service_p7e7ykn","template_admin",adminParams);
    await emailjs.send("service_p7e7ykn","template_customer",clientParams);

    // показываем всплывашку
    const popup = document.getElementById("popup");
    popup.textContent =
      `${name}! Благодарим за заявку.\n\n` +
      `Ваш контакт: ${contact_type} — ${contact_value}\n\n` +
      `Вы выбрали:\n${filtered}\n` +
      (comment ? `Комментарий: ${comment}\n\n` : '') +
      `Мы скоро свяжемся с вами.`;
    popup.style.display="block";
    setTimeout(()=>popup.style.display="none",8000);
    form.reset();
  }catch(err){
    console.error("EmailJS error:",err);
    alert("Ошибка при отправке письма. Проверьте консоль.");
  }
});