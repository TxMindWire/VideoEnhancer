
function applyFilters({ brightness, contrast, brightnessValue, contrastValue }) {
  	const filter = (brightness? "brightness("+brightnessValue+")": "") +
			(contrast? "contrast("+contrastValue+")": "");
		document.querySelectorAll("video").forEach((v) => {v.style.filter = filter; });
}

function applyFromStorage(){
	browser.storage.local.get(["brightness", "contrast", "brightnessValue", "contrastValue"]).then((data) => {
		applyFilters(data);
	});
}

browser.runtime.onMessage.addListener((msg) => {
	if (msg.type === "VIDEO_ENHANCER_APPLY") {
		applyFilters(msg.payload);
	}
});

let checkIteration = 0;
let checkInterval = window.setInterval(() => {
	applyFromStorage();
}, 3000);


window.addEventListener('load', () => {
    applyFromStorage();
	window.clearInterval(checkInterval);
});

