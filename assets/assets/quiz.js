document.getElementById("quizForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const answers = {};
  const formData = new FormData(e.target);

  for (let [key, value] of formData.entries()) {
    answers[value] = (answers[value] || 0) + 1;
  }

  const archetype = Object.entries(answers).sort((a, b) => b[1] - a[1])[0][0];

  const descriptions = {
    rebel: "You are the Rebel – a visionary rule-breaker who activates change.",
    oracle: "You are the Oracle – a mystic seer who channels divine wisdom.",
    architect: "You are the Architect – a strategic builder of sacred systems.",
  };

  const products = {
    rebel: ["Brainwave Headphones", "Manifestation Journal"],
    oracle: ["Crystal Grid Kit", "Moon Phase Planner"],
    architect: ["Notion Dashboard", "Business Ritual Toolkit"],
  };

  document.getElementById("archetypeDescription").textContent = descriptions[archetype];
  document.getElementById("affiliateProducts").innerHTML = products[archetype]
    .map(p => `<p class="text-purple-400">🔗 ${p}</p>`)
    .join("");

  document.getElementById("result").classList.remove("hidden");
});
