/*global
window, webkitSpeechRecognition
*/
var speechRecognitionInstance = null;
var speechRecognitionList = null;
var grammar = '#JSGF V1.0; grammar colors; public <color> = aqua | azure | beige | bisque | black | blue | brown | chocolate | coral | crimson | cyan | fuchsia | ghostwhite | gold | goldenrod | gray | green | indigo | ivory | khaki | lavender | lime | linen | magenta | maroon | moccasin | navy | olive | orange | orchid | peru | pink | plum | purple | red | salmon | sienna | silver | snow | tan | teal | thistle | tomato | turquoise | violet | white | yellow ;'

/**
 * Set the feedback text and type.
 * @function setFeedback
 * @param {string} message - The text that will be displayed in the feedback box.
 * @param {string} [type] - The style of the feedback box.
 */
function setFeedback(message, type) {
    'use strict';
    var feedbackText = document.getElementById('feedbackText');
    feedbackText.innerHTML = message;
    if (type) {
        feedbackText.parentElement.className += ' ' + type;
    } else {
        feedbackText.parentElement.className = 'feedback';
    }
}

/**
 * Check if the speech recognition object is present on the browser.
 * @function checkSpeechRecognition
 */
function checkSpeechRecognition() {
    'use strict';
    if (window.webkitSpeechRecognition !== undefined) {
        speechRecognitionInstance = new webkitSpeechRecognition();
        speechRecognitionList = new webkitSpeechGrammarList();
        speechRecognitionList.addFromString(grammar, 1);
        speechRecognitionInstance.grammars = speechRecognitionList;
        speechRecognitionInstance.lang = document.getElementById('lang').value;
        speechRecognitionInstance.continuous = document.getElementById('continuous').checked;
        speechRecognitionInstance.interimResults = document.getElementById('interimResults').checked;
        speechRecognitionInstance.maxAlternatives = document.getElementById('maxAlternatives').value;
    } else {
        setFeedback('SpeechRecognition API is not available in your browser.', 'error');
    }
}

if (navigator.onLine) {
    checkSpeechRecognition();
} else {
    setFeedback('You are not connected to internet.', 'error');
}

document.getElementById('lang').addEventListener('change', function () {
    'use strict';
    speechRecognitionInstance.lang = this.value;
});

document.getElementById('continuous').addEventListener('change', function () {
    'use strict';
    speechRecognitionInstance.continuous = this.checked;
});

document.getElementById('interimResults').addEventListener('change', function () {
    'use strict';
    speechRecognitionInstance.interimResults = this.checked;
});

document.getElementById('maxAlternatives').addEventListener('change', function () {
    'use strict';
    speechRecognitionInstance.maxAlternatives = this.value;
});

document.getElementById('start').addEventListener('click', function (event) {
    'use strict';
    event.preventDefault();
    if (speechRecognitionInstance) {
        document.getElementById('results').innerHTML = '';
        speechRecognitionInstance.start();
        setFeedback('Listening to you');
    } else {
        setFeedback('The speech recognition object is not defined yet, try in other browser', 'error');
    }
});

document.getElementById('stop').addEventListener('click', function (event) {
    'use strict';
    event.preventDefault();
    if (speechRecognitionInstance) {
        speechRecognitionInstance.stop();
        setFeedback('Recognition stopped');
    } else {
        setFeedback('The speech recognition object is not defined yet, try in other browser', 'error');
    }
});

/** Fired when the user agent has started to capture audio. */
speechRecognitionInstance.onaudiostart = function (event) {
    console.log(event);
    setFeedback('Capturing audio');
}

/** Fired when the user agent has finished capturing audio. */
speechRecognitionInstance.onaudioend = function (event) {
    console.log(event);
    setFeedback('Audio capturing finished');
}

/** Fired when the speech recognition service has disconnected. */
speechRecognitionInstance.onend = function (event) {
    console.log(event);
    setFeedback('Recognition disconnected');
}

/** Fired when a speech recognition error occurs. */
speechRecognitionInstance.onerror = function (event) {
    console.log(event);
    setFeedback('An error has ocurred: ' + event.error, 'error');
}

/** Fired when the speech recognition service returns a final result with no significant recognition.
This may involve some degree of recognition, which doesn't meet or exceed the confidence threshold. */
speechRecognitionInstance.onnomatch = function (event) {
    console.log(event);
    setFeedback('Result with no significant recognition', 'warning');
}

/** Fired when the speech recognition service returns a result — a word or phrase has been positively recognized and this has been communicated back to the app. */
speechRecognitionInstance.onresult = function (event) {
    console.log(event);
    var rl = event.results.length;
    var al = 0;
    var i = 0;
    var j;
    for (i; i < rl; i += 1) {
        al = event.results[i].length;
        for (j = 0; j < al; j += 1) {
            document.getElementById('results').innerHTML += '<li>' + event.results[i][j].transcript + ' - Final: ' + event.results[0].isFinal + '</li>'
        }
    }
    setFeedback('A word or phrase has been positively recognized');
}

/** Fired when any sound — recognisable speech or not — has been detected. */
speechRecognitionInstance.onsoundstart = function (event) {
    console.log(event);
    setFeedback('Sound detected');
}

/** Fired when any sound — recognisable speech or not — has stopped being detected. */
speechRecognitionInstance.onsoundend = function (event) {
    console.log(event);
    setFeedback('Sound end detected');
}

/** Fired when sound that is recognised by the speech recognition service as speech has been detected. */
speechRecognitionInstance.onspeechstart = function (event) {
    console.log(event);
    setFeedback('Speech detected');
}

/** Fired when speech recognised by the speech recognition service has stopped being detected. */
speechRecognitionInstance.onspeechend = function (event) {
    console.log(event);
    setFeedback('Speech end detected');
}

/** Fired when the speech recognition service has begun listening to incoming audio with intent to recognize grammars associated with the current SpeechRecognition. */
speechRecognitionInstance.onstart = function (event) {
    console.log(event);
    setFeedback('Listening and intenting recognize grammars');
}