require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.post("/ask", async (req, res) => {

    const userInput = req.body.message;

    const prompt = `
    You are a calm and supportive digital wellness assistant.
    The user is struggling with unhealthy screen habits.
    Respond naturally like a mindful wellness coach.

    Keep the response:
    - short
    - warm
    - conversational
    - calming
    - human-like
    - numbered lists where necessary
    - headings where necessary

    Avoid:
    - long essays
    - sounding robotic
    - sounding like therapy notes

    User message:
    ${userInput}

    Give:
    - gentle reflection
    - 2 to 5 healthier suggestions
    - encouraging tone
    -hobbies where necessary 
    -craft activities where necessary
    -mentally stimulating activities where necessary 
    `;

    try {

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                { text: prompt }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        res.json(data);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Something went wrong"
        });
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});