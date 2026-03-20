// ===== INITIALIZATION =====
function createPowerOptions(id, defaultValue) {
    let select = document.getElementById(id);
    if (!select) return;
    for (let i = 0; i <= 100000; i += 1000) {
        let opt = document.createElement("option");
        opt.value = i;
        opt.text = i.toLocaleString();
        select.appendChild(opt);
    }
    select.value = defaultValue;
}

function createSkillOptions(id) {
    let select = document.getElementById(id);
    if (!select) return;
    let zero = document.createElement("option");
    zero.value = 0; zero.text = "No Skill Bonus"; 
    select.appendChild(zero);
    for (let i = 2000; i <= 30000; i += 1000) {
        let opt = document.createElement("option");
        opt.value = i;
        opt.text = "+" + i.toLocaleString();
        select.appendChild(opt);
    }
}

// ===== TRIGGER / POWER SYSTEM =====
function addPower(id) {
    let el = document.getElementById(id + "_trigger");
    el.innerText = parseInt(el.innerText) + 1;
}

function addCrit(id) {
    let trg = document.getElementById(id + "_trigger");
    let crit = document.getElementById(id + "_crit");
    trg.innerText = parseInt(trg.innerText) + 1;
    crit.innerText = parseInt(crit.innerText) + 1;
}

function minusTrigger(id) {
    let el = document.getElementById(id + "_trigger");
    let val = parseInt(el.innerText);
    if (val > 0) el.innerText = val - 1;
}

// ฟังก์ชันลด Crit (เพิ่มใหม่)
function minusCrit(id) {
    let el = document.getElementById(id + "_crit");
    let val = parseInt(el.innerText);
    if (val > 1) { // ไม่ให้ต่ำกว่า 1
        el.innerText = val - 1;
    }
}

function frontTrigger() {
    ["l", "v", "r"].forEach(id => {
        let trg = document.getElementById(id + "_trigger");
        trg.innerText = parseInt(trg.innerText) + 1;
    });
}

// ===== CALCULATIONS =====
function getZoneTotal(id) {
    let base = parseInt(document.getElementById(id + "_base").value) || 0;
    let boost = parseInt(document.getElementById(id + "_boost").value) || 0;
    let skill = parseInt(document.getElementById(id + "_skill").value) || 0;
    let triggerCount = parseInt(document.getElementById(id + "_trigger").innerText) || 0;
    return base + boost + skill + (triggerCount * 10000);
}

function calcZone(id) {
    let total = getZoneTotal(id);
    let crit = document.getElementById(id + "_crit").innerText;
    document.getElementById(id + "_result").innerText = `รวม: ${total.toLocaleString()} | Crit: ${crit}`;
    updateHighlight();
}

function updateHighlight() {
    let l = getZoneTotal("l"), v = getZoneTotal("v"), r = getZoneTotal("r");
    let max = Math.max(l, v, r);
    ["l", "v", "r"].forEach(id => document.getElementById("box_" + id).classList.remove("active"));
    if (max > 0) {
        if (l === max) document.getElementById("box_l").classList.add("active");
        if (v === max) document.getElementById("box_v").classList.add("active");
        if (r === max) document.getElementById("box_r").classList.add("active");
    }
}

// ===== BATTLE ACTION =====
function setAttacker(id) {
    let total = getZoneTotal(id);
    let crit = document.getElementById(id + "_crit").innerText;
    document.getElementById("atk").innerText = total.toLocaleString();
    document.getElementById("atk_crit").innerText = crit;
    document.querySelectorAll(".box").forEach(b => b.classList.remove("attacker"));
    document.getElementById("box_" + id).classList.add("attacker");
}

function checkBattle() {
    let atkPower = parseInt(document.getElementById("atk").innerText.replace(/,/g, '')) || 0;
    let defBase = parseInt(document.getElementById("def").value) || 0;
    let shield = parseInt(document.getElementById("shield").value) || 0;
    let res = document.getElementById("battle_result");
    if (atkPower >= (defBase + shield)) {
        res.innerText = "✅ HIT! (ตีเข้า)";
        res.style.color = "#22c55e";
    } else {
        res.innerText = "❌ GUARDED (ไม่เข้า)";
        res.style.color = "#f43f5e";
    }
}

// ===== RANDOM SYSTEMS =====
function randomizeTurn() {
    let p1 = document.getElementById("p1_name").value || "Player 1";
    let p2 = document.getElementById("p2_name").value || "Player 2";
    let res = document.getElementById("turn_result");
    res.innerText = "🎲 กำลังสุ่ม...";
    setTimeout(() => {
        let isP1First = Math.random() < 0.5;
        res.innerHTML = isP1First ? `🥇 <b>${p1}</b> ก่อน / 🥈 <b>${p2}</b> หลัง` : `🥇 <b>${p2}</b> ก่อน / 🥈 <b>${p1}</b> หลัง`;
    }, 500);
}

function randomOddEven() {
    let res = document.getElementById("odd_even_result");
    res.innerText = "🎲...";
    setTimeout(() => {
        let num = Math.floor(Math.random() * 10) + 1;
        let type = (num % 2 === 0) ? "คู่ (EVEN)" : "คี่ (ODD)";
        res.innerHTML = `เลข: ${num} -> <span style="color:#f59e0b;">${type}</span>`;
    }, 500);
}

// ===== RESET =====
function resetAll() {
    document.querySelectorAll("select").forEach(s => s.selectedIndex = 0);
    document.querySelectorAll("[id$=_trigger]").forEach(t => t.innerText = "0");
    document.querySelectorAll("[id$=_crit]").forEach(c => c.innerText = "1");
    document.querySelectorAll(".result").forEach(r => r.innerText = "รวม: -");
    document.querySelectorAll(".box").forEach(b => { b.classList.remove("active"); b.classList.remove("attacker"); });
    document.getElementById("atk").innerText = "0";
    document.getElementById("atk_crit").innerText = "1";
    document.getElementById("battle_result").innerText = "ผล: -";
    document.getElementById("turn_result").innerText = "กดเพื่อสุ่ม";
    document.getElementById("odd_even_result").innerText = "กดเพื่อสุ่ม";
}

window.onload = function() {
    ["l", "v", "r"].forEach(id => {
        createPowerOptions(id + "_base", 13000);
        createPowerOptions(id + "_boost", 8000);
        createSkillOptions(id + "_skill");
    });
};