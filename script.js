emailjs.init("u7NXPBbhemkcB7EGM");      // Public Key

document.getElementById("orderForm").addEventListener("submit", async e=>{
  e.preventDefault();
  const f=new FormData(e.target);

  const name=f.get("name").trim();
  const email=f.get("email").trim();
  const cType=f.get("contact_type");
  const cVal =f.get("contact_value").trim();
  const comment=f.get("comment").trim();

  let full="",filtered="",qty=0;
  f.forEach((v,k)=>{
    if(!["name","email","contact_type","contact_value","comment"].includes(k)){
      const n=parseInt(v)||0;
      full+=`${k} — ${n}\n`;
      if(n>0){filtered+=`${k} — ${n}\n`;qty+=n;}
    }
  });
  if(qty===0){alert("Выберите хотя бы одно блюдо");return;}

  const admin={
    name,email,
    contact_type:cType,
    contact_value:cVal,
    comment,
    Order:full
  };
  const client={
    name,email,
    comment,
    contactMethod:cType,
    contactvalue:cVal,
    filteredOrder:filtered
  };

  try{
    /* реальные Template ID */
    await emailjs.send("service_p7e7ykn","template_hwcno8p",admin);
    await emailjs.send("service_p7e7ykn","template_a4vqdxr",client);

    const p=document.getElementById("popup");
    p.textContent=
      `${name}, спасибо!\n\nКонтакт: ${cType} — ${cVal}\n\n`+
      `Вы выбрали:\n${filtered}`+
      (comment?`\nКомментарий: ${comment}`:"");
    p.style.display="block";
    setTimeout(()=>p.style.display="none",8000);
    e.target.reset();

  }catch(err){
    console.error("EmailJS:",err);
    alert(`Ошибка отправки: ${err.text||err.message||err}`);
  }
});