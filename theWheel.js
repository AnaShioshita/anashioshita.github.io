let currentActive,
  menuItems,
  menuNames,
  menus,
  menuNode;
const mobileMenuItemHeight = 180;
const throttledScroller = throttle(setActiveMenu, 100);

window.addEventListener("load", () => {
  if (window.innerWidth > 480) return;
  window.scrollTo({ behavior: 'auto', top: 0 });
  findImages();
  menuNode = document.querySelector(".menu");
  prependMenu();
  prependMenu();
  appendMenu();
  appendMenu();
  const initialActive = menus[3].children[0];
  centerAround(initialActive, "auto");
  setActiveMenu(initialActive);
  window.addEventListener("scroll", throttledScroller);
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
        setActiveMenu(el);
      }
    });
  });
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
  if (item) {
    centerAround(item);
  }
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