const express = require("express");
const app = express();
app.use(express.json());

let totalResponseTime = 0;
let requestCount = 0;

// Middleware to calculate average response time
app.use((req, res, next) => {
    const start = process.hrtime(); // Capture the start time

    res.on("finish", () => {
        const diff = process.hrtime(start); // Calculate the difference
        const time = diff[0] * 1e3 + diff[1] * 1e-6; // Convert to milliseconds

        totalResponseTime += time;
        requestCount++;
        const averageResponseTime = totalResponseTime / requestCount;

        console.log(`Average Response Time: ${averageResponseTime.toFixed(2)} ms`);
    });

    next();
});

app.get("/user-auth", (req, res) => {
    const username = req.headers.username;
    const password = req.headers.password;
    const kidneyID = parseInt(req.query.kidneyID, 10);

    if (username !== "admin" || password !== "admin") {
        res.status(400).json({ msg: "Invalid Credentials" });
        return;
    }

    if (kidneyID !== 1 && kidneyID !== 2) {
        res.status(400).json({ msg: "Invalid Kidney ID" });
        return;
    }
    res.json({ msg: "Your kidney is fine" });
});

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
