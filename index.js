async function loadModules() {
    const inquirer = await import('inquirer');
    const qr = require('qr-image');
    const fs = require('fs-extra');

    async function generateQRCode() {
        let continueGenerating = true;

        while (continueGenerating) {
            const answers = await inquirer.default.prompt([
                {
                    type: 'input',
                    name: 'url',
                    message: 'Enter the URL to generate a QR code:'
                },
                {
                    type: 'confirm',
                    name: 'continue',
                    message: 'Would you like to generate another QR code?',
                    default: true,
                }
            ]);

            const url = answers.url;
            const qrSvg = qr.image(url, { type: 'png' });

            const timeStamp = new Date().getTime();
            const outputPath = `./output/qr-code-${timeStamp}.png`;

            await fs.ensureDir('./output'); 
            qrSvg.pipe(fs.createWriteStream(outputPath));

            const textFilePath = './output/urls.txt';
            await fs.appendFile(textFilePath, url + '\n');

            console.log(`QR code generated and saved to ${outputPath}`);
            console.log(`URL appended to ${textFilePath}`);

            continueGenerating = answers.continue;
        }
    }

    generateQRCode();
}

loadModules();
