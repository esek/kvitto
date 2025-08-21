import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { RequestHandler } from '@sveltejs/kit';

// I am sorry but this is fucking illegal...
// I should fuck with minio...
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RECEIPTS_UPLOADS_DIR_PATH = path.join(
	__dirname,
	'..',
	'..',
	'..',
	'..',
	'..',
	'uploads',
	'receipts'
);

export const GET: RequestHandler = async ({ params }) => {
	const { filename } = params;
	if (!filename) {
		return new Response('Not found', { status: 404 });
	}

	const filePath = path.join(RECEIPTS_UPLOADS_DIR_PATH, filename);
	console.log(filePath);
	if (!fs.existsSync(filePath)) {
		return new Response('Not found', { status: 404 });
	}

	const fileStream = fs.createReadStream(filePath);

	const ext = path.extname(filename).toLowerCase();
	let contentType: string;
	if (ext === '.pdf') {
		contentType = 'application/pdf';
	} else if (ext === '.jpg' || ext === '.jpeg') {
		contentType = 'image/jpeg';
	} else if (ext === '.png') {
		contentType = 'image/png';
	} else {
		contentType = 'application/octet-stream';
	}

	return new Response(fileStream as unknown as undefined, {
		headers: {
			'Content-Type': contentType
		}
	});
};
