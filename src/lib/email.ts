import { dev } from '$app/environment';
import { config } from '@/config.private';
import { UTSKOTT_TO_EMAIL_ADDRESS } from '@/constants/email.constants';
import Routes from '@/constants/routes.constants';
import { UTSKOTT_LABELS } from '@/constants/utskott.contstants';
import { Utskott } from '@prisma/client';

const sendEmail = async (to: string[], body: string, subject: string) => {
	if (dev) {
		console.log(`Sending email to ${to.join(',')} with subject ${subject}`);
		return {
			success: true,
			message: ['Sucessfully did not do shit you soydev!']
		};
	}

	try {
		await fetch(`${config.EMAIL_URL}/send`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: config.EMAIL_API_KEY
			},
			body: JSON.stringify({
				to: to,
				body,
				subject
			})
		});
	} catch {
		return {
			success: false,
			message: [
				'Kunde inte skicka mail',
				'Undersök om svarsadressen är fel eller kontakta en nörd.'
			]
		};
	}
	return {
		success: true,
		message: ['Skickade mail!']
	};
};

export const sendNewVoucherEmail = async (
	voucherId: string,
	utskott: Utskott,
	description: string
) => {
	const subject = `Nytt verifikat att granska!`;
	const body = `<p>Hej! 👋</p>
<p>Ett nytt verifikat har lämnats in.</p>

<p>Verifikatet bär beskrivningen: ${description}</p>

<p>Du kan granska verifikatet <a href="${config.DEPLOY_URL + Routes.AdminVouchersId(voucherId)}">här.</a> </p>

<p>Du hittar också alla verifikat <a href="${config.DEPLOY_URL + Routes.AdminVouchers}">på inlämningssidan.</a> 
(Jag tog mig friheten att filtrera på ${UTSKOTT_LABELS[utskott]} i den länken)</p>

<p>Med vänliga hälsningar,<br/>E-sektionen </p>`;
	return await sendEmail([UTSKOTT_TO_EMAIL_ADDRESS[utskott]], body, subject);
};

export const sendUpdatedVoucherEmail = async (voucherId: string) => {
	const subject = `Ett verifikat har ändrats!`;
	const body = `<p>Hej! 👋</p>
<p>Ett verifikat har ändrats.</p>

<p>Du kan granska verifikatet <a href="${config.DEPLOY_URL + Routes.AdminVouchersId(voucherId)}">här.</a> </p>

<p>Med vänliga hälsningar,<br/>E-sektionen </p>`;
	return await sendEmail([UTSKOTT_TO_EMAIL_ADDRESS[Utskott.PENGU]], body, subject);
};
