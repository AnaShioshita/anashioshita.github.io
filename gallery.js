let modalContainer, imageContainer, images, rows, scrim;
window.addEventListener("DOMContentLoaded", () => {
	rows = document.querySelectorAll(".row");
	waitForImagesToLoad().then(setRowHeights);
	window.addEventListener("resize", setRowHeights);
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
});

function calculateAR(item) {
	let styleWidth, styleHeight, widthScale;
	if (item.style.width.includes("%")) {
		styleWidth = images.clientWidth * parseFloat(item.style.width) / 100;
	} else {
		styleWidth = parseInt(item.style.width, 10);
	}
  const stackRows = item.querySelectorAll(".stack-row");
  if (stackRows.length > 0) {
		return item.dataset.baseHeight / item.dataset.baseWidth;
  };
	const imgs = item.querySelectorAll("img");
	if (imgs.length > 1) {
		const totalHeight = Array.from(imgs).reduce(
			(total, img) => {
				return total + img.naturalHeight * styleWidth / img.naturalWidth;
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

function setRowHeight(row) {
	if (window.innerWidth >= 1200 && !row.style.height) {
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
		imageContainer.innerHTML = `<img src='${el.src}'>`;
		modalContainer.classList.add("show");
	};
}

function showVideoModal(el) {
	return function() {
		const videoEl = el.cloneNode();
		videoEl.width = 0.9 * window.innerWidth;
		imageContainer.appendChild(videoEl);
		modalContainer.classList.add("show");
	}
}

function waitForImagesToLoad() {
	return Promise.all(
		Array.from(document.images)
			.filter((img) => !img.complete)
			.map(
				(img) =>
					new Promise((resolve) => {
						img.onload = img.onerror = resolve;
					})
			)
	);
}
