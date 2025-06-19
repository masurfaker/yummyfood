/* 1. Инициализируем EmailJS */
emailjs.init("u7NXPBbhemkcB7EGM");   // Public Key

/* 2. Обработчик отправки формы */
document.getElementById("orderForm").addEventListener("submit", async e=>{
  e.preventDefault();
  const fd = new FormData(e.target);

  const name   = fd.get("name").trim();
  const email  = fd.get("email").trim();
  const cType  = fd.get("contact_type");
  const cValue = fd.get("contact_value").trim();
  const comment= fd.get("comment").trim();

  /* собираем заказ */
  let full="", filtered=""; let qty=0;
  fd.forEach((v,k)=>{
    if(!["name","email","contact_type","contact_value","comment"].includes(k)){
      const n=parseInt(v)||0;
      full += `${k} — ${n}\n`;
      if(n>0){ filtered += `${k} — ${n}\n`; qty+=n; }
    }
  });
  if(qty===0){ alert("Выберите хотя бы одно блюдо"); return; }

  /* параметры в шаблоны */
  const adminParams={
    name,
    email,
    contact_type:cType,
    contact_value:cValue,
    comment,
    Order:full                 //  {{Order}}
  };
  const clientParams={
    name,
    email,
    comment,
    contactMethod:cType,       //  {{contactMethod}}
    contactvalue:cValue,       //  {{contactvalue}}
    filteredOrder:filtered     //  {{filteredOrder}}
  };

  try{
    /* реальные ID шаблонов */
    await emailjs.send("service_p7e7ykn","hwcno8p", adminParams);  // admin
    await emailjs.send("service_p7e7ykn","a4vqdxr", clientParams); // customer

    /* всплывашка */
    const pop=document.getElementById("popup");
    pop.textContent=
      `${name}, спасибо за заявку!\n\n` +
      `Контакт: ${cType} — ${cValue}\n\n` +
      `Вы выбрали:\n${filtered}` +
      (comment?`\nКомментарий: ${comment}`:"");
    pop.style.display="block";
    setTimeout(()=>pop.style.display="none",8000);
    e.target.reset();

  }catch(err){
    console.error("EmailJS:",err);
    alert(`Ошибка отправки: ${err.text||err.message||err}`);
  }
});