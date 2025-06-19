function closePopup(){
  document.getElementById("popup").classList.add("hidden");
}

document.getElementById("order-form").addEventListener("submit",async function(e){
  e.preventDefault();

  const fd = new FormData(this);
  const name   = fd.get("name").trim();
  const method = fd.get("contactMethod");
  const handle = fd.get("contactHandle").trim();
  const comment= fd.get("comment").trim();

  /* собираем только input[type=number] внутри .dish */
  const dishInputs = this.querySelectorAll(".dish input[type='number']");
  const ordered    = [];
  dishInputs.forEach(inp=>{
    const qty = parseInt(inp.value) || 0;
    if(qty>0) ordered.push(`${inp.name} — ${qty}`);
  });

  if(!ordered.length){
    alert("Выберите хотя бы одно блюдо.");
    return;
  }

  /* сообщение для Web3Forms и всплывашки */
  const orderListTxt = ordered.map((x,i)=>`${i+1}. ${x}`).join("\n");
  const web3Message  = `
Имя: ${name}
Контакт: ${method} — ${handle}
Комментарий: ${comment}

Состав заказа:
${orderListTxt}
  `.trim();

  /* формируем payload для Web3Forms */
  const payload = {
    access_key : "14d92358-9b7a-4e16-b2a7-35e9ed71de43",
    subject    : "Новая заявка Yummy",
    to         : "stassser@gmail.com",
    from_name  : name,
    message    : web3Message
  };

  /* показываем всплывашку */
  const popupMsg = `${name}! Ваша заявка отправлена!\n\nВаш заказ:\n${orderListTxt}\n\nВ ближайшее время с вами свяжутся.\nБлагодарим, что выбрали YUMMY!`;
  document.getElementById("popup-message").innerText = popupMsg;
  document.getElementById("popup").classList.remove("hidden");

  try{
    const res = await fetch("https://api.web3forms.com/submit",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify(payload)
    }).then(r=>r.json());

    if(!res.success) alert("Ошибка отправки: "+res.message);
    this.reset();
  }catch(err){
    alert("Ошибка соединения.");
    console.error(err);
  }
});