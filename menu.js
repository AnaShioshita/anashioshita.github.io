let currentActive,
  hamburgerButton,
  hamburgerItems,
  hamburgerMenu,
  infoHighlight,
  infoItems,
  menuItems,
  menuNames,
  menus,
  menuNode;
const mobileMenuItemHeight = 180;
const throttledScroller = throttle(setActiveMenu, 50);

window.addEventListener("DOMContentLoaded", () => {
  infoItems = document.querySelectorAll(".info-bar .info-item");
  infoHighlight = document.querySelector("#info-highlight");
  Array.from(infoItems).forEach((el) => {
    el.addEventListener("mouseover", (e) => setHoverItem(e.target));
    el.addEventListener("mouseout", unsetHoverItem);
  });
  placeInfoHighlight();
  if (window.innerWidth > 480) return;
  findImages();
  menuNode = document.querySelector(".menu");
  prependMenu();
  prependMenu();
  appendMenu();
  appendMenu();
  const initialActive = menus[3].children[0];
  centerAround(initialActive, "auto");
  setActiveMenu(initialActive);
  hamburgerButton = document.querySelector("#hamburger-button");
  hamburgerItems = document.querySelectorAll(".hamburger-item");
  hamburgerMenu = document.querySelector("#hamburger-menu");
  window.addEventListener("scroll", throttledScroller);
  hamburgerButton.addEventListener("click", toggleHamburgerMenu);
  Array.from(hamburgerItems).forEach((el) =>
  el.addEventListener("click", highlightAndClose(el))
  );
});

function activeMenuItem() {
  currentActive = document.querySelector(".active");
  const centerline = window.innerHeight / 2;
  const newActive = menuItems.find((item) => {
    const { top, bottom } = item.getBoundingClientRect();
    return top <= centerline && bottom >= centerline;
  });
  return newActive;
}

function appendMenu() {
  document.querySelector(".content").append(menus[0].cloneNode(true));
  findImages();
}

function closeHamburgerMenu() {
  document.querySelector("#hamburger-menu").classList.remove("open");
}

function centerAround(el, behavior = "smooth") {
  const { top, bottom } = el.getBoundingClientRect();
  window.scrollTo({
    behavior,
    top: window.scrollY + (top + bottom) / 2 - window.innerHeight / 2,
  });
}

function findImages() {
  menus = Array.from(document.querySelectorAll(".menu"));
  menuItems = Array.from(document.querySelectorAll(".menu-item"));
  menuNames = menuItems.map((item) =>
    Array.from(item.classList).find((klass) => klass !== "menu-item")
  );
  Array.from(document.querySelectorAll(".portfolio-link")).forEach((el) => {
    el.addEventListener("click", (e) => {
      if (!Array.from(el.parentElement.classList).includes("active")) {
        e.preventDefault();
        centerAround(el);
      }
    });
  });
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

function placeInfoHighlight() {
  const itemPos = document.querySelector(".info-item.active").getBoundingClientRect().x;
  infoHighlight.style.left = `${itemPos}px`;
}

function prependMenu() {
  document
    .querySelector(".content")
    .insertBefore(
      menuNode.cloneNode(true),
      document.querySelector(".mobile-menu")
    );
  findImages();
}

function openHamburgerMenu() {
  document.querySelector("#hamburger-menu").classList.add("open");
}

function setActiveMenu(item = null) {
  const menuItem = item || activeMenuItem();
  menuItems.forEach((image) => image.classList.remove("active"));
  menuItem.classList.add("active");
  const { bottom } = menus[menus.length - 1].getBoundingClientRect();
  const { top } = menus[0].getBoundingClientRect();
  if (bottom - window.innerHeight < 900) {
    appendMenu();
  }
  if (0 - top < 900) {
    prependMenu();
  }
  if (currentActive && currentActive.classList[1] !== menuItem.classList[1]) {
    centerAround(menuItem);
  }
}

function setHoverItem(newActiveItem) {
	infoItems.forEach(item => item.classList.remove("active"));
  newActiveItem.classList.add("active");
  placeInfoHighlight();
}

function unsetHoverItem() {
	infoItems.forEach((item) => item.classList.remove("active"));
  Array.from(infoItems).find(item => 
    item.href.match(window.location.pathname)
  ).classList.add("active");
  placeInfoHighlight();
}


function throttle(fn, wait) {
  var time = Date.now();
  return function () {
    if (time + wait - Date.now() < 0) {
      fn();
      time = Date.now();
    }
  };
}

function toggleHamburgerMenu() {
  if (Array.from(hamburgerMenu.classList).includes("open")) {
    hamburgerMenu.classList.remove("open");
  } else {
    hamburgerMenu.classList.add("open");
  }
}