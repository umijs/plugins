import { getAllLocales } from '../plugin-locale/localeExports';

const locales = getAllLocales();

locales.forEach(local => {
    try {
        import(`dayjs/locale/${local.toLocaleLowerCase()}`)
    } catch (error) {
        console.error(error)
    }
})
