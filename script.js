const calculateBtn = document.querySelector(".calculate");
const clearAllBtn = document.querySelector(".clear-all-btn");

const emptyResult = document.querySelector(".empty-state");
const resultState = document.querySelector(".result-state");

const monthlyDisplay = document.querySelector(".result-value-1");
const totalDisplay = document.querySelector(".result-value-2");
const inputs = document.querySelectorAll(
  "input[type='number'], input[type='radio']"
);

// CALCULATE BUTTON FUNCTIONALITY
calculateBtn.addEventListener("click", function (e) {
  e.preventDefault();

  // Run validation on the input Type (Numbers)
  let isFormValid = true;

  inputs.forEach((input) => {
    validateInput(input);
    if (input.value.trim() === "") {
      isFormValid = false;
    }
  });

  // Run validation on Mortgage Type (Radios)
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

  // ONLY proceed with calculations if the form is valid
  if (isFormValid) {
    // ... include your existing math formulas here ...
    resultState.style.display = "block";
    emptyResult.style.display = "none";
  } else {
    // If invalid, show the empty state and stop
    resultState.style.display = "none";
    emptyResult.style.display = "block";
  }

  //
  const mortgageAmount = parseFloat(
    document.querySelector(".wrapper-1 input").value
  );
  const mortgageTerm = parseFloat(
    document.querySelector(".wrapper-2 input").value
  );
  const interestRate =
    parseFloat(document.querySelector(".wrapper-3 input").value) / 100 / 12; // Monthly interest rate
  const n = mortgageTerm * 12; // Total number of payments (months)
  const mortgageType = document.querySelector(
    'input[type="radio"]:checked'
  ).value;

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

  if (!isNaN(monthlyRepayment) && isFinite(monthlyRepayment)) {
    // Format to British Pound currency
    const formatter = new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    });
    monthlyDisplay.innerText = formatter.format(monthlyRepayment);
    totalDisplay.innerText = formatter.format(totalRepayment);

    // Switch Visibility
    emptyResult.style.display = "none";
    resultState.style.display = "block";
  } else {
    alert("Please enter valid numbers in all fields.");
  }

  // FOR THE ERROR MESSAGE DISPLAY

  function validateInput(input) {
    const parent =
      input.closest(".head-2") ||
      input.closest(".head-3 > div") ||
      input.closest(".head-4 > div") ||
      input.parentElement.parentElement;

    if (input.value.trim() === "") {
      parent.classList.add("error");
    } else {
      parent.classList.remove("error");
    }
  }

  inputs.forEach((input) => {
    input.addEventListener("blur", () => {
      validateInput(input);
    });

    input.addEventListener("input", () => {
      if (input.value.trim() !== "") {
        const errorContainer = input.closest(".error");
        if (errorContainer) {
          errorContainer.classList.remove("error");
        }
      }
    });
  });
});

// CLEAR ALL BUTTON FUNCTIONALITY

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

  //clear all the calculated text values
  //   monthlyDisplay.innerText = "£0.00";
  //   totalDisplay.innerText = "£0.00";
});
