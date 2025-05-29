let stepIndex = 0;
let isCooking = false;
let isCooked = false;
const prepSecondsConstant = 2700; // 45 minutes
let prepSeconds = prepSecondsConstant;
let prepInterval = null;
let stepSeconds = [Math.floor(prepSeconds/9), Math.floor(prepSeconds*2/9), prepSeconds - Math.floor(prepSeconds/9) - Math.floor(prepSeconds*2/9)];

function startPrepTimer() {
  clearInterval(prepInterval);
  updatePrepDisplay();
  prepInterval = setInterval(() => {
    stepRemainingSeconds = prepSecondsConstant - (stepSeconds.slice(0, stepIndex + 1)).reduce((a, b) => a + b, 0);
    if (prepSeconds > stepRemainingSeconds) {
      prepSeconds--;
      updatePrepDisplay();
    } else if (prepSeconds <= 0) {
      clearInterval(prepInterval);
    }
  }, 1000);
}

function updatePrepDisplay() {
  const minutes = Math.floor(prepSeconds / 60).toString().padStart(2, "0");
  const seconds = (prepSeconds % 60).toString().padStart(2, "0");
  document.getElementById("prep-timer").textContent = `Prep Time Left: ${minutes}:${seconds}`;
}

function toggleSection(id) {
  const el = document.getElementById(id);
  el.classList.toggle("hidden");
  if (!isAllToggleButtonsVisibility()) {
    document.querySelector("button[onclick='startCooking()']").disabled = true;
    document.querySelector("button[onclick='nextStep()']").disabled = true;
  } else {
    document.querySelector("button[onclick='startCooking()']").disabled =
      isCooking;
    document.querySelector("button[onclick='nextStep()']").disabled =
      !isCooking || isCooked;
  }
}

function isAllToggleButtonsVisibility() {
  const ingredientsVisible = !document
    .getElementById("ingredients")
    .classList.contains("hidden");
  const stepsVisible = !document
    .getElementById("steps")
    .classList.contains("hidden");
  return ingredientsVisible && stepsVisible;
}

function startCooking() {
  stepIndex = 0;
  isCooking = true;
  highlightStep(stepIndex);
  updateProgress();
  startPrepTimer();
  document.querySelector("button[onclick='startCooking()']").disabled = true;
  document.querySelector("button[onclick='nextStep()']").disabled = false;
}

function nextStep() {
  prepSeconds = prepSecondsConstant - (stepSeconds.slice(0, stepIndex + 1)).reduce((a, b) => a + b, 0);
  const steps = document.querySelectorAll("#steps li");
  if (stepIndex < steps.length - 1) {
    stepIndex++;
    highlightStep(stepIndex);
    updateProgress();
  }
  if (stepIndex === steps.length - 1) {
    document.querySelector("button[onclick='nextStep()']").disabled = true;
    isCooked = true;
  }
}

function highlightStep(index) {
  const steps = document.querySelectorAll("#steps li");
  steps.forEach((step) => (step.style.background = ""));
  steps[index].style.background = "#f3e8ff";
}

function updateProgress() {
  const steps = document.querySelectorAll("#steps li");
  const percent = ((stepIndex + 1) / steps.length) * 100;
  document.getElementById("progress").style.width = percent + "%";
}

function resetCooking() {
  const steps = document.querySelectorAll("#steps li");
  stepIndex = 0;
  isCooking = false;
  isCooked = false;
  prepSeconds = prepSecondsConstant;
  clearInterval(prepInterval);
  updatePrepDisplay();
  steps.forEach((step) => (step.style.background = ""));
  document.getElementById("progress").style.width = "0%";
  document.querySelector("button[onclick='startCooking()']").disabled =
    isAllToggleButtonsVisibility() ? false : true;
  document.querySelector("button[onclick='nextStep()']").disabled = true;
}
