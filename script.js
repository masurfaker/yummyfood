const form   = document.getElementById("orderForm");
const popup  = document.getElementById("popup");
const msgBox = document.getElementById("popup-message");

/* заполняем каждый .qty: "-", 1–6 */
document.querySelectorAll("select.qty").forEach(sel=>{
  sel.innerHTML='<option value="" selected>-</option>'+
                [...Array(6)].map((_,i)=>`<option value="${i+1}">${i+1}</option>`).join("");
});

form.addEventListener("submit",async e=>{
  e.preventDefault();

  const fd=new FormData(form);
  const name=fd.get("name"), meth=fd.get("contactMethod"),
        handle=fd.get("contactHandle"), comm=fd.get("comment");

  const items=[];
  document.querySelectorAll("select.qty").forEach(sel=>{
    const q=parseInt(sel.value)||0;
    if(q>0) items.push(`${sel.name} — ${q}`);
  });

  if(!items.length){alert("Выберите хотя бы одно блюдо.");return;}

  msgBox.innerHTML=
`<pre>
${name}!
Ваша заявка отправлена!

Ваш заказ:
${items.map((x,i)=>`${i+1}. ${x}`).join("\n")}

В ближайшее время с вами свяжутся.
Благодарим, что выбрали YUMMY!
</pre>`;
  popup.classList.remove("hidden");

  /* письмо */
  const payload={
    access_key:"14d92358-9b7a-4e16-b2a7-35e9ed71de43",
    subject:"Новый заказ Yummy",
    from_name:"Yummy Form",
    message:`Имя: ${name}\nКонтакт: ${meth} - ${handle}\nКомментарий: ${comm}\n\nЗаказ:\n${items.join("\n")}`,
    name:name
  };
  try{
    const res=await fetch("https://api.web3forms.com/submit",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)}).then(r=>r.json());
    if(!res.success) alert("Ошибка отправки: "+res.message);
    form.reset();
  }catch(err){alert("Ошибка сети.");}
});

function closePopup(){popup.classList.add("hidden");}