let modalContainer, imageContainer, rows, scrim;
window.addEventListener("DOMContentLoaded", () => {
	rows = document.querySelectorAll(".row");
	waitForImagesToLoad().then(setRowHeights);
	window.addEventListener("resize", setRowHeights);
	modalContainer = document.querySelector(".modal");
	imageContainer = document.querySelector(".modal-image");
	scrim = document.querySelector(".scrim");
	Array.from(document.querySelectorAll(".images img")).forEach((el) => {
		el.addEventListener("click", showImageModal(el));
	});
	modalContainer.addEventListener("click", hideImageModal);
});

function calculateAR(item) {
  const styleWidth = parseInt(item.style.width, 10);
  const styleHeight = parseInt(item.style.height, 10);
  const stackRows = item.querySelectorAll(".stack-row");
  if (stackRows.length > 0) {
    console.log('ROWS', styleHeight / styleWidth);
    return styleHeight / styleWidth;
  };
	const imgs = item.querySelectorAll("img");
	if (imgs.length > 1) {
		const totalHeight = Array.from(imgs).reduce(
			(total, img) => total + img.naturalHeight,
			0
		);
		return totalHeight / styleWidth;
	}
	return imgs[0].naturalHeight / imgs[0].naturalWidth;
}

function calculateHeight(row) {
	let a, b, c, d;
	const ars = Array.from(row.children).map((item) => calculateAR(item));
	switch (ars.length) {
		case 1:
			return null;
		case 2:
			[a, b] = ars;
			return Math.floor((1180 * a * b) / (a + b));
		case 3:
			[a, b, c] = ars;
			return Math.floor((1160 * a * b * c) / (a * b + b * c + c * a));
		case 4:
			[a, b, c, d] = ars;
			return Math.floor(
				(1140 * a * b * c * d) / (a * b * c + a * b * d + a * c * d + b * c * d)
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
		imageContainer.innerHTML = `<img src='${el.src.replace(
			"THUMBNAIL",
			"FULLSIZE"
		)}'>`;
		modalContainer.classList.add("show");
	};
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
