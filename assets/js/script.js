function updateSampleTextHighlight() {
	const sampleTextElem = document.getElementById('sample-text');
	const textarea = document.querySelector('textarea.form-control');
	if (!sampleTextElem || !textarea) return;

	const sampleWords = sampleTextElem.textContent.trim().split(/\s+/);
	const typedWords = textarea.value.trim().split(/\s+/);

	let highlighted = sampleWords.map((word, i) => {
		if (typedWords[i] === undefined || typedWords[i] === "") {
			return `<span>${word}</span>`;
		} else if (typedWords[i] === word) {
			return `<span style=\"color: #007bff;\">${word}</span>`; // blue
		} else {
			return `<span style=\"color: #dc3545;\">${word}</span>`; // red
		}
	});

	sampleTextElem.innerHTML = highlighted.join(' ');
}
// --- Removed old retry button code ---

// Typing Test Timer Logic
let testStartTime = null;
let testEndTime = null;
let testStarted = false;
let testEnded = false;

function startTypingTestAuto() {
	if (!testStarted) {
		testStartTime = Date.now();
		testEndTime = null;
		testStarted = true;
		testEnded = false;
		clearTestTimeDisplay();
		setRetryButtonState(true);
	}
}

function stopTypingTestAuto() {
	if (testStarted && !testEnded) {
		testEndTime = Date.now();
		const elapsedSeconds = (testEndTime - testStartTime) / 1000;
		displayTestTime(elapsedSeconds);

		// Calculate WPM and display
		const sampleTextElem = document.getElementById('sample-text');
		const textarea = document.querySelector('textarea.form-control');
		const difficultySelect = document.getElementById('difficulty');
		const sampleText = sampleTextElem ? sampleTextElem.textContent : '';
		const typedText = textarea ? textarea.value : '';
		const difficulty = difficultySelect ? difficultySelect.value : '-';

		const correctWords = calculateCorrectWords(sampleText, typedText);
		const wpm = elapsedSeconds > 0 ? Math.round((correctWords / elapsedSeconds) * 60) : 0;
		displayWPM(wpm);
		displayDifficulty(difficulty);

		if (textarea) textarea.disabled = true;
		setRetryButtonState(false);
		testEnded = true;
	}
}

function setRetryButtonState(isDisabled) {
	const retryBtn = document.getElementById('retry-btn');
	if (retryBtn) retryBtn.disabled = isDisabled;
}

function clearTypingAreaAndReset() {
	const textarea = document.querySelector('textarea.form-control');
	if (textarea) {
		textarea.value = '';
		textarea.disabled = false;
		textarea.focus();
	}
	clearTestTimeDisplay();
	displayWPM('-');
	displayDifficulty('-');
	testStarted = false;
	testEnded = false;
	// Load new sample text of same difficulty
	updateSampleText();
	setTimeout(updateSampleTextHighlight, 0);
	setRetryButtonState(true);
}


function calculateCorrectWords(sample, typed) {
	const sampleWords = sample.trim().split(/\s+/);
	const typedWords = typed.trim().split(/\s+/);
	let correct = 0;
	for (let i = 0; i < Math.min(sampleWords.length, typedWords.length); i++) {
		if (sampleWords[i] === typedWords[i]) correct++;
	}
	return correct;
}

function displayWPM(wpm) {
	const wpmElem = document.getElementById('wpm');
	if (wpmElem) {
		wpmElem.textContent = wpm;
	}
}

function displayDifficulty(level) {
	const levelElem = document.getElementById('level');
	if (levelElem) {
		levelElem.textContent = level.charAt(0).toUpperCase() + level.slice(1);
	}
}

