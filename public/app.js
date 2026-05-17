let streak = localStorage.getItem("streak") || 0;
document.getElementById("streakCount").innerText = streak;

async function askAI() {
    const userInput = document.getElementById("userInput").value;
    const responseBox = document.getElementById("response");

    responseBox.innerHTML = "Generating mindful suggestions...";

    try {
        const response = await fetch("/ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: userInput
            })
        });

        const data = await response.json();
        console.log(data);

        if (data.candidates && data.candidates.length > 0) {
            responseBox.innerHTML =
                data.candidates[0].content.parts[0].text;

            increaseStreak();

        } else {
            responseBox.innerHTML =
                "Unable to generate response.";
        }

    } catch (error) {
        responseBox.innerHTML =
            "Something went wrong.";

        console.error(error);
    }
}

function increaseStreak() {
    streak++;
    localStorage.setItem("streak", streak);
    document.getElementById("streakCount").innerHTML = streak;
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}

let intentions =
    JSON.parse(localStorage.getItem("intentions")) || [];

function saveIntention() {
    const input =
        document.getElementById("intentionInput");
    const text = input.value.trim();
    if (text === "") return;

    intentions.push(text);
    localStorage.setItem(
        "intentions",
        JSON.stringify(intentions)
    );

    input.value = "";
    renderIntentions();
}

function renderIntentions() {
    const container =
        document.getElementById("intentionsList");
    container.innerHTML = "";
    intentions.forEach((item, index) => {
        container.innerHTML += `
            <div class="history-item">
                <p>${item}</p>

                <button onclick="deleteIntention(${index})">
                    Delete
                </button>
            </div>
        `;
    });
}

    renderIntentions();
}

let reflections =
    JSON.parse(localStorage.getItem("reflections")) || [];

function saveReflection() {
    const input =
        document.getElementById("reflectionInput");
    const text = input.value.trim();
    if (text === "") return;

    reflections.push(text);

    localStorage.setItem(
        "reflections",
        JSON.stringify(reflections)
    );

    input.value = "";

    renderReflections();
}

function renderReflections() {
    const container =
        document.getElementById("reflectionsList");
    container.innerHTML = "";
    reflections.forEach((item, index) => {
        container.innerHTML += `
            <div class="history-item">
                <p>${item}</p>

                <button onclick="deleteReflection(${index})">
                    Delete
                </button>
            </div>
        `;
    });
}

renderIntentions();
renderReflections();