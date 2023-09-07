console.log("gpt chrome ext is running");

// PARENTHESES SORTING: 
// 1. collect the threads 
// 2. get folder name from (folder_name) 
// 3. call createExpandableFolder.
function modifyContentParentheses(targetDiv) {
    const notes = targetDiv.querySelectorAll('li.relative');
    console.log(notes);
    const organizedNotes = {};

    notes.forEach(note => {
        const noteText = note.querySelector('div.flex-1').textContent.trim();

        const match = noteText.match(/\(([^)]+)\)$/);
        const folderName = match ? match[1].trim() : "Other";

        if (!organizedNotes[folderName]) {
            organizedNotes[folderName] = [];
        }
        organizedNotes[folderName].push(note);
    });
    console.log("Organized nodes", organizedNotes);
    targetDiv.innerHTML = '';

    for (let folderName in organizedNotes) {

        const folderElement = createExpandableFolder(folderName, organizedNotes[folderName]);
        targetDiv.appendChild(folderElement);

    }
}

// This does not work yet. Too much pain to get tensorflow working in chrome extension.
// Parentheses sorting works though, although it won't be useful for an account with many unspecified threads.

// TENSORFLOW SORTING: 
// 1. collect the threads 
// 2. classify threads based on their name and preset folder names in popup using tensorflow 
// 3. call createExpandableFolder.

// function modifyContentTensorflow(targetDiv) {
//     const notes = targetDiv.querySelectorAll('li.relative');
//     console.log(notes);

//     notes.forEach(async note => {
//         const noteText = note.querySelector('div.flex-1').textContent.trim();
    
//         await getEmbeddings(noteText)
//         .then(embeddings => {
//             console.log(embeddings);
//         })
//         .catch(error => {
//             console.error("Error getting embeddings:", error);
//         });
//     });
// }

// create the folder element
function createExpandableFolder(name, notes) {
    
    const folderElement = document.createElement('div');
    folderElement.className = 'folder';
    const folderIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    folderIcon.setAttribute('viewBox', '0 0 24 24');
    folderIcon.setAttribute('width', '24'); 
    folderIcon.setAttribute('height', '24');

    path.setAttribute('d', 'M19.5 21a3 3 0 003-3v-4.5a3 3 0 00-3-3h-15a3 3 0 00-3 3V18a3 3 0 003 3h15zM1.5 10.146V6a3 3 0 013-3h5.379a2.25 2.25 0 011.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 013 3v1.146A4.483 4.483 0 0019.5 9h-15a4.483 4.483 0 00-3 1.146z'); // This is just a generic path for demonstration

    folderIcon.appendChild(path);

    const titleElement = document.createElement('div');
    const title = document.createElement('h3');
    title.textContent = name;
    titleElement.className = 'folder-title';
    titleElement.appendChild(folderIcon);
    titleElement.appendChild(title);

    titleElement.addEventListener('click', function() {
        const content = this.nextElementSibling;
        content.style.display = content.style.display === 'none' ? '' : 'none';
    });
    
    const contentElement = document.createElement('ol');
    contentElement.className = 'folder-content';
    contentElement.style.display = 'none';

    notes.forEach(note => {
        contentElement.appendChild(note);
    });


    folderElement.appendChild(titleElement);
    folderElement.appendChild(contentElement);
    return folderElement;
}

// listen for messages from the popup
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if(request.action === "Sort by Parentheses") {
        sortByParentheses();
      }
    //   if(request.action === "Sort with Tensorflow") {
    //     sortWithTensorflow();
    //   }
    }
  );
  
  function sortByParentheses() {
    console.log('parentheses');
    const navElement = document.querySelector('nav[aria-label="Chat history"]');
    let divElement = null;
    if (navElement) {
        divElement = navElement.querySelector('div:nth-child(3)');
    }
    notes = divElement.querySelectorAll('li.relative');
    console.log("Threads collected. Sorting by Parentheses");

    modifyContentParentheses(divElement);
  }
  
//   function sortWithTensorflow() {
//     console.log('tensorflow');
//     const navElement = document.querySelector('nav[aria-label="Chat history"]');
//     let divElement = null;
//     if (navElement) {
//         divElement = navElement.querySelector('div:nth-child(3)');
//     }
//     notes = divElement.querySelectorAll('li.relative');
//     console.log("Threads collected. Sorting with Tensorflow");
//     modifyContentTensorflow(divElement);
//   }

//   function getEmbeddings(text) {
//     console.log(text);
//     return new Promise((resolve, reject) => {
//         chrome.runtime.sendMessage({action: "predict", text: text}, response => {
//             if (response && response.embeddings) {
//                 resolve(response.embeddings);
//             } else if (response && response.error) {
//                 reject(response.error);
//             } else {
//                 reject("Failed to get embeddings.");
//             }
//         });
//     });
// }
