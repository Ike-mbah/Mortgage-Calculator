const calculateBtn = document.querySelector(".calculate");
const clearAllBtn = document.querySelector(".clear-all-btn");
const emptyResult = document.querySelector(".empty-state");
const resultState = document.querySelector(".result-state");
const monthlyDisplay = document.querySelector(".result-value-1");
const totalDisplay = document.querySelector(".result-value-2");
const inputs = document.querySelectorAll("input[type='number'], input[type='radio']");
const radioInputs = document.querySelectorAll("input[name='mortgageType']");

// 1. HELPER: Validation logic
function validateInput(input) {
  const parent =
    input.closest(".head-2, .head-3 > div, .head-4 > div") ||
    input.parentElement;
  if (input.value.trim() === "") {
    parent.classList.add("error");
    return false;
  } else {
    parent.classList.remove("error");
    return true;
  }
}

// 2. MAIN CALCULATION
calculateBtn.addEventListener("click", function (e) {
  e.preventDefault();
  let isFormValid = true;

  // Validate number inputs
  inputs.forEach((input) => {
    if (!validateInput(input)) isFormValid = false;
  });

  // Validate radio buttons
  const mortgageTypeRadio = document.querySelector(
    'input[name="mortgageType"]:checked'
  );
  const typeContainer = document.querySelector(".mortgage-type-container");

  if (!mortgageTypeRadio) {
    typeContainer.classList.add("error");
    isFormValid = false;
  } else {
    typeContainer.classList.remove("error");
  }

  if (isFormValid) {
    calculateResults(mortgageTypeRadio.value);
  } else {
    resultState.style.display = "none";
    emptyResult.style.display = "block";
  }
});

function calculateResults(mortgageType) {
  const mortgageAmount = parseFloat(document.querySelector("#amount").value);
  const mortgageTerm = parseFloat(document.querySelector("#term").value);
  const interestRate =
    parseFloat(document.querySelector("#interest").value) / 100 / 12;
  const n = mortgageTerm * 12;

  let monthlyRepayment = 0;
  let totalRepayment = 0;

  if (mortgageType === "Repayment") {
    const formula = Math.pow(1 + interestRate, n);
    monthlyRepayment =
      (mortgageAmount * interestRate * formula) / (formula - 1);
    totalRepayment = monthlyRepayment * n;
  } else {
    monthlyRepayment = mortgageAmount * interestRate;
    totalRepayment = monthlyRepayment * n + mortgageAmount;
  }

  const formatter = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  });

  monthlyDisplay.innerText = formatter.format(monthlyRepayment);
  totalDisplay.innerText = formatter.format(totalRepayment);

  emptyResult.style.display = "none";
  resultState.style.display = "block";
}

//3. EVENT LISTENERS (Outside the click loop)
inputs.forEach((input) => {
  input.addEventListener("input", () => validateInput(input));
});

// 4. CLEAR ALL BUTTON FUNCTIONALITY

clearAllBtn.addEventListener("click", () => {
  document.querySelector("form").reset();
  document
    .querySelectorAll(".error")
    .forEach((el) => el.classList.remove("error"));
  resultState.style.display = "none";
  emptyResult.style.display = "block";
});

clearAllBtn.addEventListener("click", function (e) {
  e.preventDefault();
  document.querySelector("form").reset(); // Resets values

  // Remove red styling from all sections
  const errorContainers = document.querySelectorAll(".error");
  errorContainers.forEach((container) => {
    container.classList.remove("error");
  });

  // Remove or uncheck the Radio buttons
  const radios = document.querySelectorAll('input[type="radio"]');
  radios.forEach((radio) => (radio.checked = false));

  // Reset results to the empty state
  resultState.style.display = "none";
  emptyResult.style.display = "block";
});
