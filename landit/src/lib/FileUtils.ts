/**
 * Extract text from a PDF file
 * Requires: pdfjs-dist package
 * npm install pdfjs-dist
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    // Dynamic import to avoid SSR issues
    const pdfjsLib = await import('pdfjs-dist');
    
    // Set worker source
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    
    // Extract text from each page
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n\n';
    }
    
    return fullText.trim();
  } catch (error) {
    console.error('Error extracting PDF text:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

/**
 * Extract text from a Word document (.docx)
 * Requires: mammoth package
 * npm install mammoth
 */
export async function extractTextFromWord(file: File): Promise<string> {
  try {
    const mammoth = await import('mammoth');
    
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    return result.value;
  } catch (error) {
    console.error('Error extracting Word text:', error);
    throw new Error('Failed to extract text from Word document');
  }
}

/**
 * Extract text from a plain text file
 */
export async function extractTextFromTxt(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const text = e.target?.result as string;
      resolve(text);
    };
    
    reader.onerror = () => reject(new Error('Failed to read text file'));
    
    reader.readAsText(file);
  });
}

/**
 * Main function to extract text from any supported file type
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  try {
    // PDF files
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      return await extractTextFromPDF(file);
    }
    
    // Word documents (.docx)
    if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileName.endsWith('.docx')
    ) {
      return await extractTextFromWord(file);
    }
    
    // Legacy Word documents (.doc)
    if (fileType === 'application/msword' || fileName.endsWith('.doc')) {
      // Note: .doc files are harder to parse, might need a different library
      // For now, return an error or use a fallback
      throw new Error('.doc files are not fully supported. Please use .docx or PDF format.');
    }
    
    // Plain text files
    if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
      return await extractTextFromTxt(file);
    }
    
    throw new Error(`Unsupported file type: ${fileType}`);
  } catch (error) {
    console.error('Error extracting text:', error);
    throw error;
  }
}

/**
 * Validate file before upload
 */
export function validateResumeFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ];
  
  const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt'];
  const fileName = file.name.toLowerCase();
  const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));

  if (!allowedTypes.includes(file.type) && !hasValidExtension) {
    return {
      valid: false,
      error: 'Please upload a PDF, Word document, or text file',
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size must be less than 10MB',
    };
  }

  return { valid: true };
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}