(function () {
	var menu = document.getElementById("mobile-menu");
	var openBtn = document.getElementById("mobile-menu-open");
	var trigger = document.getElementById("mobile-dropdown-trigger");
	var dropdown = document.getElementById("mobile-dropdown");

	function toggleMenu() {
		var isOpen = menu.classList.contains("mobile-menu_open");
		if (isOpen) {
			menu.classList.remove("mobile-menu_open");
			menu.setAttribute("aria-hidden", "true");
			openBtn.setAttribute("aria-expanded", "false");
			document.body.style.overflow = "";
		} else {
			menu.classList.add("mobile-menu_open");
			menu.setAttribute("aria-hidden", "false");
			openBtn.setAttribute("aria-expanded", "true");
			document.body.style.overflow = "hidden";
		}
	}
	function toggleDropdown() {
		var open = trigger.getAttribute("aria-expanded") === "true";
		trigger.setAttribute("aria-expanded", !open);
		dropdown.hidden = open;
	}

	if (openBtn) openBtn.addEventListener("click", toggleMenu);
	if (trigger && dropdown) trigger.addEventListener("click", toggleDropdown);
})();
