/* EkskulHub: data, UI, LocalStorage, form, member card, admin, Casper */
(() => {
  "use strict";
  const $ = (selector, root=document) => root.querySelector(selector);
  const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
  const STORAGE = {members:"ekskulhub_members_v1", clubs:"ekskulhub_clubs_v1", theme:"ekskulhub_theme", effects:"ekskulhub_reduce_effects", draft:"ekskulhub_form_draft"};
  const categories = ["Semua","Teknologi & Media","Bela Diri & Kepanduan","Seni & Musik","Bahasa & Keagamaan","Olahraga"];
  const defaultClubs = [
    {id:"jurnalistik",name:"Jurnalistik",category:categories[1],icon:"📰",description:"Mengasah kemampuan menulis, mencari informasi, fotografi, dan menyampaikan cerita melalui media sekolah.",activity:"Peliputan kegiatan, penulisan berita, wawancara, fotografi, dan penerbitan konten.",schedule:"Contoh: Jumat, 14.00–16.00",coach:"Contoh: Pembina Jurnalistik",quota:30},
    {id:"faster",name:"FASTER (Robotics & Tech)",category:categories[1],icon:"🤖",description:"Ruang eksplorasi teknologi, robotika, pemrograman, dan pemecahan masalah kreatif.",activity:"Proyek robotika, coding dasar, elektronika, dan pameran karya.",schedule:"Contoh: Rabu, 15.00–17.00",coach:"Contoh: Pembina FASTER",quota:25},
    {id:"pmr",name:"Palang Merah Remaja (PMR)",category:categories[2],icon:"➕",description:"Belajar kepedulian, pertolongan pertama, kesehatan remaja, dan kerja kemanusiaan.",activity:"Materi kepalangmerahan, simulasi pertolongan pertama, dan kegiatan sosial.",schedule:"Contoh: Kamis, 15.00–16.30",coach:"Contoh: Pembina PMR",quota:35},
    {id:"paskibra",name:"Paskibra",category:categories[2],icon:"🇮🇩",description:"Membangun kedisiplinan, kekompakan, kepemimpinan, dan tanggung jawab.",activity:"Latihan baris-berbaris, formasi, kepemimpinan, dan persiapan upacara.",schedule:"Contoh: Selasa & Jumat, 15.00–17.00",coach:"Contoh: Pembina Paskibra",quota:35},
    {id:"pencak-silat",name:"Pencak Silat",category:categories[2],icon:"🥋",description:"Mengenal seni bela diri tradisional sekaligus melatih disiplin, fokus, dan sportivitas.",activity:"Latihan dasar, jurus, kebugaran, seni gerak, dan penguatan karakter.",schedule:"Contoh: Rabu, 15.30–17.00",coach:"Contoh: Pelatih Pencak Silat",quota:30},
    {id:"bantara",name:"Bantara (Pramuka Penegak)",category:categories[2],icon:"🏕️",description:"Mengembangkan kemandirian, kepemimpinan, keterampilan lapangan, dan kepedulian.",activity:"Kepramukaan, tali-temali, pioneering, kegiatan alam, dan pengabdian.",schedule:"Contoh: Sabtu, 08.00–10.00",coach:"Contoh: Pembina Pramuka",quota:40},
    {id:"tari",name:"Tari (Kreasi & Modern)",category:categories[3],icon:"💃",description:"Mengeksplorasi gerak, ekspresi, kreativitas, serta kekayaan tari tradisional dan modern.",activity:"Teknik gerak, koreografi, latihan kelompok, dan penampilan.",schedule:"Contoh: Selasa, 15.00–16.30",coach:"Contoh: Pembina Tari",quota:30},
    {id:"marching-band",name:"Marching Band (Drumband)",category:categories[3],icon:"🥁",description:"Menggabungkan musik, ritme, koordinasi, dan kerja sama dalam pertunjukan.",activity:"Latihan alat musik, baris-berbaris, formasi, dan penampilan.",schedule:"Contoh: Jumat, 15.00–17.00",coach:"Contoh: Pembina Marching Band",quota:40},
    {id:"robbana",name:"Robbana (Hadroh & Rebana)",category:categories[3],icon:"🪘",description:"Wadah untuk mempelajari musik hadroh dan rebana dalam suasana kebersamaan.",activity:"Latihan ritme, vokal, kekompakan, dan penampilan kelompok.",schedule:"Contoh: Kamis, 15.00–16.30",coach:"Contoh: Pembina Robbana",quota:25},
    {id:"padus",name:"Padus (Paduan Suara)",category:categories[3],icon:"🎤",description:"Mengembangkan teknik vokal, harmoni, kepekaan musikal, dan percaya diri.",activity:"Pemanasan vokal, latihan lagu, pembagian suara, dan penampilan.",schedule:"Contoh: Senin, 15.00–16.30",coach:"Contoh: Pembina Paduan Suara",quota:35},
    {id:"nihon-club",name:"Bahasa Jepang (Nihon Club)",category:categories[4],icon:"🇯🇵",description:"Mengenal bahasa dan budaya Jepang melalui kegiatan belajar yang menyenangkan.",activity:"Kosakata, percakapan dasar, pengenalan budaya, dan permainan edukatif.",schedule:"Contoh: Rabu, 14.30–16.00",coach:"Contoh: Pembina Nihon Club",quota:30},
    {id:"rohis",name:"Rohis (Kerohanian Islam)",category:categories[4],icon:"☪️",description:"Ruang pembinaan keagamaan, akhlak, kebersamaan, dan kegiatan positif.",activity:"Diskusi, kajian, kegiatan sosial, dan peringatan hari besar Islam.",schedule:"Contoh: Jumat, 13.30–15.00",coach:"Contoh: Pembina Rohis",quota:35},
    {id:"futsal",name:"Futsal",category:categories[5],icon:"⚽",description:"Melatih teknik permainan, strategi, kebugaran, dan sportivitas dalam tim.",activity:"Latihan teknik, taktik, pertandingan persahabatan, dan kebugaran.",schedule:"Contoh: Selasa & Kamis, 15.30–17.00",coach:"Contoh: Pelatih Futsal",quota:25},
    {id:"volly",name:"Volly (Bola Voli)",category:categories[5],icon:"🏐",description:"Mengembangkan koordinasi, teknik bola voli, komunikasi, dan semangat tim.",activity:"Passing, servis, smash, block, strategi, dan pertandingan.",schedule:"Contoh: Senin & Rabu, 15.30–17.00",coach:"Contoh: Pelatih Bola Voli",quota:25}
  ];
  const read = (key, fallback) => { try { const value=localStorage.getItem(key); return value===null?fallback:JSON.parse(value); } catch { return fallback; } };
  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  let clubs = read(STORAGE.clubs, null);
  if (!Array.isArray(clubs) || clubs.length !== 14) { clubs=defaultClubs.map(x=>({...x})); write(STORAGE.clubs,clubs); }
  let members = read(STORAGE.members, []);
  if (!Array.isArray(members)) members=[];
  let activeCategory="Semua", activeMemberId=null, adminIsLoggedIn=false;
  const clubById = id => clubs.find(c=>c.id===id);
  const escapeHTML = value => String(value??"").replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const toast = message => { const el=$("#toast");el.textContent=message;el.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove("show"),2600); };
  const saveMembers = () => { write(STORAGE.members,members); updateStats(); if(adminIsLoggedIn) renderDashboard(); };
  function renderFilters(){ $("#categoryFilters").innerHTML=categories.map(c=>`<button class="filter-pill ${c===activeCategory?"active":""}" data-category="${escapeHTML(c)}">${escapeHTML(c)}</button>`).join(""); }
  function renderClubs(){
    const term=$("#ekskulSearch").value.trim().toLowerCase();
    const shown=clubs.filter(c=>(activeCategory==="Semua"||c.category===activeCategory)&&(`${c.name} ${c.category}`.toLowerCase().includes(term)));
    $("#clubGrid").innerHTML=shown.length?shown.map(c=>`<article class="club-card"><div class="club-icon">${c.icon}</div><span class="club-category">${escapeHTML(c.category)}</span><h3>${escapeHTML(c.name)}</h3><p>${escapeHTML(c.description)}</p><div class="club-card-bottom"><small>Kuota contoh: ${Number(c.quota)||0} orang</small><button class="text-link" data-detail="${c.id}">Lihat detail ↗</button></div></article>`).join(""):`<div class="empty-results">Tidak ada ekstrakurikuler yang cocok dengan pencarianmu.</div>`;
    $("#clubSelect").innerHTML='<option value="">Pilih ekstrakurikuler</option>'+clubs.map(c=>`<option value="${c.id}">${escapeHTML(c.name)}</option>`).join("");
    $("#memberFilter").innerHTML='<option value="">Semua ekstrakurikuler</option>'+clubs.map(c=>`<option value="${c.id}">${escapeHTML(c.name)}</option>`).join("");
    $("#statEkskul").textContent=clubs.length;
  }
  function updateStats(){ $("#statAnggota").textContent=members.length; }
  function showClubDetail(id){
    const c=clubById(id);if(!c)return;
    $("#modalContent").innerHTML=`<div class="modal-icon">${c.icon}</div><span class="eyebrow">${escapeHTML(c.category)}</span><h2 id="modalTitle">${escapeHTML(c.name)}</h2><p>${escapeHTML(c.description)}</p><p><b>Kegiatan:</b> ${escapeHTML(c.activity)}</p><div class="modal-facts"><div><small>Jadwal latihan</small><b>${escapeHTML(c.schedule)}</b></div><div><small>Pembina</small><b>${escapeHTML(c.coach)}</b></div><div><small>Kuota contoh</small><b>${Number(c.quota)||0} anggota</b></div><div><small>Anggota demo</small><b>${members.filter(m=>m.clubId===id).length} anggota</b></div></div><a class="btn btn-primary" href="#daftar" data-modal-register="${id}">Daftar ekstrakurikuler →</a>`;
    $("#clubModal").classList.remove("hidden");
  }
  function closeModal(){ $("#clubModal").classList.add("hidden"); }
 function setFieldError(input, message) {
  const field = input.closest(".field");

  input.classList.toggle("invalid", !!message);
  input.classList.toggle("valid", !message);

  const err = field?.querySelector(".field-error");

  if (err) err.textContent = message || "";
}
  const formFields=["fullName","className","email","phone","password","confirmPassword","clubSelect"];
  function progress(){const count=formFields.filter(id=>String($("#"+id).value).trim()).length;const percent=Math.round(count/formFields.length*100);$("#formProgress").style.width=percent+"%";$("#formProgressText").textContent=percent+"% lengkap";}
  function draftData(){const data={};["fullName","className","email","phone","clubSelect"].forEach(id=>data[id]=$("#"+id).value);return data;}
  function saveDraft(){write(STORAGE.draft,draftData());}
  function restoreDraft(){const d=read(STORAGE.draft,{});Object.entries(d).forEach(([id,value])=>{const el=$("#"+id);if(el)el.value=value;});progress();}
  function validateForm(){
    let valid=true;const name=$("#fullName"),klass=$("#className"),email=$("#email"),phone=$("#phone"),pass=$("#password"),confirm=$("#confirmPassword"),club=$("#clubSelect");
    const checks=[
      [name,name.value.trim().length>=3?"":"Nama minimal 3 karakter."],
      [klass,klass.value?"":"Pilih kelas."],
      [email,/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())?"":"Format email belum valid."],
      [phone,/^(?:\+62|62|0)8[1-9][0-9]{6,11}$/.test(phone.value.replace(/[\s-]/g,""))?"":"Masukkan nomor WhatsApp Indonesia yang valid."],
      [pass,pass.value.length>=8?"":"Password minimal 8 karakter."],
      [confirm,confirm.value===pass.value&&confirm.value?"":"Konfirmasi password tidak cocok."],
      [club,club.value&&clubById(club.value)?"":"Pilih ekstrakurikuler."]
    ];
    checks.forEach(([el,msg])=>{setFieldError(el,msg);if(msg)valid=false;});
    if(members.some(m=>m.email.toLowerCase()===email.value.trim().toLowerCase())){setFieldError(email,"Email sudah terdaftar.");valid=false;}
    if(members.some(m=>m.phone===phone.value.replace(/[\s-]/g,""))){setFieldError(phone,"Nomor WhatsApp sudah terdaftar.");valid=false;}
    return valid;
  }
  function generateMemberNumber(){let n;do{n="EH-"+new Date().getFullYear()+"-"+String(Math.floor(100000+Math.random()*900000));}while(members.some(m=>m.memberNo===n));return n;}
  function handleRegistration(event){
    event.preventDefault();$("#formMessage").textContent="";$("#formMessage").className="form-message";
    if(!validateForm()){$("#formMessage").textContent="Periksa kembali kolom yang ditandai.";$("#formMessage").classList.add("error");return;}
    const email=$("#email").value.trim().toLowerCase(),phone=$("#phone").value.replace(/[\s-]/g,"");
    const member={id:"m_"+Date.now().toString(36)+Math.random().toString(36).slice(2,7),memberNo:generateMemberNumber(),name:$("#fullName").value.trim(),className:$("#className").value,email,phone,clubId:$("#clubSelect").value,createdAt:new Date().toISOString()};
    // Password sengaja tidak disimpan. Tanpa backend, autentikasi anggota tidak dapat diamankan.
    members.push(member);saveMembers();localStorage.removeItem(STORAGE.draft);$("#registrationForm").reset();progress();
    $("#formMessage").textContent="Pendaftaran berhasil! Kartu anggota digitalmu sudah dibuat.";$("#formMessage").classList.add("success");
    renderMemberCard(member);toast("Pendaftaran berhasil. Selamat bergabung!");$("#kartu").scrollIntoView({behavior:"smooth"});
  }
  function qrPattern(seed){
    let bits="";let hash=0;for(let i=0;i<seed.length;i++)hash=(hash*31+seed.charCodeAt(i))>>>0;
    for(let i=0;i<225;i++){hash=(hash*1664525+1013904223)>>>0;bits+=(hash>>>30)&1?"1":"0";}
    const cells=bits.split("").map((b,i)=>`<rect x="${(i%15)*4}" y="${Math.floor(i/15)*4}" width="4" height="4" fill="${b==="1"?"#473444":"#fff"}"/>`).join("");
    return `<svg class="qr-visual" viewBox="0 0 60 60" role="img" aria-label="Kode visual identitas"><rect width="60" height="60" fill="white"/>${cells}</svg>`;
  }
  function renderMemberCard(member){
    if(!member){$("#memberArea").innerHTML=`<div class="empty-card"><span>✿</span><h3>Belum ada kartu anggota</h3><p>Lengkapi pendaftaran untuk membuat kartu digital pertamamu.</p><a class="btn btn-primary" href="#daftar">Isi formulir</a></div>`;return;}
    const club=clubById(member.clubId)||{name:"Ekstrakurikuler",coach:"Belum ditentukan",schedule:"Belum ditentukan"};
    $("#memberArea").innerHTML=`<div><div class="member-card-wrap"><div class="member-card" id="memberCard" role="button" tabindex="0" aria-label="Balik kartu anggota"><div class="member-face member-front"><div class="card-brand"><span>✿</span> EKSKULHUB</div><div class="card-label">KARTU ANGGOTA DIGITAL</div><div class="card-member-name">${escapeHTML(member.name)}</div><div class="card-detail">${escapeHTML(member.email)}</div><div class="card-detail">${escapeHTML(club.name)}</div><div class="card-footer"><span class="card-number">${escapeHTML(member.memberNo)}</span><span class="card-hint">KLIK UNTUK MEMBALIK ↻</span></div></div><div class="member-face member-back"><div class="card-brand">EKSKULHUB · SMA 1 PRESTASI BANGSA</div><div class="card-back-content"><h3>${escapeHTML(member.name)}</h3><p>Kelas: ${escapeHTML(member.className)}</p><p>Ekstrakurikuler: ${escapeHTML(club.name)}</p><p>Pembina: ${escapeHTML(club.coach)}</p><p>Jadwal: ${escapeHTML(club.schedule)}</p></div>${qrPattern(member.memberNo)}<div class="card-footer"><span class="card-number">${escapeHTML(member.memberNo)}</span><span class="card-hint">IDENTITAS DEMO LOKAL</span></div></div></div></div><div class="card-actions"><button class="btn btn-primary" id="downloadCard">Unduh kartu PNG ↓</button><button class="btn btn-outline" id="flipCard">Balik kartu ↻</button></div><p class="muted" style="text-align:center;margin-top:12px">Kartu ini merupakan identitas digital demo, bukan kartu resmi sekolah.</p></div>`;
    const card=$("#memberCard");const flip=()=>card.classList.toggle("flipped");card.addEventListener("click",flip);card.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();flip();}});$("#flipCard").addEventListener("click",flip);$("#downloadCard").addEventListener("click",()=>downloadMemberPNG(member));
  }
  function roundedRect(ctx,x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r);}
  function downloadMemberPNG(member){
    const club=clubById(member.clubId)||{};const canvas=document.createElement("canvas");canvas.width=1000;canvas.height=630;const ctx=canvas.getContext("2d");
    const gradient=ctx.createLinearGradient(0,0,1000,630);gradient.addColorStop(0,"#f9e6ef");gradient.addColorStop(.55,"#edc3d8");gradient.addColorStop(1,"#d991b6");ctx.fillStyle=gradient;roundedRect(ctx,0,0,1000,630,45);ctx.fill();
    ctx.fillStyle="rgba(255,255,255,.22)";ctx.beginPath();ctx.arc(900,600,300,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(80,40,180,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#6d4059";ctx.font="bold 32px Arial";ctx.fillText("✿  EKSKULHUB",65,85);ctx.font="bold 20px Arial";ctx.fillText("SMA 1 PRESTASI BANGSA",68,120);
    ctx.fillStyle="#9e5b7e";ctx.font="bold 18px Arial";ctx.fillText("KARTU ANGGOTA DIGITAL",68,210);
    ctx.fillStyle="#493344";ctx.font="bold 54px Georgia";ctx.fillText(member.name.slice(0,27),68,290);
    ctx.font="25px Arial";ctx.fillText(member.email.slice(0,42),68,345);ctx.fillText(club.name||"",68,395);
    ctx.font="bold 22px Arial";ctx.fillText("NOMOR ANGGOTA",68,495);ctx.font="bold 30px Arial";ctx.fillText(member.memberNo,68,540);
    ctx.textAlign="right";ctx.font="bold 100px Arial";ctx.fillStyle="rgba(255,255,255,.8)";ctx.fillText("✿",920,290);ctx.textAlign="left";
    ctx.fillStyle="#78536a";ctx.font="18px Arial";ctx.fillText("Kartu demo lokal · bukan dokumen resmi sekolah",68,590);
    const link=document.createElement("a");link.download=`Kartu-${member.memberNo}.png`;link.href=canvas.toDataURL("image/png");link.click();toast("Kartu PNG berhasil dibuat.");
  }
  function renderDashboard(){
    if(!adminIsLoggedIn)return;
    const counts=clubs.map(c=>({club:c,count:members.filter(m=>m.clubId===c.id).length}));
    $("#dashboardStats").innerHTML=`<div class="dash-stat"><b>${members.length}</b><span>Total anggota</span></div><div class="dash-stat"><b>${members.length}</b><span>Total pendaftar tersimpan</span></div><div class="dash-stat"><b>${clubs.length}</b><span>Ekstrakurikuler</span></div><div class="dash-stat"><b>${counts.filter(x=>x.count>0).length}</b><span>Ekskul dengan anggota</span></div>`;
    const term=$("#memberSearch").value.toLowerCase(),filter=$("#memberFilter").value;
    const filtered=members.filter(m=>(!filter||m.clubId===filter)&&(`${m.name} ${m.email} ${m.memberNo}`.toLowerCase().includes(term)));
    $("#memberTableBody").innerHTML=filtered.length?filtered.map(m=>`<tr><td>${escapeHTML(m.name)}<small>${escapeHTML(m.email)}</small></td><td>${escapeHTML(m.className)}</td><td>${escapeHTML(clubById(m.clubId)?.name||"Tidak diketahui")}</td><td>${escapeHTML(m.memberNo)}</td><td><button class="table-action" data-edit-member="${m.id}">Edit</button><button class="table-action danger" data-delete-member="${m.id}">Hapus</button></td></tr>`).join(""):`<tr><td colspan="5" class="muted">Belum ada data anggota yang cocok.</td></tr>`;
    $("#clubAdminList").innerHTML=clubs.map(c=>`<div class="club-admin-item"><div><b>${c.icon} ${escapeHTML(c.name)}</b><small>${escapeHTML(c.schedule)} · ${members.filter(m=>m.clubId===c.id).length} anggota</small></div><button class="table-action" data-edit-club="${c.id}">Edit info</button></div>`).join("");
  }
  function editMember(id){
    const m=members.find(x=>x.id===id);if(!m)return;
    const name=prompt("Nama anggota:",m.name);if(name===null)return;
    const className=prompt("Kelas (X, XI, XII):",m.className);if(className===null)return;
    const clubId=prompt("ID ekstrakurikuler (lihat daftar ID di bawah):\n"+clubs.map(c=>c.id+" = "+c.name).join("\n"),m.clubId);if(clubId===null)return;
    if(!name.trim()||!["X","XI","XII"].includes(className.trim())||!clubById(clubId.trim())){toast("Data edit tidak valid.");return;}
    m.name=name.trim();m.className=className.trim();m.clubId=clubId.trim();saveMembers();toast("Data anggota diperbarui.");
    if(activeMemberId===id)renderMemberCard(m);
  }
  function deleteMember(id){
    const m=members.find(x=>x.id===id);if(!m)return;
    if(!confirm(`Hapus data anggota ${m.name}? Tindakan ini tidak dapat dibatalkan.`))return;
    members=members.filter(x=>x.id!==id);saveMembers();if(activeMemberId===id){activeMemberId=null;renderMemberCard(null);}toast("Data anggota dihapus.");
  }
  function editClub(id){
    const c=clubById(id);if(!c)return;
    const description=prompt("Deskripsi ekstrakurikuler:",c.description);if(description===null)return;
    const schedule=prompt("Jadwal latihan:",c.schedule);if(schedule===null)return;
    const coach=prompt("Nama pembina:",c.coach);if(coach===null)return;
    const quota=Number(prompt("Kuota anggota:",c.quota));if(!Number.isInteger(quota)||quota<0){toast("Kuota harus berupa angka 0 atau lebih.");return;}
    c.description=description.trim();c.schedule=schedule.trim();c.coach=coach.trim();c.quota=quota;write(STORAGE.clubs,clubs);renderClubs();renderDashboard();toast("Informasi ekstrakurikuler diperbarui.");
  }
  function loginAdmin(e){e.preventDefault();if($("#adminUser").value==="admin"&&$("#adminPass").value==="ekskulhub123"){adminIsLoggedIn=true;$("#adminLogin").classList.add("hidden");$("#dashboard").classList.remove("hidden");renderDashboard();toast("Login demo admin berhasil.");}else toast("Username atau password demo salah.");}
  function logoutAdmin(){adminIsLoggedIn=false;$("#dashboard").classList.add("hidden");$("#adminLogin").classList.remove("hidden");$("#adminPass").value="";}
  function answerCasper(text){
    const q=text.toLowerCase();
    if(/daftar|pilihan|ekskul|ekstrakurikuler|klub/.test(q))return "EkskulHub memiliki 14 pilihan dalam 5 kategori: Teknologi & Media, Bela Diri & Kepanduan, Seni & Musik, Bahasa & Keagamaan, serta Olahraga. Kamu bisa melihat semuanya di bagian Daftar Ekskul. ✿";
    if(/kategori/.test(q))return "Lima kategorinya adalah Teknologi & Media, Bela Diri & Kepanduan, Seni & Musik, Bahasa & Keagamaan, dan Olahraga.";
    if(/jadwal|latihan|pembina/.test(q)){const c=clubs.find(x=>q.includes(x.name.toLowerCase())||q.includes(x.id));if(c)return `${c.name}: ${c.schedule}. Pembina: ${c.coach}. Catatan: informasi ini masih data contoh yang dapat diedit admin.`;return "Jadwal dan nama pembina ditampilkan pada detail masing-masing ekskul. Saat ini semuanya berupa data contoh, bukan jadwal resmi sekolah.";}
    if(/cara|bagaimana|pendaftaran|mendaftar|daftar/.test(q))return "Buka bagian Pendaftaran, isi tujuh kolom, periksa kembali data, lalu tekan Kirim pendaftaran. Jika berhasil, kartu anggota digital akan muncul otomatis.";
    if(/kartu|anggota|png|unduh/.test(q))return "Kartu anggota dibuat setelah pendaftaran berhasil. Klik kartu untuk membaliknya, lalu gunakan tombol Unduh kartu PNG untuk menyimpan gambar.";
    if(/admin|dashboard/.test(q))return "Dashboard admin ada di bagian bawah halaman. Login demo: username admin, password ekskulhub123. Ini hanya simulasi lokal, bukan keamanan produksi.";
    if(/tema|gelap|dark|terang|light/.test(q))return "Gunakan tombol bulan di navbar untuk berganti antara tema terang dan gelap. Preferensi disimpan di browser.";
    if(/casper|siapa kamu|halo|hai|help|bantuan/.test(q))return "Aku Casper, asisten virtual EkskulHub! Aku bisa bantu menjelaskan pilihan ekskul, pendaftaran, kartu anggota, dan dashboard. Tanyakan saja dengan kalimat sederhana. ☁";
    return "Aku belum memahami pertanyaan itu. Coba tanyakan tentang daftar ekskul, kategori, jadwal, cara pendaftaran, kartu anggota, atau dashboard admin. ✿";
  }
  function appendChat(message,who){const node=document.createElement("div");node.className="chat-bubble "+who;node.textContent=message;$("#chatMessages").append(node);$("#chatMessages").scrollTop=$("#chatMessages").scrollHeight;}
  function sendChat(message){const text=message.trim();if(!text)return;appendChat(text,"user");$("#chatInput").value="";setTimeout(()=>appendChat(answerCasper(text),"bot"),220);}
  function initSakura(){if(localStorage.getItem(STORAGE.effects)==="true")return;const layer=$("#sakuraLayer");for(let i=0;i<13;i++){const petal=document.createElement("span");petal.className="petal";petal.textContent=["✿","❀","·"][i%3];petal.style.left=(Math.random()*100)+"%";petal.style.animationDuration=(12+Math.random()*16)+"s";petal.style.animationDelay=(-Math.random()*25)+"s";petal.style.fontSize=(9+Math.random()*9)+"px";layer.append(petal);}}
  function setTheme(theme){document.documentElement.dataset.theme=theme;localStorage.setItem(STORAGE.theme,theme);$("#themeToggle").textContent=theme==="dark"?"☀":"☾";}
  function setReducedEffects(value){document.body.classList.toggle("reduce-effects",value);localStorage.setItem(STORAGE.effects,String(value));$("#sakuraLayer").style.display=value?"none":"";}
  // Event delegation for generated cards, table actions, and filters.
  document.addEventListener("click",e=>{
    const category=e.target.closest("[data-category]");if(category){activeCategory=category.dataset.category;renderFilters();renderClubs();}
    const detail=e.target.closest("[data-detail]");if(detail)showClubDetail(detail.dataset.detail);
    const reg=e.target.closest("[data-modal-register]");if(reg){const id=reg.dataset.modalRegister;closeModal();$("#clubSelect").value=id;$("#daftar").scrollIntoView({behavior:"smooth"});progress();}
    const edit=e.target.closest("[data-edit-member]");if(edit)editMember(edit.dataset.editMember);
    const del=e.target.closest("[data-delete-member]");if(del)deleteMember(del.dataset.deleteMember);
    const clubEdit=e.target.closest("[data-edit-club]");if(clubEdit)editClub(clubEdit.dataset.editClub);
  });
  $("#ekskulSearch").addEventListener("input",renderClubs);
  $("#modalClose").addEventListener("click",closeModal);$("#clubModal").addEventListener("click",e=>{if(e.target.id==="clubModal")closeModal();});
  $("#registrationForm").addEventListener("submit",handleRegistration);
  formFields.forEach(id=>$("#"+id).addEventListener("input",()=>{progress();saveDraft();if($("#"+id).classList.contains("invalid"))setFieldError($("#"+id),"");}));
  $("#clearDraft").addEventListener("click",()=>{localStorage.removeItem(STORAGE.draft);$("#registrationForm").reset();progress();toast("Draf formulir dihapus.");});
  $("#themeToggle").addEventListener("click",()=>setTheme(document.documentElement.dataset.theme==="dark"?"light":"dark"));
  const effectsToggle = $("#effectsToggle");
  if (effectsToggle) effectsToggle.addEventListener("click",()=>{const next=!document.body.classList.contains("reduce-effects");setReducedEffects(next);toast(next?"Mode hemat efek aktif.":"Animasi visual diaktifkan kembali.");});
  $("#adminLogin").addEventListener("submit",loginAdmin);$("#adminLogout").addEventListener("click",logoutAdmin);
  $("#memberSearch").addEventListener("input",renderDashboard);$("#memberFilter").addEventListener("change",renderDashboard);
  $("#mobileMenuBtn").addEventListener("click",()=>$("#navLinks").classList.toggle("open"));
  $$("#navLinks a").forEach(a=>a.addEventListener("click",()=>$("#navLinks").classList.remove("open")));
  $("#chatLauncher").addEventListener("click",()=>$("#chatPanel").classList.toggle("hidden"));$("#closeChat").addEventListener("click",()=>$("#chatPanel").classList.add("hidden"));
  $("#newChat").addEventListener("click",()=>{$("#chatMessages").innerHTML="";appendChat("Hai lagi! Aku Casper. Mau membahas apa? ✿","bot");});
  $("#chatForm").addEventListener("submit",e=>{e.preventDefault();sendChat($("#chatInput").value);});
  $$(".quick-questions button").forEach(b=>b.addEventListener("click",()=>sendChat(b.dataset.question)));
  $("#adminLogin").addEventListener("reset",()=>{});
  $("#year").textContent=new Date().getFullYear();
  // Restore only non-sensitive draft fields. Passwords are deliberately excluded.
  const savedTheme=localStorage.getItem(STORAGE.theme);setTheme(savedTheme==="dark"?"dark":"light");
  setReducedEffects(localStorage.getItem(STORAGE.effects)==="true");
  renderFilters();renderClubs();restoreDraft();updateStats();initSakura();
  const last=members[members.length-1];if(last){activeMemberId=last.id;renderMemberCard(last);}else renderMemberCard(null);
})();