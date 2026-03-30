const VideoEnhancer = {

	filters: {
		brightness: false,
		contrast: false,
		brightnessValue: 1.3,
		contrastValue: 0.85
	},

	objects: {
		menuButton:  document.querySelector('[data-enhancer-menu-button]'),
		menuWrapper: document.querySelector('[data-enhancer-wrapper="menu"]'),
		valueWrapper: document.querySelectorAll('[data-enhancer-group-holder]'),
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

		this.objects.valueWrapper.forEach(
			(obj) => {
				obj.classList.toggle("state--active", this.filters[obj.getAttribute("data-enhancer-group-holder")])
			}
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

		

		this.objects.menuButton.addEventListener("click", () => {
			this.objects.menuButton?.classList.toggle("state--active");
			this.objects.menuWrapper?.classList.toggle("state--opened");
		});
	}
}
VideoEnhancer.init();