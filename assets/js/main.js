(function () {
	var sectionIds = ["header", "quiz", "reviews", "footer"];
	var sections = sectionIds
		.map(function (id) {
			return document.getElementById(id);
		})
		.filter(Boolean);
	var navLinks = document.querySelectorAll(
		".navbar__list .navbar__link[href^='#']",
	);
	var listWrap = document.querySelector(".navbar__list-wrap");
	var activeLine = document.querySelector(".navbar__active-line");
	var headerHeight = 120;

	function moveActiveLine(activeLink) {
		if (!activeLine || !listWrap) return;
		var item = activeLink ? activeLink.closest(".navbar__item") : null;
		if (!item) {
			activeLine.style.opacity = "0";
			return;
		}
		var wrapRect = listWrap.getBoundingClientRect();
		var itemRect = item.getBoundingClientRect();
		activeLine.style.left = itemRect.left - wrapRect.left + "px";
		activeLine.style.width = itemRect.width + "px";
		activeLine.style.opacity = "1";
	}

	function updateActiveNav() {
		var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
		var activeId = null;
		for (var i = sections.length - 1; i >= 0; i--) {
			var el = sections[i];
			if (!el) continue;
			var top = el.getBoundingClientRect().top + scrollTop;
			if (scrollTop + headerHeight >= top - 10) {
				activeId = el.id;
				break;
			}
		}
		if (!activeId && sections[0]) activeId = sections[0].id;
		var activeLink = null;
		navLinks.forEach(function (link) {
			var href = link.getAttribute("href");
			var id = href && href.charAt(0) === "#" ? href.slice(1) : "";
			var isActive = id === activeId;
			link.classList.toggle("navbar__link_active", isActive);
			if (isActive) activeLink = link;
		});
		moveActiveLine(activeLink);
	}
	if (navLinks.length && sections.length) {
		updateActiveNav();
		window.addEventListener(
			"scroll",
			function () {
				updateActiveNav();
			},
			{ passive: true },
		);
		window.addEventListener("resize", function () {
			updateActiveNav();
		});
	}

	document.addEventListener("click", function (e) {
		var link = e.target.closest('a[href="#header"]');
		if (!link) return;
		e.preventDefault();
		window.scrollTo({ top: 0, behavior: "smooth" });
	});
})();