function stopTypingTest() {
	if (testStartTime) {
		testEndTime = Date.now();
		const elapsedSeconds = (testEndTime - testStartTime) / 1000;
		displayTestTime(elapsedSeconds);

		// Calculate WPM and display
		const sampleTextElem = document.getElementById('sample-text');
		const textarea = document.querySelector('textarea.form-control');
		const difficultySelect = document.getElementById('difficulty');
		const sampleText = sampleTextElem ? sampleTextElem.textContent : '';
		const typedText = textarea ? textarea.value : '';
		const difficulty = difficultySelect ? difficultySelect.value : '-';

		const correctWords = calculateCorrectWords(sampleText, typedText);
		const wpm = elapsedSeconds > 0 ? Math.round((correctWords / elapsedSeconds) * 60) : 0;
	displayWPM(wpm);
		displayDifficulty(difficulty);

		setButtonStates(false, true);
	}
}

function setButtonStates(isTestRunning, isTestStopped) {
	const startBtn = document.getElementById('start-btn');
	const stopBtn = document.getElementById('stop-btn');
	if (startBtn) startBtn.disabled = isTestRunning;
	if (stopBtn) stopBtn.disabled = isTestStopped;
}

function displayTestTime(seconds) {
	const timeElem = document.getElementById('time');
	if (timeElem) {
		timeElem.textContent = seconds.toFixed(2) + ' s';
	}
}

function clearTestTimeDisplay() {
	const timeElem = document.getElementById('time');
	if (timeElem) {
		timeElem.textContent = '-';
	}
}
// Typing Test Sample Texts by Difficulty
const sampleTexts = {
	easy: [
		"The quick brown fox jumps over the lazy dog.",
		"Typing is fun and easy to learn.",
		"Practice makes perfect every day."
	],
	medium: [
		"JavaScript is a versatile language for web development.",
		"Typing speed improves with regular and focused practice.",
		"A journey of a thousand miles begins with a single step."
	],
	hard: [
		"Sphinx of black quartz, judge my vow as the wizard quickly mixed the potion.",
		"The quick onyx goblin jumps over the lazy dwarf, vexing them with his antics.",
		"Pack my box with five dozen liquor jugs before the heavy rain starts."
	]
};

function getRandomText(difficulty) {
	const texts = sampleTexts[difficulty] || sampleTexts.easy;
	return texts[Math.floor(Math.random() * texts.length)];
}

function updateSampleText() {
	const difficultySelect = document.getElementById('difficulty');
	const sampleTextElem = document.getElementById('sample-text');
	if (difficultySelect && sampleTextElem) {
		const selectedDifficulty = difficultySelect.value;
		sampleTextElem.textContent = getRandomText(selectedDifficulty);
	}
}

// Event listener for difficulty change and auto test logic
document.addEventListener('DOMContentLoaded', function() {
	const difficultySelect = document.getElementById('difficulty');
	const refreshBtn = document.getElementById('refresh-sample');
	const retryBtn = document.getElementById('retry-btn');

	if (difficultySelect) {
		difficultySelect.addEventListener('change', function() {
			updateSampleText();
			setTimeout(updateSampleTextHighlight, 0);
			clearTypingAreaAndReset();
		});
		// Set initial sample text
		updateSampleText();
		setTimeout(updateSampleTextHighlight, 0);
	}
	if (refreshBtn) {
		refreshBtn.addEventListener('click', function(e) {
			e.preventDefault();
			updateSampleText();
			setTimeout(updateSampleTextHighlight, 0);
			clearTypingAreaAndReset();
		});
	}
	if (retryBtn) {
		retryBtn.addEventListener('click', clearTypingAreaAndReset);
		setRetryButtonState(true);
	}

	// Real-time feedback: highlight as user types, and auto start/stop
	const textarea = document.querySelector('textarea.form-control');
	if (textarea) {
		textarea.addEventListener('input', function(e) {
			updateSampleTextHighlight();
			if (!testStarted && textarea.value.trim().length > 0) {
				startTypingTestAuto();
			}
		});
		textarea.addEventListener('keydown', function(e) {
			if (e.key === 'Enter') {
				e.preventDefault();
				stopTypingTestAuto();
			}
		});
	}
});
