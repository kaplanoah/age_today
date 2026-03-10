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

const EVENTS = {
  "2008-05-02": { emoji: "🍿", text: "Iron Man launched the MCU" },
  "2008-07-18": { emoji: "🍿", text: "The Dark Knight opening day" },
  "2009-12-18": { emoji: "🍿", text: "Avatar opening day" },
  "2010-06-18": { emoji: "🍿", text: "Toy Story 3 opening day" },
  "2012-05-04": { emoji: "🍿", text: "The Avengers opening day" },
  "2013-11-27": { emoji: "🍿", text: "Frozen opening day" },
  "2015-06-19": { emoji: "🍿", text: "Inside Out opening day" },
  "2015-12-18": { emoji: "🍿", text: "Star Wars: The Force Awakens opening day" },
  "2016-11-23": { emoji: "🍿", text: "Moana opening day" },
  "2017-11-22": { emoji: "🍿", text: "Coco opening day" },
  "2018-02-16": { emoji: "🍿", text: "Black Panther opening day" },
  "2018-04-27": { emoji: "🍿", text: "Avengers: Infinity War opening day" },
  "2018-06-15": { emoji: "🍿", text: "Incredibles 2 opening day" },
  "2018-12-14": { emoji: "🍿", text: "Spider-Man: Into the Spider-Verse opening day" },
  "2019-04-26": { emoji: "🍿", text: "Avengers: Endgame opening day" },
  "2021-11-24": { emoji: "🍿", text: "Encanto opening day" },
  "2022-11-11": { emoji: "🍿", text: "Black Panther: Wakanda Forever opening day" },
  "2023-06-02": { emoji: "🍿", text: "Spider-Man: Across the Spider-Verse opening day" },
  "2023-07-21": { emoji: "🍿", text: "Barbenheimer" },
  "2011-11-18": { emoji: "🕹️", text: "Minecraft launched version 1.0" },
  "2013-09-17": { emoji: "🕹️", text: "GTA V launched" },
  "2016-07-06": { emoji: "🕹️", text: "Pokémon GO launched" },
  "2017-03-03": { emoji: "🕹️", text: "The Nintendo Switch launched" },
  "2022-02-25": { emoji: "🕹️", text: "Elden Ring launched" },
  "2025-06-05": { emoji: "🕹️", text: "Nintendo Switch 2 launched" },
  "2012-08-06": { emoji: "🔭", text: "Curiosity rover landed on Mars" },
  "2012-08-25": { emoji: "🔭", text: "Voyager 1 became the first human-made object to reach interstellar space" },
  "2014-11-12": { emoji: "🔭", text: "Rosetta's Philae probe landed on a comet for the first time" },
  "2021-02-18": { emoji: "🔭", text: "Perseverance rover landed on Mars" },
  "2021-04-19": { emoji: "🔭", text: "Ingenuity made the first powered flight on another planet" },
  "2021-12-25": { emoji: "🔭", text: "The James Webb Space Telescope launched" },
  "2007-06-29": { emoji: "📱", text: "The iPhone launched" },
  "2010-10-06": { emoji: "📱", text: "Instagram launched" },
  "2015-03-15": { emoji: "🎵", text: "Kendrick Lamar released To Pimp a Butterfly" },
  "2016-04-23": { emoji: "🍋", text: "Beyoncé dropped Lemonade" },
  "2017-04-14": { emoji: "🎵", text: "Kendrick Lamar dropped DAMN." },
  "2020-07-24": { emoji: "🎵", text: "Taylor Swift dropped folklore" },
  "2022-07-29": { emoji: "🎵", text: "Beyoncé dropped Renaissance" },
  "2022-10-21": { emoji: "🎵", text: "Taylor Swift released Midnights" },
  "2013-09-29": { emoji: "📺", text: "Breaking Bad series finale" },
  "2016-07-15": { emoji: "📺", text: "Stranger Things Season 1 premiered" },
  "2019-05-19": { emoji: "📺", text: "Game of Thrones series finale" },
  "2021-09-17": { emoji: "📺", text: "Squid Game dropped on Netflix" },
  "2022-06-23": { emoji: "📺", text: "The Bear premiered" },
  "2023-01-15": { emoji: "📺", text: "The Last of Us premiered" },
  "2023-05-28": { emoji: "📺", text: "Succession series finale" },
  "2014-09-04": { emoji: "🗽", text: "NYC launched Pre-K for All" },
  "2015-12-10": { emoji: "✒️", text: "President Obama signed the Every Student Succeeds Act, replacing No Child Left Behind" },
  "2017-03-22": { emoji: "⚖️", text: "The Supreme Court unanimously ruled in Endrew F. v. Douglas County that schools must offer IEPs \"reasonably calculated to enable a child to make progress appropriate in light of the child's circumstances\"" },
  "2018-08-28": { emoji: "⚖️", text: "A federal judge denied NYC DOE's motion to dismiss AFC's lawsuit on behalf of students denied nursing services" },
  "2019-02-15": { emoji: "⚖️", text: "New York State ruled in AFC's favor against Success Academy Charter Schools, finding they had illegally changed the placements of students with disabilities" },
  "2020-05-19": { emoji: "⚖️", text: "AFC secured a resolution agreement requiring NYC DOE to provide translation and interpretation services in special education proceedings" },
  "2022-09-08": { emoji: "🗽", text: "Governor Hochul signed New York City's landmark class size law, the first binding class size mandate in city history" },
  "2023-02-03": { emoji: "⚖️", text: "The Second Circuit reversed a lower court and allowed AFC's Z.Q. class action to proceed, ruling that NYC students with disabilities could pursue claims for make-up services lost during COVID remote learning" },
};
let confettiTimeout = null;
let confettiFired = false;

function hasYear(str) {
  const parsed = chrono.parse(str);
  if (!parsed.length) return false;
  return parsed[0].start.isCertain("year");
}

function isPast(date) {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
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
    if (chrome.runtime.lastError) return;
    const selection = results?.[0]?.result?.trim();
    if (selection) {
      const parsed = chrono.parseDate(selection);
      if (parsed && hasYear(selection) && isPast(parsed)) {
        birthdate.value = selection;
        birthdate.dispatchEvent(new Event("input"));
      }
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
  let html = `<div class="age-rows">
    <span class="age">${age}</span>
    <button class="copy-btn" id="copy-number" type="button">${copyIcon}<span class="shortcut">${modKey}C</span></button>`;
  if (hasWord) {
    html += `<span class="age word">${WORDS[age]}</span>
      <button class="copy-btn small" id="copy-word" type="button">${copyIcon}<span class="shortcut">${shiftMod}${modKey}C</span></button>`;
  }
  html += `</div>`;

  const dateKey = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const event = EVENTS[dateKey];
  if (event) {
    const eventDate = new Date(year, month - 1, day).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    html += `<div class="fun-fact"><span class="emoji">${event.emoji}</span> ${event.text}<div class="fun-fact-date">${eventDate}</div></div>`;
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