(function () {
	var menu = document.getElementById("mobile-menu");
	var openBtn = document.getElementById("mobile-menu-open");
	var trigger = document.getElementById("mobile-dropdown-trigger");
	var dropdown = document.getElementById("mobile-dropdown");

	function closeMenu() {
		if (!menu || !menu.classList.contains("mobile-menu_open")) return;
		menu.classList.remove("mobile-menu_open");
		menu.setAttribute("aria-hidden", "true");
		if (openBtn) openBtn.setAttribute("aria-expanded", "false");
		document.body.style.overflow = "";
		if (trigger && dropdown) {
			trigger.setAttribute("aria-expanded", "false");
			dropdown.hidden = true;
		}
	}

	function toggleMenu() {
		var isOpen = menu.classList.contains("mobile-menu_open");
		if (isOpen) closeMenu();
		else {
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

	if (menu) {
		menu.addEventListener("click", function (e) {
			var anchor = e.target.closest('a[href^="#"]');
			if (!anchor) return;
			closeMenu();
		});
	}
})();

(function () {
	var openTriggers = document.querySelectorAll("[data-modal-open]");
	var modals = document.querySelectorAll(".modal");

	function openModal(id) {
		var modal = document.getElementById(id);
		if (!modal) return;
		var menu = document.getElementById("mobile-menu");
		if (menu && menu.classList.contains("mobile-menu_open")) {
			menu.classList.remove("mobile-menu_open");
			menu.setAttribute("aria-hidden", "true");
			var openBtn = document.getElementById("mobile-menu-open");
			if (openBtn) openBtn.setAttribute("aria-expanded", "false");
		}
		modal.classList.add("modal_open");
		modal.setAttribute("aria-hidden", "false");
		modal.setAttribute("aria-modal", "true");
		document.body.style.overflow = "hidden";
	}

	function closeModal(modal) {
		if (!modal || !modal.classList.contains("modal_open")) return;
		modal.classList.remove("modal_open");
		modal.setAttribute("aria-hidden", "true");
		modal.setAttribute("aria-modal", "false");
		document.body.style.overflow = "";
		var dialog = modal.querySelector(".modal__dialog");
		if (dialog) dialog.classList.remove("modal__dialog_success");
	}

	document.querySelectorAll("form[data-contact-form]").forEach(function (form) {
		var nameWrap = form.querySelector(
			".modal__row_two .input-text-group[data-required]",
		);
		var nameInput = form.querySelector('input[name="name"]');
		var commentGroup = form.querySelector(
			".modal__field-row.input-text-group[data-required]",
		);
		var commentInput = form.querySelector('textarea[name="comment"]');

		function clearInvalid(el) {
			if (el && el.classList) el.classList.remove("is-invalid");
		}

		if (nameInput) {
			nameInput.addEventListener("input", function () {
				clearInvalid(nameWrap);
			});
			nameInput.addEventListener("change", function () {
				clearInvalid(nameWrap);
			});
		}
		if (commentInput) {
			commentInput.addEventListener("input", function () {
				clearInvalid(commentGroup);
			});
			commentInput.addEventListener("change", function () {
				clearInvalid(commentGroup);
			});
		}

		form.addEventListener("submit", function (e) {
			e.preventDefault();
			var modal = form.closest(".modal");
			if (!modal) return;
			var nameValid = nameInput && nameInput.value.trim().length > 0;
			var commentValid = commentInput && commentInput.value.trim().length > 0;
			if (nameWrap) nameWrap.classList.toggle("is-invalid", !nameValid);
			if (commentGroup)
				commentGroup.classList.toggle("is-invalid", !commentValid);
			if (!nameValid || !commentValid) return;
			var dialog = modal.querySelector(".modal__dialog");
			if (dialog) dialog.classList.add("modal__dialog_success");
		});
	});

	openTriggers.forEach(function (btn) {
		btn.addEventListener("click", function () {
			var id = btn.getAttribute("data-modal-open");
			if (id) openModal(id);
		});
	});

	modals.forEach(function (modal) {
		modal.querySelectorAll("[data-modal-close]").forEach(function (closeBtn) {
			closeBtn.addEventListener("click", function () {
				closeModal(modal);
			});
		});
		var backdrop = modal.querySelector(".modal__backdrop");
		if (backdrop)
			backdrop.addEventListener("click", function () {
				closeModal(modal);
			});
	});

	document.addEventListener("keydown", function (e) {
		if (e.key !== "Escape") return;
		modals.forEach(function (modal) {
			if (modal.classList.contains("modal_open")) closeModal(modal);
		});
	});
})();

(function () {
	if (typeof gsap === "undefined" || typeof Flip === "undefined") return;
	gsap.registerPlugin(Flip);

	var quizCards = document.querySelector(".quiz__cards");
	var quizQuestions = document.querySelector(".quiz__questions");
	if (!quizCards || !quizQuestions) return;

	var questionItems = quizQuestions.querySelectorAll(".quiz__questions-item");
	var cardItems = quizCards.querySelectorAll(".quiz__cards-item");
	var maxReachedStep = 1;
	var currentStep = 1;
	var mobileQuery = window.matchMedia("(max-width: 1279px)");
	function isMobile() {
		return mobileQuery.matches;
	}

	function getCardByStep(step) {
		return quizCards.querySelector(
			'.quiz__cards-item[data-card-id="' + step + '"]',
		);
	}

	function getStackState(depth) {
		if (depth === 0) return { zIndex: 10, scale: 1, y: 0 };
		if (depth === 1) return { zIndex: 9, scale: 0.98, y: -8 };
		return { zIndex: 8, scale: 0.96, y: -16 };
	}

	function updateCardStack(step) {
		if (isMobile()) {
			cardItems.forEach(function (card) {
				var id = parseInt(card.getAttribute("data-card-id"), 10);
				var isActive = id === step;
				card.classList.toggle("quiz__cards-item_active", isActive);
				gsap.set(card, {
					visibility: isActive ? "visible" : "hidden",
					zIndex: isActive ? 10 : 0,
					opacity: 1,
				});
			});
			setActiveQuestion(String(step));
			updateBackButtonVisibility();
			setCardsAriaHidden();
			return;
		}
		cardItems.forEach(function (card) {
			var id = parseInt(card.getAttribute("data-card-id"), 10);
			var depth = id - step;
			var visible = depth >= 0 && depth <= 2;
			card.classList.toggle("quiz__cards-item_active", depth === 0);
			if (!visible) {
				gsap.set(card, {
					visibility: "hidden",
					zIndex: 0,
					scale: 0.94,
					y: -24,
					backgroundColor: deckColors[0],
				});
				return;
			}
			var state = getStackState(depth);
			gsap.set(card, {
				visibility: "visible",
				zIndex: state.zIndex,
				scale: state.scale,
				y: state.y,
			});
			if (depth === 0) gsap.set(card, { clearProps: "backgroundColor,color" });
			else gsap.set(card, { backgroundColor: getDeckColor(depth) });
		});
		setActiveQuestion(String(step));
		updateBackButtonVisibility();
		setCardsAriaHidden();
	}

	function setActiveQuestion(cardId) {
		var activeId = cardId === "4" ? "3" : cardId;
		questionItems.forEach(function (item) {
			item.classList.toggle(
				"quiz__questions-item_active",
				item.getAttribute("data-question-id") === String(activeId),
			);
		});
	}

	function updateReachedVisibility() {
		questionItems.forEach(function (item) {
			var id = parseInt(item.getAttribute("data-question-id"), 10);
			item.classList.toggle(
				"quiz__questions-item_reached",
				id <= maxReachedStep,
			);
		});
	}

	function updateBackButtonVisibility() {
		cardItems.forEach(function (card) {
			var backBtn = card.querySelector(".quiz__btn_back");
			if (backBtn)
				backBtn.classList.toggle(
					"quiz__btn_back_hidden",
					card.getAttribute("data-card-id") === "1" ||
						!card.classList.contains("quiz__cards-item_active"),
				);
		});
	}

	function setCardsAriaHidden() {
		cardItems.forEach(function (card) {
			card.setAttribute(
				"aria-hidden",
				card.classList.contains("quiz__cards-item_active") ? "false" : "true",
			);
		});
	}

	function getSelectedAnswerText(card) {
		var blocks = card.querySelectorAll("[data-answer-type]");
		var parts = [];
		blocks.forEach(function (block) {
			var type = block.getAttribute("data-answer-type");
			if (type === "checkbox") {
				block.querySelectorAll("input:checked").forEach(function (input) {
					var label = input.closest("label");
					if (label) parts.push(label.textContent.trim());
				});
			} else if (type === "radio") {
				var input = block.querySelector("input:checked");
				if (input) {
					var label = input.closest("label");
					if (label) parts.push(label.textContent.trim());
				}
			} else if (type === "text" || type === "select") {
				var input = block.querySelector("input, select");
				if (input && input.value.trim()) parts.push(input.value.trim());
			}
		});
		return parts.join(", ");
	}

	function hasSelection(card) {
		var cardId = card.getAttribute("data-card-id");
		if (cardId === "4") return true;
		if (cardId === "3") {
			var textBlock = card.querySelector('[data-answer-type="text"]');
			if (textBlock) {
				var input = textBlock.querySelector(
					"input[type='text'], input:not([type])",
				);
				if (input && input.hasAttribute("required") && !input.value.trim())
					return false;
			}
			return true;
		}
		var block = card.querySelector("[data-answer-type]");
		if (!block) return true;
		var type = block.getAttribute("data-answer-type");
		if (type === "checkbox")
			return block.querySelector("input:checked") !== null;
		if (type === "radio") return block.querySelector("input:checked") !== null;
		return true;
	}

	var deckColors = ["#e9c4ff", "#f0d9ff", "#f9efff"];

	function getDeckColor(depth) {
		return (
			deckColors[Math.min(depth - 1, deckColors.length - 1)] || deckColors[0]
		);
	}

	function revealCard(card) {
		if (!card) return;
		if (isMobile()) {
			gsap.set(card, { opacity: 1, clearProps: "backgroundColor" });
			return;
		}
		gsap.set(card, { opacity: 0, backgroundColor: deckColors[0] });
		gsap.to(card, {
			opacity: 1,
			backgroundColor: "#ffffff",
			duration: 1,
			ease: "sine.out",
			overwrite: "auto",
			onComplete: function () {
				gsap.set(card, { clearProps: "backgroundColor" });
			},
		});
	}

	function moveCardToBack() {
		var card = getCardByStep(currentStep);
		if (!card || currentStep >= 4) return;
		var nextStep = currentStep + 1;
		var nextCard = getCardByStep(nextStep);
		if (isMobile()) {
			currentStep = nextStep;
			gsap.set(card, { yPercent: 0 });
			updateCardStack(currentStep);
			maxReachedStep = Math.min(3, Math.max(maxReachedStep, currentStep));
			updateReachedVisibility();
			if (nextCard) revealCard(nextCard);
			return;
		}
		gsap.to(card, {
			yPercent: -115,
			duration: 0.22,
			ease: "power2.in",
			onComplete: function () {
				currentStep = nextStep;
				gsap.set(card, { yPercent: 0 });
				updateCardStack(currentStep);
				maxReachedStep = Math.min(3, Math.max(maxReachedStep, currentStep));
				updateReachedVisibility();
				if (nextCard) revealCard(nextCard);
			},
		});
	}

	function moveCardToFront() {
		if (currentStep <= 1) return;
		var card = getCardByStep(currentStep);
		var prevStep = currentStep - 1;
		var prevCard = getCardByStep(prevStep);
		if (isMobile()) {
			currentStep = prevStep;
			gsap.set(card, { yPercent: 0, clearProps: "all" });
			updateCardStack(currentStep);
			revealCard(prevCard);
			return;
		}
		gsap.to(card, {
			yPercent: 115,
			duration: 0.35,
			ease: "power2.in",
			onComplete: function () {
				currentStep = prevStep;
				gsap.set(card, {
					yPercent: 0,
					visibility: "hidden",
					zIndex: 0,
					scale: 0.94,
					y: -24,
					backgroundColor: deckColors[0],
				});
				updateCardStack(currentStep);
				revealCard(prevCard);
			},
		});
	}

	function goToCard(cardId) {
		var idNum = parseInt(cardId, 10);
		if (idNum > maxReachedStep || idNum === currentStep) return;
		var card = getCardByStep(currentStep);
		var targetCard = getCardByStep(idNum);
		if (!card || !targetCard) return;
		var goForward = idNum > currentStep;
		if (isMobile()) {
			currentStep = idNum;
			gsap.set(card, { yPercent: 0, clearProps: "all" });
			updateCardStack(currentStep);
			if (goForward) {
				maxReachedStep = Math.min(3, Math.max(maxReachedStep, currentStep));
				updateReachedVisibility();
			}
			revealCard(targetCard);
			return;
		}
		gsap.to(card, {
			yPercent: goForward ? -115 : 115,
			duration: goForward ? 0.22 : 0.35,
			ease: "power2.in",
			onComplete: function () {
				currentStep = idNum;
				gsap.set(card, {
					yPercent: 0,
					visibility: "hidden",
					zIndex: 0,
					scale: 0.94,
					y: -24,
					backgroundColor: deckColors[0],
				});
				updateCardStack(currentStep);
				if (goForward) {
					maxReachedStep = Math.min(3, Math.max(maxReachedStep, currentStep));
					updateReachedVisibility();
				}
				revealCard(targetCard);
			},
		});
	}

	quizQuestions.addEventListener("click", function (e) {
		var item = e.target.closest(".quiz__questions-item_reached");
		if (!item) return;
		var id = item.getAttribute("data-question-id");
		if (id) goToCard(id);
	});

	quizCards.addEventListener("click", function (e) {
		var nextBtn = e.target.closest(".quiz__btn_next");
		var backBtn = e.target.closest(".quiz__btn_back");
		if (nextBtn) {
			var card = getCardByStep(currentStep);
			if (!card) return;
			if (!hasSelection(card)) {
				var group = card.querySelector(".input-text-group");
				if (group) {
					group.classList.add("is-invalid");
					var req = group.querySelector(".input-text-group__required");
					if (req) req.setAttribute("aria-hidden", "false");
				}
				return;
			}
			var groupToClear = card.querySelector(".input-text-group");
			if (groupToClear) {
				groupToClear.classList.remove("is-invalid");
				var req = groupToClear.querySelector(".input-text-group__required");
				if (req) req.setAttribute("aria-hidden", "true");
			}
			if (currentStep !== 4) {
				var answerEl = quizQuestions.querySelector(
					'.quiz__questions-item[data-question-id="' +
						currentStep +
						'"] .quiz__questions-item_answer',
				);
				if (answerEl) answerEl.textContent = getSelectedAnswerText(card);
			}
			moveCardToBack();
		} else if (
			backBtn &&
			!backBtn.classList.contains("quiz__btn_back_hidden")
		) {
			moveCardToFront();
		}
	});

	updateCardStack(1);
	updateReachedVisibility();
})();

(function () {
	var arrowSvg =
		'<svg class="quiz__select-arrow select__arrow" width="10" height="18" viewBox="0 0 10 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L8.29289 8.29289C8.68342 8.68342 8.68342 9.31658 8.29289 9.70711L1 17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
	function initCustomSelect(block) {
		var select = block.querySelector("select");
		if (!select) return;
		var wrap = document.createElement("div");
		wrap.className = "quiz__select-wrap select__wrap";
		select.parentNode.insertBefore(wrap, select);
		wrap.appendChild(select);
		select.classList.add("quiz__select-native", "select__native");
		select.setAttribute("aria-hidden", "true");
		select.setAttribute("tabindex", "-1");

		var trigger = document.createElement("button");
		trigger.type = "button";
		trigger.className = "quiz__select-trigger select__trigger";
		trigger.setAttribute("aria-expanded", "false");
		trigger.setAttribute("aria-haspopup", "listbox");
		trigger.setAttribute(
			"id",
			select.id ? select.id + "-trigger" : "quiz-select-trigger",
		);
		var valueSpan = document.createElement("span");
		valueSpan.className = "quiz__select-value select__value";
		valueSpan.textContent = select.selectedOptions.length
			? select.selectedOptions[0].textContent
			: "";
		trigger.appendChild(valueSpan);
		trigger.insertAdjacentHTML("beforeend", arrowSvg);

		var list = document.createElement("ul");
		list.className = "quiz__select-list select__list";
		list.setAttribute("role", "listbox");
		list.hidden = true;
		Array.prototype.forEach.call(select.options, function (opt) {
			var li = document.createElement("li");
			li.className = "quiz__select-option select__option";
			li.setAttribute("role", "option");
			li.setAttribute("data-value", opt.value);
			li.textContent = opt.textContent;
			list.appendChild(li);
		});

		wrap.appendChild(trigger);
		wrap.appendChild(list);

		function updateTriggerText() {
			valueSpan.textContent = select.selectedOptions.length
				? select.selectedOptions[0].textContent
				: "";
		}
		function open() {
			list.hidden = false;
			trigger.setAttribute("aria-expanded", "true");
			trigger.classList.add(
				"quiz__select-trigger_open",
				"select__trigger_open",
			);
		}
		function close() {
			list.hidden = true;
			trigger.setAttribute("aria-expanded", "false");
			trigger.classList.remove(
				"quiz__select-trigger_open",
				"select__trigger_open",
			);
		}
		function toggle() {
			if (list.hidden) open();
			else close();
		}
		trigger.addEventListener("click", function (e) {
			e.preventDefault();
			e.stopPropagation();
			toggle();
		});
		list.addEventListener("click", function (e) {
			var li = e.target.closest(".quiz__select-option");
			if (!li) return;
			select.value = li.getAttribute("data-value");
			updateTriggerText();
			close();
		});
		document.addEventListener("click", function (e) {
			if (!wrap.contains(e.target)) close();
		});
		updateTriggerText();
	}
	document
		.querySelectorAll('.quiz__answer-block[data-answer-type="select"]')
		.forEach(initCustomSelect);
})();

(function () {
	document.querySelectorAll(".input-text-group").forEach(function (group) {
		var input = group.querySelector("input[type='text'], input:not([type])");
		if (!input) return;
		function clearInvalid() {
			if (input.value.trim()) {
				group.classList.remove("is-invalid");
				var req = group.querySelector(".input-text-group__required");
				if (req) req.setAttribute("aria-hidden", "true");
			}
		}
		input.addEventListener("input", clearInvalid);
		input.addEventListener("blur", clearInvalid);
	});
})();

(function () {
	document
		.querySelectorAll(".input-text-group__file")
		.forEach(function (label) {
			var fileInput = label.querySelector("input[type='file']");
			var textEl = label.querySelector(".input-text-group__file-text");
			var defaultText = textEl && textEl.getAttribute("data-default");
			if (!fileInput || !textEl) return;
			fileInput.addEventListener("change", function () {
				var files = fileInput.files;
				if (files && files.length > 0) {
					label.classList.add("has-file");
					textEl.textContent = files[0].name;
					textEl.setAttribute("title", files[0].name);
				} else {
					label.classList.remove("has-file");
					textEl.textContent = defaultText || "Приложить файлы";
					textEl.removeAttribute("title");
				}
			});
		});
})();

(function () {
	if (typeof EmblaCarousel === "undefined") return;
	var viewport = document.getElementById("reviews-embla");
	var prevBtn = document.getElementById("reviews-prev");
	var nextBtn = document.getElementById("reviews-next");
	if (!viewport) return;
	var embla = EmblaCarousel(viewport, {
		loop: true,
		align: "center",
		containScroll: false,
		dragFree: false,
		slidesToScroll: 1,
	});
	if (prevBtn)
		prevBtn.addEventListener("click", function () {
			embla.scrollPrev();
		});
	if (nextBtn)
		nextBtn.addEventListener("click", function () {
			embla.scrollNext();
		});
})();

(function () {
	if (typeof EmblaCarousel === "undefined") return;
	var viewport = document.getElementById("reactions-embla");
	if (!viewport) return;
	var mq = window.matchMedia("(max-width: 1279px)");
	var embla = null;

	function initReactions() {
		if (embla) return;
		embla = EmblaCarousel(viewport, {
			loop: true,
			align: "start",
			containScroll: "trimSnaps",
			dragFree: false,
			slidesToScroll: 1,
		});
		var prevBtn = document.getElementById("reactions-prev");
		var nextBtn = document.getElementById("reactions-next");
		if (prevBtn)
			prevBtn.addEventListener("click", function () {
				embla.scrollPrev();
			});
		if (nextBtn)
			nextBtn.addEventListener("click", function () {
				embla.scrollNext();
			});
	}

	function destroyReactions() {
		if (!embla) return;
		embla.destroy();
		embla = null;
		var prevBtn = document.getElementById("reactions-prev");
		var nextBtn = document.getElementById("reactions-next");
		if (prevBtn && prevBtn.cloneNode)
			prevBtn.replaceWith(prevBtn.cloneNode(true));
		if (nextBtn && nextBtn.cloneNode)
			nextBtn.replaceWith(nextBtn.cloneNode(true));
	}

	function handle() {
		if (mq.matches) initReactions();
		else destroyReactions();
	}

	mq.addEventListener("change", handle);
	handle();
})();
