import { createHash } from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RECEIPTS_DIR = path.join(__dirname, '..', '..', 'receipts');

export const saveFile = async (filename: string, file: File) => {
	const hash = createHash('sha256').update(filename).digest('hex') + path.extname(file.name);
	const filePath = path.join(RECEIPTS_DIR, hash);

	await fs.promises.mkdir(RECEIPTS_DIR, { recursive: true });

	const buffer = await file.arrayBuffer();
	await fs.promises.writeFile(filePath, Buffer.from(buffer));

	return filePath;
};
