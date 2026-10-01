(function () {
	const sourceLanguage = 'en';
	const scriptId = 'google-translate-api';
	const hostId = 'google_translate_element';

	function getSelect() {
		return document.getElementById('translate-select');
	}

	function supportedCodes() {
		const select = getSelect();
		return select ? Array.from(select.options, (option) => option.value) : [];
	}

	function writeCookie(value, maxAge) {
		const base = `googtrans=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
		document.cookie = base;
		if (window.location.hostname) {
			document.cookie = `${base}; domain=${window.location.hostname}`;
		}
	}

	function setTranslationCookie(language) {
		if (language === sourceLanguage) {
			writeCookie('', 0);
		} else {
			writeCookie(`/${sourceLanguage}/${language}`, 31536000);
		}
	}

	function readTranslationCookie() {
		const match = document.cookie.match(/(?:^|;\s*)googtrans=\/[^/;]*\/([^;]+)/);
		return match ? decodeURIComponent(match[1]) : sourceLanguage;
	}

	function isTranslated() {
		const classes = document.documentElement.classList;
		return classes.contains('translated-ltr') || classes.contains('translated-rtl');
	}

	function consumeLanguageParameter() {
		const url = new URL(window.location.href);
		const requested = url.searchParams.get('lang');
		if (!requested) return;
		if (supportedCodes().includes(requested)) {
			setTranslationCookie(requested);
		}
		url.searchParams.delete('lang');
		window.history.replaceState(null, '', url.toString());
	}

	function removeStaticFallbackMenus() {
		document.querySelectorAll('#translate-menu, #user-content-translate-menu').forEach((menu) => {
			const wrapper = menu.parentElement;
			if (wrapper && wrapper.tagName === 'DIV' && wrapper.children.length === 1) {
				wrapper.remove();
			} else {
				menu.remove();
			}
		});
	}

	function googleCombo() {
		return document.querySelector('select.goog-te-combo');
	}

	function applyLanguage(language) {
		setTranslationCookie(language);
		if (language === sourceLanguage) {
			if (isTranslated()) window.location.reload();
			return;
		}
		const combo = googleCombo();
		if (combo) {
			combo.value = language;
			combo.dispatchEvent(new Event('change', { bubbles: true }));
		} else {
			window.location.reload();
		}
	}

	function ensureHost() {
		if (document.getElementById(hostId)) return;
		const host = document.createElement('div');
		host.id = hostId;
		host.hidden = true;
		document.body.appendChild(host);
	}

	function loadGoogleTranslate() {
		if (document.getElementById(scriptId)) return;
		ensureHost();
		window.googleTranslateElementInit = function () {
			if (!window.google || !window.google.translate) return;
			new window.google.translate.TranslateElement(
				{
					pageLanguage: sourceLanguage,
					includedLanguages: supportedCodes().join(','),
					autoDisplay: false
				},
				hostId
			);
		};
		const script = document.createElement('script');
		script.id = scriptId;
		script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
		script.async = true;
		document.head.appendChild(script);
	}

	function init() {
		removeStaticFallbackMenus();
		const select = getSelect();
		if (!select) return;
		consumeLanguageParameter();
		const current = readTranslationCookie();
		select.value = supportedCodes().includes(current) ? current : sourceLanguage;
		select.disabled = false;
		select.addEventListener('change', () => applyLanguage(select.value));
		loadGoogleTranslate();
	}

	init();
})();
