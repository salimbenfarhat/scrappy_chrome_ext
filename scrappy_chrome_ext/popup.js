document.getElementById('detecter').addEventListener('click', () => {
    chrome.tabs.reload(); // Recharge la page pour scanner les emails
});

// Fonction pour supprimer un email de la liste
function deleteEmail(emailToDelete) {
    chrome.storage.local.get("detectedEmails", (data) => {
        if (data.detectedEmails) {
            const updatedEmails = data.detectedEmails.filter(email => email !== emailToDelete);
            chrome.storage.local.set({ detectedEmails: updatedEmails }, () => {
                displayEmails(); // Rafraîchir la liste après suppression
            });
        }
    });
}

// Fonction pour afficher les emails stockés
function displayEmails() {
    chrome.storage.local.get("detectedEmails", (data) => {
        const emailsDiv = document.getElementById('emails');
        emailsDiv.innerHTML = ''; // Nettoie l'affichage

        if (data.detectedEmails && data.detectedEmails.length > 0) {
            data.detectedEmails.forEach(email => {
                const emailContainer = document.createElement('div');
                emailContainer.style.display = "flex";
                emailContainer.style.justifyContent = "space-between";
                emailContainer.style.alignItems = "center";
                emailContainer.style.padding = "5px 0";

                const paragraph = document.createElement('p');
                paragraph.textContent = email;

                // Ajouter une croix ❌ pour supprimer l'email
                const deleteButton = document.createElement('span');
                deleteButton.innerHTML = "&times;";
                deleteButton.style.cursor = "pointer";
                deleteButton.style.color = "red";
                deleteButton.style.marginLeft = "10px";
                deleteButton.addEventListener('click', () => deleteEmail(email));

                emailContainer.appendChild(paragraph);
                emailContainer.appendChild(deleteButton);
                emailsDiv.appendChild(emailContainer);
            });

            // Ajouter un bouton pour copier les emails
            const copyButton = document.createElement('button');
            copyButton.textContent = "Copier les emails";
            copyButton.addEventListener('click', () => {
                navigator.clipboard.writeText(data.detectedEmails.join('\n'))
                    .then(() => {
                        alert("Emails copiés dans le presse-papiers !");
                    })
                    .catch(err => console.error("Erreur de copie :", err));
            });

            emailsDiv.appendChild(copyButton);
        } else {
            emailsDiv.innerHTML = '<p>Aucun email détecté.</p>';
        }
    });
}

// Mettre à jour la popup si un message est reçu
chrome.runtime.onMessage.addListener((request) => {
    if (request.action === 'emailsUpdated') {
        displayEmails();
    }
});

// Charger les emails dès l’ouverture de la popup
displayEmails();
