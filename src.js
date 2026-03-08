import * as chrono from "chrono-node";
import confetti from "canvas-confetti";

const birthdate = document.getElementById("birthdate");
const result = document.getElementById("result");
const isMac = navigator.platform.toUpperCase().includes("MAC");
const modKey = isMac ? "\u2318" : "Ctrl+";
const shiftMod = isMac ? "\u21e7" : "Shift+";
const copyIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
const checkIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

const WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
let currentAge = null;
let confettiTimeout = null;
let confettiFired = false;

function hasYear(str) {
  const parsed = chrono.parse(str);
  if (!parsed.length) return false;
  return parsed[0].start.isCertain("year");
}

function isPast(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date <= today;
}

birthdate.focus();

// Auto-fill from page selection when popup opens
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (!tabs[0]?.id) return;
  chrome.scripting.executeScript({
    target: { tabId: tabs[0].id },
    func: () => window.getSelection().toString(),
  }, (results) => {
    const selection = results?.[0]?.result?.trim();
    if (selection) {
      birthdate.value = selection;
      birthdate.dispatchEvent(new Event("input"));
    }
  });
});

birthdate.addEventListener("input", () => {
  const val = birthdate.value.trim();
  if (!val) {
    currentAge = null;
    result.textContent = "";
    result.className = "";
    return;
  }

  const parsed = chrono.parseDate(val);
  if (parsed && hasYear(val) && isPast(parsed)) {
    showAge(parsed);
  } else {
    currentAge = null;
    result.textContent = "";
    result.className = "";
    if (confettiTimeout) {
      clearTimeout(confettiTimeout);
      confettiTimeout = null;
    }
    confettiFired = false;
  }
});

birthdate.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;

  const val = birthdate.value.trim();
  if (!val) return;

  const parsed = chrono.parseDate(val);
  if (!parsed || !hasYear(val)) {
    result.textContent = "Please include a year, e.g. \"Mar 6 1990\" or \"3/6/90\".";
    result.className = "error";
  } else if (!isPast(parsed)) {
    result.textContent = "That date is in the future!";
    result.className = "error";
  } else {
    showAge(parsed);
  }
});

document.addEventListener("keydown", (e) => {
  if (currentAge === null) return;
  const mod = e.metaKey || e.ctrlKey;
  if (!mod || e.key.toLowerCase() !== "c") return;

  e.preventDefault();
  if (e.shiftKey && currentAge >= 0 && currentAge <= 9) {
    copyWithFeedback("word");
  } else {
    copyWithFeedback("number");
  }
});

function copyWithFeedback(type) {
  const text = type === "word" ? WORDS[currentAge] : String(currentAge);
  navigator.clipboard.writeText(text);

  const btn = document.getElementById("copy-" + type);
  if (btn) {
    const icon = btn.querySelector("svg");
    const orig = icon.outerHTML;
    icon.outerHTML = checkIcon;
    setTimeout(() => { btn.querySelector("svg").outerHTML = orig; }, 800);
  }
}

function showAge(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const today = new Date();
  const ty = today.getFullYear();
  const tm = today.getMonth() + 1;
  const td = today.getDate();

  let age = ty - year;
  if (tm < month || (tm === month && td < day)) {
    age--;
  }

  currentAge = age;
  result.className = "";

  const hasWord = age >= 0 && age <= 9;
  let html = `<div class="age-row">
    <span class="age">${age}</span>
    <button class="copy-btn" id="copy-number" type="button">${copyIcon} ${modKey}C</button>
  </div>`;
  if (hasWord) {
    html += `<div class="age-row word-row">
      <span class="age">${WORDS[age]}</span>
      <button class="copy-btn" id="copy-word" type="button">${copyIcon} ${shiftMod}${modKey}C</button>
    </div>`;
  }

  result.innerHTML = html;

  document.getElementById("copy-number").addEventListener("click", () => copyWithFeedback("number"));
  if (hasWord) {
    document.getElementById("copy-word").addEventListener("click", () => copyWithFeedback("word"));
  }

  // Confetti on birthday
  if (month === tm && day === td) {
    if (!confettiFired) {
      if (confettiTimeout) clearTimeout(confettiTimeout);
      confettiTimeout = setTimeout(() => {
        confettiFired = true;
        confetti({
          particleCount: 80,
          spread: 90,
          origin: { x: 0.0, y: 1 },
          angle: 30,
          startVelocity: 11,
          gravity: 0.5,
          ticks: 400,
          decay: 0.95,
          colors: ["#FA7A55", "#67BAE8", "#5BC4BD", "#A6CE39", "#B0ABD5", "#FDB929"],
        });
      }, 500);
    }
  }
}
