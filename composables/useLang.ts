import { useCookie } from '#app';

export const useLang = () => {
	const locale = useCookie('locale', { default: () => 'en' });

	const switchLanguage = async (newLocale: string) => {
		locale.value = newLocale;

		location.reload()
	};

	return { locale, switchLanguage };
};
