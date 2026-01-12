document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('bmiForm');
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    const heightUnit = document.getElementById('heightUnit');
    const errorMessage = document.getElementById('error-message');

    // Result Elements
    const resultCard = document.getElementById('result-card');
    const resultSection = document.getElementById('result');
    const bmiValueElement = document.getElementById('bmi-value');
    const bmiCategoryElement = document.getElementById('bmi-category');
    const bmiDescriptionElement = document.getElementById('bmi-description');
    const recalculateBtn = document.getElementById('recalculate-btn');

    // Hide error on new input
    const inputs = [heightInput, weightInput, heightUnit];
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            errorMessage.classList.add('hidden');
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        calculateBMI();
    });

    // Reset/Recalculate Logic
    function resetCalculator() {
        resultCard.classList.add('hidden');
        form.reset();
        heightInput.focus();
        // Scroll back to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    recalculateBtn.addEventListener('click', resetCalculator);

    function calculateBMI() {
        const heightVal = parseFloat(heightInput.value);
        const weightVal = parseFloat(weightInput.value);
        const unit = heightUnit.value;

        if (!validateInput(heightVal) || !validateInput(weightVal)) {
            showError("Please enter valid positive numbers for height and weight.");
            return;
        }

        let heightInMeters = heightVal;
        if (unit === 'cm') {
            heightInMeters = heightVal / 100;
        }

        if (heightInMeters <= 0) {
            showError("Height must be greater than zero.");
            return;
        }

        const bmi = weightVal / (heightInMeters * heightInMeters);
        const roundedBMI = bmi.toFixed(2);
        const categoryData = getBMICategory(bmi);

        displayResult(roundedBMI, categoryData, heightInMeters, weightVal);
    }

    function validateInput(value) {
        return !isNaN(value) && value > 0;
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    }

    function getBMICategory(bmi) {
        if (bmi < 18.5) {
            return {
                name: "Underweight",
                color: "var(--cat-underweight)",
                desc: "You are in the underweight range. It's important to eat a balanced diet."
            };
        } else if (bmi >= 18.5 && bmi < 25) {
            return {
                name: "Normal",
                color: "var(--cat-normal)",
                desc: "You are in the healthy weight range. Keep up the good work!"
            };
        } else if (bmi >= 25 && bmi < 30) {
            return {
                name: "Overweight",
                color: "var(--cat-overweight)",
                desc: "You are in the overweight range. Regular exercise can help."
            };
        } else {
            return {
                name: "Obese",
                color: "var(--cat-obese)",
                desc: "You are in the obese range. Please consult a healthcare provider."
            };
        }
    }

    function displayResult(bmi, category, heightM, weight) {
        errorMessage.classList.add('hidden');

        bmiValueElement.textContent = bmi;
        bmiCategoryElement.textContent = category.name;
        bmiCategoryElement.style.backgroundColor = category.color;

        const heightDisplay = heightM < 1 ? `${heightM * 100} cm` : `${heightM} m`;

        bmiDescriptionElement.innerHTML = `
            ${category.desc}<br><br>
            <strong>Details:</strong><br>
            Height: ${heightDisplay}<br>
            Weight: ${weight} kg
        `;

        const dietSuggestionsElement = document.getElementById('diet-suggestions');
        const dietTextElement = document.getElementById('diet-text');

        const dietAdvice = getDietSuggestions(category.name);
        dietTextElement.innerHTML = dietAdvice;
        dietSuggestionsElement.classList.remove('hidden');
        dietSuggestionsElement.style.borderLeft = `4px solid ${category.color}`;

        // Show Result Card
        resultCard.classList.remove('hidden');

        // Scroll to result
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function getDietSuggestions(categoryName) {
        switch (categoryName) {
            case "Underweight":
                return `
                    <strong>Diet:</strong> Focus on nutrient-dense foods. Add healthy fats like avocados, nuts, and olive oil. Include more protein (lean meats, beans) to build muscle.<br>
                    <strong>Health:</strong> Aim for strength training exercises to build muscle mass rather than just body fat.
                `;
            case "Normal":
                return `
                    <strong>Diet:</strong> Maintain your balance with a diet rich in fruits, vegetables, whole grains, and lean proteins.<br>
                    <strong>Health:</strong> Regular moderate physical activity is key to keeping your heart and body healthy.
                `;
            case "Overweight":
                return `
                    <strong>Diet:</strong> Incorporate more fiber-rich vegetables and whole grains. Try portion control and reducing sugary drinks.<br>
                    <strong>Health:</strong> Aim for 150 minutes of moderate activity per week, like brisk walking or swimming.
                `;
            case "Obese":
                return `
                    <strong>Diet:</strong> Focus on whole, unprocessed foods. Reducing daily calorie intake by 500-1000 calories can help safe weight loss.<br>
                    <strong>Health:</strong> Consult a healthcare provider for a personalized plan. Low-impact exercises like walking or water aerobics are great starts.
                `;
            default:
                return "Maintain a balanced diet and stay active.";
        }
    }
});
