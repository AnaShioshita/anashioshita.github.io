import { placeInfoHighlight, placePortfolioHighlight } from '/navMenu.js';

let modalContainer, imageContainer, images, loadingGif, rows, scrim;

window.addEventListener("DOMContentLoaded", () => {
	rows = document.querySelectorAll(".row");
	loadingGif = document.querySelector(".loading-gif");
	waitForImagesToLoad().then(() => {
		setRowHeights();
		loadingGif.style.display = 'none';
	});
	window.addEventListener("resize", repaint);
	images = document.querySelector(".images");
	modalContainer = document.querySelector(".modal");
	imageContainer = document.querySelector(".modal-image");
	scrim = document.querySelector(".scrim");
	Array.from(document.querySelectorAll(".images img")).forEach((el) =>
		el.addEventListener("click", showImageModal(el))
	);
	Array.from(document.querySelectorAll("video")).forEach((el) => {
		el.addEventListener("click", showVideoModal(el));
	}
	);
	modalContainer.addEventListener("click", hideImageModal);
	placePortfolioHighlight();
});

function calculateAR(item) {
	let styleWidth;
	if (item.style.width.includes("%")) {
		styleWidth = images.clientWidth * parseFloat(item.style.width) / 100;
	} else {
		styleWidth = parseInt(item.style.width, 10);
	}
  const stackRows = item.querySelectorAll(".stack-row");
  if (stackRows.length > 0) {
		return item.dataset.baseHeight / item.dataset.baseWidth;
	};
	if (item.tagName === 'VIDEO') {
		return item.videoHeight / item.videoWidth
	}
	const imgs = item.querySelectorAll("img, video");
	if (imgs.length > 1) {
		const totalHeight = Array.from(imgs).reduce(
			(total, media) => {
				const mediaWidth = media.videoWidth || media.naturalWidth;
				const mediaHeight = media.videoHeight || media.naturalHeight;
				return total + mediaHeight * styleWidth / mediaWidth;
			}
			,
			0
		);
		return totalHeight / styleWidth;
	}
	return imgs[0].naturalHeight / imgs[0].naturalWidth;
}

function calculateHeight(row) {
	let a, b, c, d;
	const ars = Array.from(row.children).map((item) => calculateAR(item));
	const width = images.clientWidth;
	switch (ars.length) {
		case 1:
			return null;
		case 2:
			[a, b] = ars;
			return Math.floor(((width - 20) * a * b) / (a + b));
		case 3:
			[a, b, c] = ars;
			return Math.floor(((width - 40) * a * b * c) / (a * b + b * c + c * a));
		case 4:
			[a, b, c, d] = ars;
			return Math.floor(
				((width - 60) * a * b * c * d) / (a * b * c + a * b * d + a * c * d + b * c * d)
			);
		default:
			return null;
	}
}

function repaint() {
	placePortfolioHighlight();
	placeInfoHighlight();
	setRowHeights();
}

function setRowHeight(row) {
	if (window.innerWidth >= 1200) {
		row.classList.remove("wrapped");
		row.style.height = row.dataset.height || `${calculateHeight(row)}px`;
	} else if (window.innerWidth < 1200) {
		row.classList.add("wrapped");
		row.style.height = null;
	}
}

function setRowHeights() {
	Array.from(rows).forEach((row) => setRowHeight(row));
}

function hideImageModal() {
	imageContainer.innerHTML = null;
	modalContainer.classList.remove("show");
}

function showImageModal(el) {
	return function () {
    const imageEl = `<img src='${el.src.replace(
			"THUMBNAIL",
			"FULLSIZE"
    )}'>`;
		imageContainer.innerHTML = imageEl;
		modalContainer.classList.add("show");
	};
}

function showVideoModal(el) {
	return function() {
		const videoEl = el.cloneNode();
		videoEl.width = 0.9 * window.innerWidth;
		videoEl.controls = true;
		imageContainer.appendChild(videoEl);
		modalContainer.classList.add("show");
	}
}

function waitForImagesToLoad() {
	return Promise.all(
		Array.from(document.querySelectorAll("video"))
			.map(
				(vid) => new Promise((resolve) => {
					vid.onloadedmetadata = vid.onerror = resolve;
				})
			).concat(
				Array.from(document.images)
					.filter((img) => !img.complete)
					.map(
						(img) =>
							new Promise((resolve) => {
								img.onload = img.onerror = resolve;
							})
					)
			)
	);
}
