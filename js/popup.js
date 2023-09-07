document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('button1').addEventListener('click', function() {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "Sort by Parentheses"});
      });
    });
  
    document.getElementById('openGPT').addEventListener('click', function() {
      chrome.tabs.create({url: "https://chat.openai.com/"});
    });
    // document.getElementById('button2').addEventListener('click', function() {
    //   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    //     chrome.tabs.sendMessage(tabs[0].id, {action: "Sort with Tensorflow"});
    //   });
    // });
  });
