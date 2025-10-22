declare module 'advanced-pdf-compressor' {
	interface PDFCompressorOptions {
		optimizeImages?: boolean;
		imageQuality?: number;
		removeMetadata?: boolean;
		compressionLevel?: number;
	}

	class PDFCompressor {
		constructor(options?: PDFCompressorOptions);
		compressPDF(inputPath: string, outputPath: string): Promise<void>;
	}

	export = PDFCompressor;
}
