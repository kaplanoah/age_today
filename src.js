import * as chrono from "chrono-node";

const birthdate = document.getElementById("birthdate");
const result = document.getElementById("result");

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
    result.textContent = "";
    result.className = "";
    return;
  }

  const parsed = chrono.parseDate(val);
  if (parsed && hasYear(val) && isPast(parsed)) {
    showAge(parsed);
  } else {
    result.textContent = "";
    result.className = "";
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

  result.className = "";
  result.innerHTML = `<span class="age">${age}</span>`;
}
