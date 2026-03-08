import * as chrono from "chrono-node";

const birthdate = document.getElementById("birthdate");
const result = document.getElementById("result");

birthdate.addEventListener("input", () => {
  const val = birthdate.value.trim();
  if (!val) {
    result.textContent = "";
    result.className = "";
    return;
  }

  const parsed = chrono.parseDate(val);
  if (parsed) {
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
  if (parsed) {
    showAge(parsed);
  } else {
    result.textContent = "Couldn't recognize that date. Try something like \"March 5 1990\" or \"3/5/1990\".";
    result.className = "error";
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
  if (age < 0) {
    result.innerHTML = "That date is in the future!";
  } else {
    result.innerHTML = `<span class="age">${age}</span> years old`;
  }
}
