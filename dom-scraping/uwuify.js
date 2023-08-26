function uwuifyText(text) 
{
            text = text.replace(/(?:r|l)/g, "w");
            text = text.replace(/(?:R|L)/g, "W");
            text = text.replace(/n([aeiou])/g, "ny$1");
            text = text.replace(/N([aeiou])/g, "Ny$1");
            text = text.replace(/th/g, "f");
            text = text.replace(/ove/g, "uv");
            text = text.replace(/!+/g, " " + "❤️".repeat(Math.floor(Math.random() * 3) + 1) + " ");
            text = text.replace(/\?+/g, " " + "🌸".repeat(Math.floor(Math.random() * 3) + 1) + " ");
            return text;
            }

            const originalText = "This is a complicated text for testing!";
            const uwuifiedText = uwuifyText(originalText);

    console.log(uwuifiedText);