const form   = document.getElementById("orderForm");
const popup  = document.getElementById("popup");
const msgBox = document.getElementById("popup-message");

/* заполняем все select.qty вариантами  – ,0…6 */
document.querySelectorAll("select.qty").forEach(sel=>{
  sel.innerHTML = '<option value="" selected hidden></option>' +
                  [...Array(7).keys()].map(n=>`<option value="${n}">${n}</option>`).join("");
});

form.addEventListener("submit",async e=>{
  e.preventDefault();

  const fd   = new FormData(form);
  const name = fd.get("name");
  const meth = fd.get("contactMethod");
  const hand = fd.get("contactHandle");
  const comm = fd.get("comment");

  /* собираем блюда */
  const items=[];
  document.querySelectorAll("select.qty").forEach(sel=>{
    const q = parseInt(sel.value)||0;
    if(q>0) items.push(`${sel.name} — ${q}`);
  });
  if(!items.length){alert("Выберите хотя бы одно блюдо.");return;}

  /* popup сообщение */
  msgBox.innerHTML = `
<pre style="font-family:Arial;font-size:16px;white-space:pre-line;">
${name}!
Ваша заявка отправлена!

Ваш заказ:
${items.map((x,i)=>`${i+1}. ${x}`).join("\n")}

В ближайшее время с вами свяжутся.
Благодарим, что выбрали YUMMY!
</pre>`.trim();
  popup.classList.remove("hidden");

  /* письмо через Web3Forms */
  const payload = {
    access_key:"14d92358-9b7a-4e16-b2a7-35e9ed71de43",
    subject:"Новый заказ Yummy",
    from_name:"Yummy Form",
    message:`Имя: ${name}\nКонтакт: ${meth} - ${hand}\nКомментарий: ${comm}\n\nЗаказ:\n${items.join("\n")}`,
    name:name
  };
  try{
    const r=await fetch("https://api.web3forms.com/submit",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(payload)
    }).then(r=>r.json());
    if(!r.success) alert("Ошибка отправки: "+r.message);
    form.reset();
  }catch(err){alert("Ошибка сети");}
});

function closePopup(){popup.classList.add("hidden");}