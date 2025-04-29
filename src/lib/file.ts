import { createHash } from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RECEIPTS_STATIC_DIR_PATH = 'receipts';
const RECEIPTS_DIR_PATH = path.join(__dirname, '..', '..', 'static', RECEIPTS_STATIC_DIR_PATH);

export const saveFile = async (filename: string, file: File) => {
	const hash = createHash('sha256').update(filename).digest('hex') + path.extname(file.name);
	const filePath = path.join(RECEIPTS_DIR_PATH, hash);

	await fs.promises.mkdir(RECEIPTS_DIR_PATH, { recursive: true });

	const buffer = await file.arrayBuffer();
	await fs.promises.writeFile(filePath, Buffer.from(buffer));

	return '/' + path.join(RECEIPTS_STATIC_DIR_PATH, hash);
};
