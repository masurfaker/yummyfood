/* 1) инициализация EmailJS  */
emailjs.init("u7NXPBbhemkcB7EGM");               //  ← твой Public Key

/* 2) обработчик формы */
document.getElementById("orderForm")
  .addEventListener("submit", async e=>{
    e.preventDefault();

    const f  = e.target;
    const fd = new FormData(f);

    /* базовые данные */
    const name          = fd.get("name").trim();
    const email         = fd.get("email").trim();
    const contact_type  = fd.get("contact_type");
    const contact_value = fd.get("contact_value").trim();
    const comment       = fd.get("comment").trim();

    /* формируем перечни блюд */
    let full     = "";
    let filtered = "";
    let qty      = 0;

    fd.forEach((v,k)=>{
      if(!["name","email","contact_type","contact_value","comment"].includes(k)){
        const n = parseInt(v)||0;
        full     += `${k} — ${n}\n`;
        if(n>0){ filtered += `${k} — ${n}\n`; qty+=n; }
      }
    });

    if(qty===0){
      alert("Выберите хотя бы одно блюдо 😊");
      return;
    }

    /* параметры для почты */
    const adminParams = {
      name,
      email,
      contact_type,
      contact_value,
      comment,
      Order: full               //  {{Order}}  в  template_admin
    };

    const clientParams = {
      name,
      email,
      comment,
      contactMethod: contact_type,   // {{contactMethod}}
      contactvalue : contact_value,  // {{contactvalue}}
      filteredOrder: filtered        // {{filteredOrder}} в template_customer
    };

    try{
      await emailjs.send("service_p7e7ykn","template_admin"   ,adminParams);
      await emailjs.send("service_p7e7ykn","template_customer",clientParams);

      /* всплывающее окно-чек */
      const pop = document.getElementById("popup");
      pop.textContent =
        `${name}, спасибо за заявку!\n\n`+
        `Контакт: ${contact_type} — ${contact_value}\n\n`+
        `Вы выбрали:\n${filtered}`+
        (comment?`\nКомментарий: ${comment}`:"");
      pop.style.display="block";
      setTimeout(()=>pop.style.display="none",8000);

      f.reset();
    }catch(err){
      console.error("EmailJS:",err);       // смотри консоль → причина ошибки
      alert("Не удалось отправить письма — проверь консоль ⚠️");
    }
});