import { createHash } from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Use uploads/receipts instead of static/receipts
const RECEIPTS_UPLOADS_DIR_PATH = path.join(__dirname, '..', '..', 'uploads', 'receipts');

export const saveFile = async (filename: string, file: File) => {
	const hash = createHash('sha256').update(filename).digest('hex') + path.extname(file.name);
	const filePath = path.join(RECEIPTS_UPLOADS_DIR_PATH, hash);

	await fs.promises.mkdir(RECEIPTS_UPLOADS_DIR_PATH, { recursive: true });

	const buffer = await file.arrayBuffer();
	await fs.promises.writeFile(filePath, Buffer.from(buffer));

	// Return the API endpoint for serving the file
	return `/api/receipts/${hash}`;
};
