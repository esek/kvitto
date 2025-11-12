import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/sv';
import isoWeek from 'dayjs/plugin/isoWeek';
dayjs.extend(utc);
dayjs.locale('sv');
dayjs.extend(isoWeek);

export const toDate = (date?: dayjs.ConfigType, format?: string) =>
	dayjs.utc(date, format).toDate();

export const formatTime = (date?: dayjs.ConfigType) => dayjs.utc(date).format('HH:mm');

export const formatDate = (date?: dayjs.ConfigType, format?: string) =>
	dayjs.utc(date).format(format ?? 'YYYY-MM-DD');

export const formatWeekdayMonthTime = (date?: dayjs.ConfigType) =>
	dayjs.utc(date).format('dddd D MMMM kl HH:mm');

export const getWeekNumberByDate = (date?: dayjs.ConfigType) => dayjs(date).isoWeek();
