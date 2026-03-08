const birthdate = document.getElementById("birthdate");
const result = document.getElementById("result");

birthdate.addEventListener("change", () => {
  const val = birthdate.value;
  if (!val) {
    result.textContent = "";
    return;
  }

  const [year, month, day] = val.split("-").map(Number);
  const today = new Date();
  const ty = today.getFullYear();
  const tm = today.getMonth() + 1;
  const td = today.getDate();

  let age = ty - year;
  if (tm < month || (tm === month && td < day)) {
    age--;
  }

  if (age < 0) {
    result.innerHTML = "That date is in the future!";
  } else {
    result.innerHTML = `<span class="age">${age}</span> years old`;
  }
});
