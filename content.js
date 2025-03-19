const regex = /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}/g;
const emails = document.body.innerText.match(regex);

if (emails && emails.length > 0) {
    chrome.storage.local.get("detectedEmails", (data) => {
        let allEmails = data.detectedEmails || [];

        let newEmails = [];
        emails.forEach(email => {
            if (!allEmails.includes(email)) {
                allEmails.push(email);
                newEmails.push(email); // Emails vraiment nouveaux
            }
        });

        if (newEmails.length > 0) {
            alert(`Emails trouvés :\n${newEmails.join('\n')}`);

            chrome.storage.local.set({ detectedEmails: allEmails }, () => {
                console.log("Emails mis à jour :", allEmails);
            });

            chrome.runtime.sendMessage({ action: 'emailsUpdated' });
        }
    });
} else {
    console.log('Aucun email trouvé sur cette page.');
}
