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