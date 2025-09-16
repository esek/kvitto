import { createHash } from 'crypto';
import fs from 'fs';
import path from 'path';

// Use process.cwd() to ensure the same base dir for both read and write
const RECEIPTS_UPLOADS_DIR_PATH = path.join(process.cwd(), 'uploads', 'receipts');

export const saveFile = async (filename: string, file: File) => {
	const hash = createHash('sha256').update(filename).digest('hex') + path.extname(file.name);
	const filePath = path.join(RECEIPTS_UPLOADS_DIR_PATH, hash);

	await fs.promises.mkdir(RECEIPTS_UPLOADS_DIR_PATH, { recursive: true });

	const buffer = await file.arrayBuffer();
	await fs.promises.writeFile(filePath, Buffer.from(buffer));

	// Return the API endpoint for serving the file
	return `/api/receipts/${hash}`;
};
