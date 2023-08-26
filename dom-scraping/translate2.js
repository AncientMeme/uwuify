function getRandomElement(array) 
{
            return array[Math.floor(Math.random() * array.length)];
        }
        
        const uwuReplacements = [
            // ... other replacement rules ...
            { pattern: /\bcan\b/g, replacement: "c-can" }, // \b ensures whole word matching
            { pattern: /(\w)(\w*)/g, replacement: "$1-$1$2" }, // Stuttering effect
            { pattern: /!/g, replacement: () => " " + getRandomElement(["❤️", "✨", "🎉"]) + " " },
            { pattern: /\?/g, replacement: () => " " + getRandomElement(["🌸", "🐾", "❓"]) + " " },
        ];
        
        function uwuifyText(text) {
            let uwuifiedText = text;
        
            uwuReplacements.forEach(({ pattern, replacement }) => {
            if (typeof replacement === "function") {
                uwuifiedText = uwuifiedText.replace(pattern, replacement);
            } else {
                uwuifiedText = uwuifiedText.replace(pattern, replacement);
            }
            });
  
    return uwuifiedText;
  }
  
  const originalText = "This is a more complex example for testing if it can be uwuified.";
  const uwuifiedText = uwuifyText(originalText);
  
  console.log(uwuifiedText);