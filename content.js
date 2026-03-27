// content.js – nasłuchuje wiadomości z popup i stosuje filtry CSS do wszystkich <video>

function applyFilters({ brightness, contrast }) {
  	const videos = document.querySelectorAll("video");
  	const filter = `brightness(${brightness}) contrast(${contrast})`;
  	videos.forEach((v) => { v.style.filter = filter; });
}

browser.runtime.onMessage.addListener((msg) => {
	if (msg.type === "VIDEO_ENHANCER_APPLY") {
		const filter = (msg.payload.brightness? "brightness("+msg.payload.brightnessValue+")": "") +
			(msg.payload.contrast? "contrast("+msg.payload.contrastValue+")": "");
		document.querySelectorAll("video").forEach((v) => {v.style.filter = filter; });
	}
});
