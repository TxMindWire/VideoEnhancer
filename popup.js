/*
// popup.js

const brightnessSlider = document.getElementById("brightness");
const contrastSlider   = document.getElementById("contrast");
const brightnessVal    = document.getElementById("brightnessVal");
const contrastVal      = document.getElementById("contrastVal");
const resetBtn         = document.getElementById("resetBtn");
const status           = document.getElementById("status");
const videoBadge       = document.getElementById("videoBadge");

// ── helpers ──────────────────────────────────────────────
function sliderToReal(v) {
	return (parseInt(v) / 100).toFixed(2);
}

function isDefault(sliderVal) {
	return parseInt(sliderVal) === 100;
}

function updateDisplay() {
	const b = sliderToReal(brightnessSlider.value);
	const c = sliderToReal(contrastSlider.value);

	brightnessVal.textContent = b + "×";
	contrastVal.textContent   = c + "×";

	brightnessVal.classList.toggle("changed", !isDefault(brightnessSlider.value));
	contrastVal.classList.toggle("changed",   !isDefault(contrastSlider.value));
}

function showStatus(msg, duration = 1800) {
	status.textContent = msg;
	status.classList.add("visible");
	clearTimeout(status._timer);
	status._timer = setTimeout(() => status.classList.remove("visible"), duration);
}

// ── send filters to content script ───────────────────────
function sendFilters() {
	const payload = {
		brightness: parseFloat(sliderToReal(brightnessSlider.value)),
		contrast:   parseFloat(sliderToReal(contrastSlider.value)),
	};

	browser.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
		if (!tab) return;
		browser.tabs.sendMessage(tab.id, { type: "APPLY_FILTERS", payload })
			.then(() => showStatus("zastosowano ✓"))
			.catch(() => showStatus("brak filmów na stronie"));
	});
}

function resetFilters() {
	brightnessSlider.value = 100;
	contrastSlider.value   = 100;
	updateDisplay();
	saveState();

	browser.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
		if (!tab) return;
		browser.tabs.sendMessage(tab.id, { type: "RESET_FILTERS" })
			.then(() => showStatus("zresetowano"))
			.catch(() => {});
	});
}

// ── persist state ─────────────────────────────────────────


// ── count videos on page ──────────────────────────────────
function fetchVideoCount() {
	browser.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
		if (!tab) return;
		browser.tabs.sendMessage(tab.id, { type: "GET_VIDEO_COUNT" })
			.then(({ count }) => {
				videoBadge.textContent = count + (count === 1 ? " film" : count < 5 ? " filmy" : " filmów");
				videoBadge.classList.toggle("has-videos", count > 0);
			})
			.catch(() => {
				videoBadge.textContent = "— filmów";
			});
	});
}

// ── events ───────────────────────────────────────────────
brightnessSlider.addEventListener("input", () => { updateDisplay(); sendFilters(); saveState(); });
contrastSlider.addEventListener("input",   () => { updateDisplay(); sendFilters(); saveState(); });
resetBtn.addEventListener("click", resetFilters);

// ── init ─────────────────────────────────────────────────
loadState();
fetchVideoCount();
*/

const VideoEnhancer = {

	filters: {
		brightness: false,
		contrast: false,
		brightnessValue: 1.3,
		contrastValue: 0.85
	},

	objects: {
		buttons: document.querySelectorAll('.quick-option[data-enhancer]'),
		ranges: document.querySelectorAll('[data-enhancer-value]'),
		displays: document.querySelectorAll('[data-enhancer-value-display]'),
	},

	init: function() {
		this.appendEvents();
		this.updateDisplay();
	},

	buttonAction:function(e){

	},

	updateDisplay(){
		
		this.objects.buttons.forEach(
			(obj) => obj.classList.toggle("state--active", this.filters[obj.getAttribute("data-enhancer")])
		);

		this.objects.ranges.forEach(
			(obj) => obj.value = (this.filters[obj.getAttribute("data-enhancer-value")] * 100) >> 0
		);

		this.objects.displays.forEach(
			(obj) => {obj.innerHTML = this.filters[obj.getAttribute("data-enhancer-value-display")].toFixed(2)}
		);
	},

	updateFilters(){
		const payload = this.filters;
		try {
			browser.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
				if (!tab) return;
				browser.tabs.sendMessage(tab.id, { type: "VIDEO_ENHANCER_APPLY", payload });
			});

		} catch(e){
			console.warn(e)
		}
		
	},

	saveState() {
		try {
			browser.storage.local.set({
				brightness:	this.filters.brightness,
				contrast:	this.filters.contrast,
			});
		} catch(e) {
			console.warn(e);
		}
	},

	loadState() {
		browser.storage.local.get(["brightness", "contrast"]).then((data) => {
			if (data.brightness)	this.filters.brightness = data.brightness;
			if (data.contrast)   	this.filters.contrast =  data.contrast;
			updateDisplay();
		});
	},

	appendEvents: function(){
		this.objects.buttons.forEach((obj)=> {

			obj.addEventListener("click", () => {

				const enhancerName = obj.getAttribute("data-enhancer");
				this.filters[enhancerName] = !this.filters[enhancerName];

				this.updateDisplay();
				this.updateFilters();
				this.saveState();
			});

		});

		this.objects.ranges.forEach((obj)=> {

			obj.addEventListener("input", (e) => {

				const enhancerName = obj.getAttribute("data-enhancer-value");
				this.filters[enhancerName] = e.target.value * 0.01;

				this.updateDisplay();
				this.updateFilters();
				this.saveState();
			});

		});
	}
}
VideoEnhancer.init();