const fs = require('fs');
const path = require('path');

function build() {
    try {
        // Read data and templates
        const iconsData = JSON.parse(fs.readFileSync('data/icons.json', 'utf8'));
        const template = fs.readFileSync('src/template.html', 'utf8');
        const style = fs.readFileSync('src/style.css', 'utf8');
        const script = fs.readFileSync('src/script.js', 'utf8');

        // Generate icon cards HTML
        const iconCards = iconsData.icons.map((icon, index) => `
<div class="icon-card" onclick="openModal(iconsData[${index}])">
    <img src="${icon.path}" alt="${icon.name}">
    <h3>${icon.name}</h3>
</div>
`).join('\n');

        const googleAnalyticsId = process.env.GOOGLE_ANALYTICS_ID;

        // Generate final HTML
        let finalHtml = template
            .replace('<!-- STYLE -->', `<style>${style}</style>`)
            .replace('<!-- ICONS -->', iconCards)
            .replace('<!-- SCRIPT -->', `
                <script>
                    const iconsData = ${JSON.stringify(iconsData.icons)};
                    ${script}
                </script>
            `)
            .replace('<!-- GOOGLE_ANALYTICS -->', `
                <script async src="https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}"></script>
                <script>
                    window.dataLayer = window.dataLayer || [];
                    function gtag() { dataLayer.push(arguments); }
                    gtag('js', new Date());

                    gtag('config', '${googleAnalyticsId}');
                </script>
            `);

        // Create output directory
        if (!fs.existsSync('dist')) {
            fs.mkdirSync('dist');
        }

        // Write HTML file
        fs.writeFileSync('dist/index.html', finalHtml);

        // Copy icon files
        copyDirectory('icons', 'dist/icons');

        // Copy assets
        copyDirectory('assets', 'dist');

        // Copy individual files
        copyFile('src/sitemap.xml', 'dist/sitemap.xml');
        copyFile('src/robots.txt', 'dist/robots.txt');

        // Copy CNAME file
        copyFile('src/CNAME', 'dist/CNAME');

        console.log('Build completed successfully!');
    } catch (error) {
        console.error('Build failed:', error);
        process.exit(1);
    }
}

// Helper function: Copy directory
function copyDirectory(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const files = fs.readdirSync(src);
    files.forEach(file => {
        fs.copyFileSync(
            path.join(src, file),
            path.join(dest, file)
        );
    });
}

// Helper function to copy single file
function copyFile(src, dest) {
    fs.copyFileSync(src, dest);
}

build();
