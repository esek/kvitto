import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import imagemin from 'imagemin';
import imageminPngquant from 'imagemin-pngquant';
import PDFCompressor from 'advanced-pdf-compressor';

// Use process.cwd() to ensure the same base dir for both read and write
const RECEIPTS_UPLOADS_DIR_PATH = path.join(process.cwd(), 'uploads', 'receipts');

export const saveFile = async (filename: string, file: File) => {
	const hash = createHash('sha256').update(filename).digest('hex') + path.extname(file.name);
	const filePath = path.join(RECEIPTS_UPLOADS_DIR_PATH, hash);

	await fs.promises.mkdir(RECEIPTS_UPLOADS_DIR_PATH, { recursive: true });

	const buffer = await file.arrayBuffer();
	await fs.promises.writeFile(filePath, Buffer.from(buffer));

	if (file.type === 'application/pdf') {
		const customCompressor = new PDFCompressor({
			optimizeImages: true,
			imageQuality: 20,
			removeMetadata: true,
			compressionLevel: 5
		});
		customCompressor.compressPDF(filePath, filePath);
	} else if (file.type === 'image/png') {
		await imagemin([filePath], {
			destination: RECEIPTS_UPLOADS_DIR_PATH,
			plugins: [imageminPngquant({ quality: [0.3, 0.4] })]
		});
	}

	// Return the API endpoint for serving the file
	return `/api/receipts/${hash}`;
};
