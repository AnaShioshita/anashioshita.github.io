let activeTab,
  hamburgerButton,
  hamburgerItems,
  hamburgerMenu,
  infoItems,
  infoHighlight,
  portfolioBar,
  portfolioHighlight,
  portfolioItems,
  portfolioCoverLeft,
  portfolioCoverRight;

export const placeInfoHighlight = () => {
  const item = document.querySelector(".info-item.active");
  const rect = item.getBoundingClientRect();
  const itemPos = rect.x;
  infoHighlight.style.left = `${itemPos}px`;
};

export const placePortfolioHighlight = () => {
  if (!portfolioHighlight) return;
  const { width, x } = document
    .querySelector(".portfolio-item.current")
    .getBoundingClientRect();
  portfolioHighlight.style.width = `${width}px`;
  portfolioHighlight.style.left = `${Math.floor(x)}.px`;
};

window.addEventListener("load", () => {
  placeInfoHighlight();
  if (portfolioBar) {
    revealPortfolioBar();
    portfolioHighlight.style.transition = "0.2s";
  }
})

window.addEventListener("DOMContentLoaded", () => {
  hamburgerButton = document.querySelector("#hamburger-button");
  hamburgerItems = document.querySelectorAll(".hamburger-item");
  hamburgerMenu = document.querySelector("#hamburger-menu");
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
  infoHighlight.style.display = "block";
  infoHighlight.style.transition = "0.2s";
  placeInfoHighlight();
  hamburgerButton.addEventListener("click", toggleHamburgerMenu);
  Array.from(hamburgerItems).forEach((el) =>
    el.addEventListener("click", highlightAndClose(el))
  );
});

function closeHamburgerMenu() {
  document.querySelector("#hamburger-menu").classList.remove("open");
}

function highlightAndClose(el) {
  return function (e) {
    el.classList.add("selected");
    setTimeout(function () {
      toggleHamburgerMenu();
      setTimeout(function () {
        window.location.pathname = el.dataset.url;
      }, 200);
    }, 200);
  };
}

function openHamburgerMenu() {
  document.querySelector("#hamburger-menu").classList.add("open");
}

function revealPortfolioBar() {
  if (window.innerWidth < 481) return;
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
    placePortfolioHighlight();
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


function toggleHamburgerMenu() {
  if (Array.from(hamburgerMenu.classList).includes("open")) {
    hamburgerMenu.classList.remove("open");
  } else {
    hamburgerMenu.classList.add("open");
  }
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
  Array.from(portfolioItems)
    .find(({ href }) => href.match(window.location.pathname))
    .classList.add("current");
  placePortfolioHighlight();
}
