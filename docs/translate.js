(function () {
	const supportedLanguages = [
		{ code: 'en', name: 'English' },
		{ code: 'ja', name: '日本語' },
		{ code: 'zh-CN', name: '简体中文' },
		{ code: 'zh-TW', name: '繁體中文' },
		{ code: 'ko', name: '한국어' },
		{ code: 'es', name: 'Español' },
		{ code: 'fr', name: 'Français' },
		{ code: 'de', name: 'Deutsch' },
		{ code: 'ru', name: 'Русский' },
		{ code: 'pt', name: 'Português' },
		{ code: 'it', name: 'Italiano' },
		{ code: 'th', name: 'ไทย' },
		{ code: 'vi', name: 'Tiếng Việt' },
		{ code: 'id', name: 'Bahasa Indonesia' },
		{ code: 'pl', name: 'Polski' },
		{ code: 'nl', name: 'Nederlands' },
		{ code: 'tr', name: 'Türkçe' },
		{ code: 'ar', name: 'العربية' }
	];

	const langCodes = supportedLanguages.map((l) => l.code).join(',');

	window.googleTranslateElementInit = function () {
		if (window.google && window.google.translate) {
			new window.google.translate.TranslateElement(
				{
					pageLanguage: 'en',
					includedLanguages: langCodes,
					layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
					autoDisplay: false
				},
				'google_translate_element'
			);
		}
	};

	function setTranslateCookie(targetLang) {
		const host = window.location.hostname;
		document.cookie = `googtrans=/en/${targetLang}; path=/;`;
		if (host) {
			document.cookie = `googtrans=/en/${targetLang}; path=/; domain=${host};`;
		}
	}

	function applyTranslation(targetLang) {
		if (!targetLang) return;
		setTranslateCookie(targetLang);
		const combo = document.querySelector('.goog-te-combo');
		if (combo) {
			combo.value = targetLang;
			combo.dispatchEvent(new Event('change'));
		} else {
			loadGoogleTranslateScript();
			if (!window.location.protocol.startsWith('http')) return;
			setTimeout(() => {
				const retryCombo = document.querySelector('.goog-te-combo');
				if (retryCombo) {
					retryCombo.value = targetLang;
					retryCombo.dispatchEvent(new Event('change'));
				} else if (targetLang !== 'en') {
					window.location.href = `https://translate.google.com/translate?sl=en&tl=${targetLang}&u=${encodeURIComponent(window.location.href)}`;
				}
			}, 1000);
		}
	}

	window.translatePage = applyTranslation;

	function loadGoogleTranslateScript() {
		if (!document.getElementById('google-translate-api')) {
			const s = document.createElement('script');
			s.id = 'google-translate-api';
			s.type = 'text/javascript';
			s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
			document.head.appendChild(s);
		}
	}

	function setupDropdown() {
		const select = document.getElementById('translate-select');
		if (select) {
			select.addEventListener('change', function () {
				applyTranslation(this.value);
			});
		}
		loadGoogleTranslateScript();
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', setupDropdown);
	} else {
		setupDropdown();
	}
})();
