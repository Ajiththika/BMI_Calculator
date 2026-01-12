document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('bmiForm');
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    const heightUnit = document.getElementById('heightUnit');
    const errorMessage = document.getElementById('error-message');
    const resultSection = document.getElementById('result');
    const bmiValueElement = document.getElementById('bmi-value');
    const bmiCategoryElement = document.getElementById('bmi-category');
    const bmiDescriptionElement = document.getElementById('bmi-description');
    const recalculateBtn = document.getElementById('recalculate-btn');

    // Hide result on new input
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

    recalculateBtn.addEventListener('click', () => {
        resultSection.classList.add('hidden');
        form.reset();
        heightInput.focus();
    });

    function calculateBMI() {
        // Parse Inputs
        const heightVal = parseFloat(heightInput.value);
        const weightVal = parseFloat(weightInput.value);
        const unit = heightUnit.value;

        // Validation
        if (!validateInput(heightVal) || !validateInput(weightVal)) {
            showError("Please enter valid positive numbers for height and weight.");
            return;
        }

        // Convert Height to Meters
        let heightInMeters = heightVal;
        if (unit === 'cm') {
            heightInMeters = heightVal / 100;
        }

        // Final sanity check for height (e.g. not 0 after conversion, though validateInput checks > 0)
        if (heightInMeters <= 0) {
            showError("Height must be greater than zero.");
            return;
        }

        // Calculate BMI
        const bmi = weightVal / (heightInMeters * heightInMeters);
        const roundedBMI = bmi.toFixed(2);

        // Determine Category
        const categoryData = getBMICategory(bmi);

        // Display Results
        displayResult(roundedBMI, categoryData, heightInMeters, weightVal);
    }

    function validateInput(value) {
        return !isNaN(value) && value > 0;
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
        resultSection.classList.add('hidden');
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
        // Hide error if any
        errorMessage.classList.add('hidden');

        // Set Values
        bmiValueElement.textContent = bmi;
        bmiCategoryElement.textContent = category.name;
        bmiCategoryElement.style.backgroundColor = category.color;
        
        // Detailed summary as requested
        // "Output must be clear and readable, explicitly showing: Entered height, Entered weight..."
        const heightDisplay = heightM < 1 ? `${heightM * 100} cm` : `${heightM} m`;
        
        bmiDescriptionElement.innerHTML = `
            ${category.desc}<br><br>
            <strong>Details:</strong><br>
            Height: ${heightDisplay}<br>
            Weight: ${weight} kg
        `;

        // Show Section
        resultSection.classList.remove('hidden');
        
        // Scroll to result on mobile if needed
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
});
