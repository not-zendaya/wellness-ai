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

let reflections =
    JSON.parse(localStorage.getItem("reflections")) || [];

let moods =
    JSON.parse(localStorage.getItem("moods")) || [];

function saveIntention() {
    const input =
        document.getElementById("intentionInput");
    const text = input.value.trim();
    if (text === "") return;

    const lines = text.split("\n");
    lines.forEach(line => {
        if (line.trim() !==""){
            intentions.push({
                text: line.trim(),
                date: new Date().toLocaleString()
            });
        }
    });

    localStorage.setItem(
        "intentions",
        JSON.stringify(intentions)
    );

    input.value = "";
    renderIntentions();
    updateAnalytics();
}

function saveReflection() {
    const input =
        document.getElementById("reflectionInput");
    const text = input.value.trim();
    if (text === "") return;

    const lines = text.split("\n");

    lines.forEach(line => {
        if (line.trim() !== "") {
            reflections.push({
                text: line.trim(),
                date: new Date().toLocaleString()
            });
        }
    });

    localStorage.setItem(
        "reflections",
        JSON.stringify(reflections)
    );

    input.value = "";

    renderReflections();
    updateAnalytics();
}

function saveMood() {
    const mood =
        document.getElementById("moodSelect").value;
    moods.push({
        mood: mood,
        date: new Date().toLocaleString()
    });

    localStorage.setItem(
        "moods",
        JSON.stringify(moods)
    );

    renderMoods();
    updateAnalytics();
}

function renderIntentions() {
    const container =
        document.getElementById("intentionsList");
    container.innerHTML = "";
    intentions.forEach((item, index) => {
        container.innerHTML += `
            <div class="history-item">
               <h3> ${index + 1}. ${item.text}</h3>
                <p>${item.text}</p>
                <small> Added: ${item.date}</small>

                <br>

                <button
                    class="edit-btn"
                    onclick="editIntention(${index})">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteIntention(${index})">
                    Delete
                </button>
            </div>
        `;
    });
}
function renderReflections() {
    const container =
        document.getElementById("reflectionsList");
    container.innerHTML = "";
    reflections.forEach((item, index) => {
        container.innerHTML += `
            <div class="history-item">
                <h3> ${index + 1}. ${item.text}</h3>
                <p>${item.text}</p>
                <small>Added: ${item.date}</small>

                <br>

                <button
                    class="edit-btn"
                    onclick="editReflection(${index})">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteReflection(${index})">
                    Delete
                </button>
            </div>
        `;
    });
}

function renderMoods() {
    const container =
        document.getElementById("moodList");
    container.innerHTML = "";
    moods.forEach((item) => {
        container.innerHTML += `
            <div class="history-item">

                <p>${item.mood}</p>

                <small>${item.date}</small>

            </div>
        `;
    });
}

function deleteIntention(index) {
    intentions.splice(index, 1);
    localStorage.setItem(
        "intentions",
        JSON.stringify(intentions)
    );

    renderIntentions();
    updateAnalytics();
}


function deleteReflection(index) {
    reflections.splice(index, 1);
    localStorage.setItem(
        "reflections",
        JSON.stringify(reflections)
    );
    renderReflections();
}

function editIntention(index) {
    const updatedText =
        prompt(
            "Edit intention:",
            intentions[index].text
        );

    if (updatedText !== null && 
        updatedText.trim() !==""
    ) {
        intentions[index].text = updatedText.trim();
        localStorage.setItem(
            "intentions",
            JSON.stringify(intentions)
        );

        renderIntentions();
    }
}

function editReflection(index) {
    const updatedText =
        prompt(
            "Edit reflection:",
            reflections[index].text
        );

    if (updatedText !== null) {
        reflections[index].text = updatedText;
        localStorage.setItem(
            "reflections",
            JSON.stringify(reflections)
        );

        renderReflections();
    }
}

function updateAnalytics() {
    const analytics =
        document.getElementById("analytics");

    analytics.innerHTML = `
        <div class="analytics-box">
            <p>
                🌱 Total Intentions:
                ${intentions.length}
            </p>

            <p>
                📝 Total Reflections:
                ${reflections.length}
            </p>

            <p>
                😊 Mood Entries:
                ${moods.length}
            </p>

            <p>
                🔥 Wellness Streak:
                ${streak} days
            </p>

        </div>
    `;
}


renderIntentions();
renderReflections();
renderMoods();
updateAnalytics();