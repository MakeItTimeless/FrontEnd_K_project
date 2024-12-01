const processImage = () => {
    const imageInput = document.getElementById("imageInput");
    const resultText = document.getElementById("result");
    const canvas = document.getElementById("outputCanvas");
    const ctx = canvas.getContext("2d");

    if (!imageInput.files[0]) {
        resultText.textContent = "Please upload an image.";
        return;
    }

    Tesseract.recognize(imageInput.files[0], "eng+kan", {
        logger: (info) => console.log(info),
    }).then(({ data: { text } }) => {
        const words = text.split(/\s+/);
        const kannadaRegex = /[\u0C80-\u0CFF]/;
        const totalWords = words.length;
        const kannadaWords = words.filter((word) => kannadaRegex.test(word)).length;
        const percentage = ((kannadaWords / totalWords) * 100).toFixed(2);

        // Display result text
        resultText.textContent = `Total words: ${totalWords}, Kannada words: ${kannadaWords}, Percentage: ${percentage}%`;

        // Draw pie chart
        new Chart(ctx, {
            type: "pie",
            data: {
                labels: ["Kannada Words", "Other Words"],
                datasets: [
                    {
                        data: [kannadaWords, totalWords - kannadaWords],
                        backgroundColor: ["#4caf50", "#f44336"],
                    },
                ],
            },
            options: {
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const total = context.dataset.data.reduce((acc, value) => acc + value, 0);
                                const value = context.raw;
                                const percentage = ((value / total) * 100).toFixed(2);
                                return `${context.label}: ${percentage}%`;
                            },
                        },
                    },
                    datalabels: {
                        color: "#fff",
                        font: { size: 14 },
                        formatter: (value, context) => {
                            const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
                            return `${((value / total) * 100).toFixed(2)}%`;
                        },
                    },
                },
            },
            plugins: [ChartDataLabels], // Include the data labels plugin
        });
    }).catch((err) => {
        console.error(err);
        resultText.textContent = "Error processing the image.";
    });
};
