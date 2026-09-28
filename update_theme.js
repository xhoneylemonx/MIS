const fs = require('fs');
const path = require('path');

function processDirectory(directory) {
    const files = fs.readdirSync(directory);

    for (const file of files) {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            updateTheme(fullPath);
        }
    }
}

function updateTheme(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // Dark/Vibrant Colors -> Primary
    content = content.replace(/bg-(purple|indigo|blue|pink|sky|fuchsia|violet|red|green|yellow)-[5-9]00(\/\d+)?/g, 'bg-primary');
    // Light Backgrounds -> Secondary
    content = content.replace(/bg-(purple|indigo|blue|pink|sky|fuchsia|violet|red|green|yellow)-[1-4]00(\/\d+)?/g, 'bg-secondary');

    // Text Accents -> Primary
    content = content.replace(/text-(purple|indigo|blue|pink|sky|fuchsia|violet|red|green|yellow)-[5-9]00(\/\d+)?/g, 'text-primary');
    // Light Text -> Background/Foreground or muted (usually in badges)
    content = content.replace(/text-(purple|indigo|blue|pink|sky|fuchsia|violet|red|green|yellow)-[1-4]00(\/\d+)?/g, 'text-secondary-foreground');

    // Borders -> Primary or border
    content = content.replace(/border-(purple|indigo|blue|pink|sky|fuchsia|violet|red|green|yellow)-[5-9]00(\/\d+)?/g, 'border-primary');
    content = content.replace(/border-(purple|indigo|blue|pink|sky|fuchsia|violet|red|green|yellow)-[1-4]00(\/\d+)?/g, 'border-primary/20');

    // Shadows
    content = content.replace(/shadow-(purple|indigo|blue|pink|sky|fuchsia|violet|red|green|yellow)-[1-9]00(\/\d+)?/g, 'shadow-primary/20');

    // Neutral darks (slate-900, slate-800, gray-900) -> foreground or specific Neutral
    content = content.replace(/bg-slate-900/g, 'bg-foreground');
    content = content.replace(/bg-gray-900/g, 'bg-foreground');
    content = content.replace(/text-slate-900/g, 'text-foreground');
    content = content.replace(/text-slate-800/g, 'text-foreground');
    content = content.replace(/text-gray-900/g, 'text-foreground');

    // Light neutral bg -> background
    content = content.replace(/bg-slate-50/g, 'bg-background');
    content = content.replace(/bg-gray-50/g, 'bg-background');
    content = content.replace(/bg-white/g, 'bg-card');

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content);
        console.log(`Updated: ${filePath}`);
    }
}

// Ensure the directory exists
const targetDir = path.join(__dirname, 'src', 'app');
if (fs.existsSync(targetDir)) {
    processDirectory(targetDir);
    processDirectory(path.join(__dirname, 'src', 'lib'));
    console.log("Color themes successfully mapped to unified tokens.");
} else {
    console.log("No src/app directory found.");
}
