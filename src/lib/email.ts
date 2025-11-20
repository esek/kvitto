import { dev } from '$app/environment';
import { config } from '@/config.private';
import { UTSKOTT_TO_EMAIL_ADDRESS } from '@/constants/email.constants';
import Routes from '@/constants/routes.constants';
import { UTSKOTT_LABELS } from '@/constants/utskott.contstants';
import { Utskott, type Voucher } from '@prisma/client';

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

export const sendNewVoucherEmail = async (voucher: Voucher) => {
	const subject = `Nytt verifikat att granska!`;
	const body = `<p>Hej! 👋</p>
<p>Ett nytt verifikat har lämnats in.</p>

<p>Verifikatet bär beskrivningen: ${voucher.description}</p>

<p>Du kan granska verifikatet <a href="${config.DEPLOY_URL + Routes.AdminVouchersId(voucher.id)}">här.</a> </p>

<p>Du hittar också alla verifikat <a href="${config.DEPLOY_URL + Routes.AdminVouchers}">på inlämningssidan.</a> 
(Jag tog mig friheten att filtrera på ${UTSKOTT_LABELS[voucher.utskott]} i den länken)</p>

<p>Med vänliga hälsningar,<br/>E-sektionen </p>`;
	return await sendEmail([UTSKOTT_TO_EMAIL_ADDRESS[voucher.utskott]], body, subject);
};

export const sendUpdatedVoucherEmail = async (voucherId: string) => {
	const subject = `Ett verifikat har ändrats!`;
	const body = `<p>Hej! 👋</p>
<p>Ett verifikat har ändrats.</p>

<p>Du kan granska verifikatet <a href="${config.DEPLOY_URL + Routes.AdminVouchersId(voucherId)}">här.</a> </p>

<p>Med vänliga hälsningar,<br/>E-sektionen </p>`;
	return await sendEmail([UTSKOTT_TO_EMAIL_ADDRESS[Utskott.PENGU]], body, subject);
};

export const sendConfirmationEmail = async (voucher: Voucher, email: string) => {
	const subject = `Verifikatbekräftelse för bilaga till ${voucher.description}`;
	const body = `<p>Hej! 👋</p>
<p>Du lämnade precis in ett verifikat!</p>

${
	voucher.attachmentUrl
		? `<p>Du kan hitta den tillhörande bilagan <a href="${config.DEPLOY_URL + voucher.attachmentUrl}">här.</a> </p>
<p>Som du ser via länken ovan har vi sparat din bilaga digitalt vilket betyder att du kan tryggt slänga originalet.
Vill du vara riktigt säker på att du har en kopia kvar kan du alltid ladda ned bilagan från sidan länkad ovan.</p> `
		: `<p>Om det hade funnits en bilaga på det du lämnade in hade vi länkat till den här ifrån. 
		På så sätt kommer du åt det du har lämnat in digitalt så att du kan slänga originalet. Smidigt visst!
		Bra att veta till framtiden!</p>`
}


<p>Med vänliga hälsningar,<br/>E-sektionen </p>`;
	return await sendEmail([email], body, subject);
};
