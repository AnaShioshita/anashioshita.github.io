let activeTab,
  infoItems,
  infoHighlight,
  portfolioBar,
  portfolioHighlight,
  portfolioItems,
  portfolioCoverLeft,
  portfolioCoverRight;

window.addEventListener("DOMContentLoaded", () => {
  infoItems = document.querySelectorAll(".info-bar .info-item");
  infoHighlight = document.querySelector("#info-highlight");
  portfolioBar = document.querySelector(".portfolio-bar");
  portfolioCoverLeft = document.querySelector(".portfolio-cover-left");
  portfolioCoverRight = document.querySelector(".portfolio-cover-right");
  portfolioHighlight = document.querySelector("#portfolio-highlight");
  portfolioItems = document.querySelectorAll(".portfolio-item");
  activeTab = document.querySelector(".info-item.active");
  Array.from(infoItems).forEach((el) => {
    el.addEventListener("mouseover", (e) => setHoverItem(e.target));
    el.addEventListener("mouseout", unsetHoverItem);
  });
  Array.from(portfolioItems).forEach((el) => {
    el.addEventListener("mouseover", () => setPortfolioItem(el));
    el.addEventListener("mouseout", unsetPortfolioItem);
  });
  placeInfoHighlight();
  infoHighlight.style.display = "block";
  infoHighlight.style.transition = "0.2s";
  if (portfolioBar) {
    placePortfolioHighlight();
    revealPortfolioBar();
    portfolioHighlight.style.transition = "0.2s";
  }
});

function placeInfoHighlight() {
  const itemPos = document
    .querySelector(".info-item.active")
    .getBoundingClientRect().x;
  infoHighlight.style.left = `${itemPos}px`;
}

function placePortfolioHighlight() {
  const itemPos = document
    .querySelector(".portfolio-item.current")
    .getBoundingClientRect().x;
  portfolioHighlight.style.left = `${Math.floor(itemPos)}.px`;
}

function revealPortfolioBar() {
  portfolioHighlight.style.display = "block";
  const { left, right } = activeTab.getBoundingClientRect();
  portfolioCoverLeft.style.right = `${portfolioBar.clientWidth - left}px`;
  portfolioCoverRight.style.left = `${right}px`;
  portfolioBar.style.transform = "none";
  setTimeout(function () {
    portfolioCoverLeft.style.transition = "0.2s";
    portfolioCoverRight.style.transition = "0.2s";
    portfolioCoverLeft.style.right = "100%";
    portfolioCoverRight.style.left = "100%";
  }, 150);
}

function setHoverItem(newActiveItem) {
  infoItems.forEach((item) => item.classList.remove("active"));
  newActiveItem.classList.add("active");
  placeInfoHighlight();
}

function setPortfolioItem(newCurrentItem) {
  portfolioItems.forEach((item) => item.classList.remove("current"));
  newCurrentItem.classList.add("current");
  placePortfolioHighlight();
}

function unsetHoverItem() {
  infoItems.forEach((item) => item.classList.remove("active"));
  if (
    ["about-me", "contact", "resume"].find((title) =>
      window.location.pathname.match(title)
    )
  ) {
    Array.from(infoItems)
      .find(({ href }) => href.match(window.location.pathname))
      .classList.add("active");
  } else {
    Array.from(infoItems)
      .find(({ href }) => href.match("portfolio"))
      .classList.add("active");
  }
  placeInfoHighlight();
}

function unsetPortfolioItem() {
  portfolioItems.forEach((item) => item.classList.remove("current"));
  const item = Array.from(portfolioItems).find(({ href }) =>
    href.match(window.location.pathname)
  );
  Array.from(portfolioItems)
    .find(({ href }) => href.match(window.location.pathname))
    .classList.add("current");
  placePortfolioHighlight();
}
