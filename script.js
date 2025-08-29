let selectedFiles = [];
let isFolderMode = true;

// Comment patterns for different languages
const commentPatterns = {
    // JavaScript, TypeScript, Java, C#, C++, C, Swift, Kotlin, Dart, Go
    'js': [
        /\/\*[\s\S]*?\*\//g,  // Multiline comments
        /\/\/.*$/gm           // Single line comments
    ],
    'ts': [
        /\/\*[\s\S]*?\*\//g,
        /\/\/.*$/gm
    ],
    'java': [
        /\/\*[\s\S]*?\*\//g,
        /\/\/.*$/gm
    ],
    'cs': [
        /\/\*[\s\S]*?\*\//g,
        /\/\/.*$/gm
    ],
    'cpp': [
        /\/\*[\s\S]*?\*\//g,
        /\/\/.*$/gm
    ],
    'c': [
        /\/\*[\s\S]*?\*\//g,
        /\/\/.*$/gm
    ],
    'swift': [
        /\/\*[\s\S]*?\*\//g,
        /\/\/.*$/gm
    ],
    'kt': [
        /\/\*[\s\S]*?\*\//g,
        /\/\/.*$/gm
    ],
    'dart': [
        /\/\*[\s\S]*?\*\//g,
        /\/\/.*$/gm
    ],
    'go': [
        /\/\*[\s\S]*?\*\//g,
        /\/\/.*$/gm
    ],
    'jsx': [
        /\/\*[\s\S]*?\*\//g,
        /\/\/.*$/gm
    ],
    'tsx': [
        /\/\*[\s\S]*?\*\//g,
        /\/\/.*$/gm
    ],

    // Python
    'py': [
        /"""[\s\S]*?"""/g,    // Triple quote strings (docstrings)
        /'''[\s\S]*?'''/g,    // Triple quote strings (docstrings)
        /#.*$/gm              // Single line comments
    ],

    // HTML, XML
    'html': [
        /<!--[\s\S]*?-->/g
    ],
    'xml': [
        /<!--[\s\S]*?-->/g
    ],
    'htm': [
        /<!--[\s\S]*?-->/g
    ],

    // CSS, SCSS, LESS
    'css': [
        /\/\*[\s\S]*?\*\//g
    ],
    'scss': [
        /\/\*[\s\S]*?\*\//g,
        /\/\/.*$/gm
    ],
    'sass': [
        /\/\*[\s\S]*?\*\//g,
        /\/\/.*$/gm
    ],
    'less': [
        /\/\*[\s\S]*?\*\//g,
        /\/\/.*$/gm
    ],

    // SQL
    'sql': [
        /\/\*[\s\S]*?\*\//g,
        /--.*$/gm
    ],

    // Shell scripts
    'sh': [
        /#.*$/gm
    ],
    'bash': [
        /#.*$/gm
    ],
    'zsh': [
        /#.*$/gm
    ],

    // Ruby
    'rb': [
        /#.*$/gm,
        /=begin[\s\S]*?=end/g
    ],

    // PHP
    'php': [
        /\/\*[\s\S]*?\*\//g,
        /\/\/.*$/gm,
        /#.*$/gm
    ],

    // Rust
    'rs': [
        /\/\*[\s\S]*?\*\//g,
        /\/\/.*$/gm
    ],

    // R
    'r': [
        /#.*$/gm
    ],

    // Perl
    'pl': [
        /#.*$/gm
    ],
    'pm': [
        /#.*$/gm
    ],

    // Vue.js
    'vue': [
        /\/\*[\s\S]*?\*\//g,
        /\/\/.*$/gm,
        /<!--[\s\S]*?-->/g
    ],

    // Markdown (comments are less common but HTML comments work)
    'md': [
        /<!--[\s\S]*?-->/g
    ],

    // YAML
    'yml': [
        /#.*$/gm
    ],
    'yaml': [
        /#.*$/gm
    ],

    // JSON (technically doesn't support comments, but some parsers allow //)
    'json': [],

    // Lua
    'lua': [
        /--\[\[[\s\S]*?\]\]/g,  // Multi-line comments
        /--.*$/gm               // Single line comments
    ]
};

// File type icons mapping
const fileIcons = {
    'js': 'fab fa-js-square',
    'ts': 'fas fa-code',
    'jsx': 'fab fa-react',
    'tsx': 'fab fa-react',
    'html': 'fab fa-html5',
    'css': 'fab fa-css3-alt',
    'scss': 'fab fa-sass',
    'less': 'fab fa-less',
    'php': 'fab fa-php',
    'py': 'fab fa-python',
    'java': 'fab fa-java',
    'cpp': 'fas fa-code',
    'c': 'fas fa-code',
    'cs': 'fas fa-code',
    'rb': 'fas fa-gem',
    'rs': 'fas fa-code',
    'go': 'fas fa-code',
    'swift': 'fab fa-swift',
    'kt': 'fas fa-code',
    'dart': 'fas fa-code',
    'vue': 'fab fa-vuejs',
    'sql': 'fas fa-database',
    'sh': 'fas fa-terminal',
    'bash': 'fas fa-terminal',
    'yml': 'fas fa-cog',
    'yaml': 'fas fa-cog',
    'json': 'fas fa-brackets-curly',
    'xml': 'fas fa-code',
    'md': 'fab fa-markdown',
    'lua': 'fas fa-code',
    'r': 'fas fa-chart-line',
    'pl': 'fas fa-code',
    'default': 'fas fa-file-code'
};

function switchToSingleFiles() {
    const fileInput = document.getElementById('fileInput');
    const singleInput = document.getElementById('fileInputSingle');
    const switchBtn = document.getElementById('switchBtn');
    
    if (isFolderMode) {
        fileInput.style.display = 'none';
        singleInput.style.display = 'block';
        singleInput.addEventListener('change', handleFileSelect);
        switchBtn.innerHTML = '<i class="fas fa-folder"></i> Select Folders';
        isFolderMode = false;
    } else {
        fileInput.style.display = 'block';
        singleInput.style.display = 'none';
        switchBtn.innerHTML = '<i class="fas fa-file"></i> Select Individual Files';
        isFolderMode = true;
    }
}

// Initialize drag & drop functionality
function initializeDragAndDrop() {
    const uploadArea = document.getElementById('uploadArea');

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        const files = Array.from(e.dataTransfer.files);
        selectedFiles = files;
        displayFiles();
    });
}

// File Input Handler
function handleFileSelect(e) {
    selectedFiles = Array.from(e.target.files);
    displayFiles();
}

function getFileExtension(filename) {
    return filename.split('.').pop().toLowerCase();
}

function getFileIcon(filename) {
    const extension = getFileExtension(filename);
    return fileIcons[extension] || fileIcons.default;
}

function displayFiles() {
    const fileList = document.getElementById('fileList');
    const fileItems = document.getElementById('fileItems');
    const processBtn = document.getElementById('processBtn');
    
    if (selectedFiles.length === 0) {
        fileList.style.display = 'none';
        processBtn.disabled = true;
        return;
    }
    
    fileList.style.display = 'block';
    processBtn.disabled = false;
    
    fileItems.innerHTML = '';
    selectedFiles.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        const iconClass = getFileIcon(file.name);
        
        fileItem.innerHTML = `
            <span class="file-name">
                <i class="${iconClass}"></i>
                ${file.name}
            </span>
            <span class="file-size">${(file.size / 1024).toFixed(2)} KB</span>
        `;
        fileItems.appendChild(fileItem);
        
        // Staggered animation
        setTimeout(() => {
            fileItem.style.opacity = '1';
            fileItem.style.transform = 'translateY(0)';
        }, index * 50);
        
        fileItem.style.opacity = '0';
        fileItem.style.transform = 'translateY(10px)';
        fileItem.style.transition = 'all 0.3s ease';
    });
}

function removeComments(content, extension) {
    const patterns = commentPatterns[extension];
    if (!patterns) return content;
    
    let result = content;
    patterns.forEach(pattern => {
        result = result.replace(pattern, '');
    });
    
    // Remove multiple empty lines
    result = result.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    return result;
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getSupportedLanguages() {
    return Object.keys(commentPatterns).filter(ext => commentPatterns[ext].length > 0);
}

async function processFiles() {
    const processBtn = document.getElementById('processBtn');
    const progress = document.getElementById('progress');
    const status = document.getElementById('status');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    processBtn.disabled = true;
    progress.style.display = 'block';
    status.style.display = 'none';
    
    const zip = new JSZip();
    let processedCount = 0;
    let skippedFiles = [];
    let processedFiles = [];
    let totalSize = 0;
    let processedSize = 0;
    
    try {
        // Calculate total size for better progress indication
        selectedFiles.forEach(file => {
            totalSize += file.size;
        });
        
        for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];
            const extension = getFileExtension(file.name);
            
            if (commentPatterns[extension] && commentPatterns[extension].length > 0) {
                try {
                    const content = await file.text();
                    const originalLines = content.split('\n').length;
                    const cleanedContent = removeComments(content, extension);
                    const cleanedLines = cleanedContent.split('\n').length;
                    
                    // Maintain folder structure
                    const filePath = file.webkitRelativePath || file.name;
                    zip.file(filePath, cleanedContent);
                    
                    processedFiles.push({
                        name: file.name,
                        originalLines,
                        cleanedLines,
                        linesRemoved: originalLines - cleanedLines
                    });
                    processedSize += file.size;
                } catch (error) {
                    console.warn(`Error processing ${file.name}:`, error);
                    skippedFiles.push(file.name + ' (processing error)');
                }
            } else {
                // Add files without known comment syntax unchanged (for small files)
                if (file.size < 1024 * 1024) { // Only add small files (<1MB) unchanged
                    try {
                        const filePath = file.webkitRelativePath || file.name;
                        
                        // For binary files, use arrayBuffer instead of text
                        if (isBinaryFile(file.name)) {
                            const content = await file.arrayBuffer();
                            zip.file(filePath, content);
                        } else {
                            const content = await file.text();
                            zip.file(filePath, content);
                        }
                        
                        skippedFiles.push(file.name + ' (unchanged - no comment pattern)');
                    } catch (error) {
                        skippedFiles.push(file.name + ' (error reading file)');
                    }
                } else {
                    skippedFiles.push(file.name + ' (skipped - too large)');
                }
            }
            
            processedCount++;
            const percent = Math.round((processedCount / selectedFiles.length) * 100);
            progressFill.style.width = percent + '%';
            progressText.textContent = percent + '%';
            
            // Small delay for UI update
            await new Promise(resolve => setTimeout(resolve, 30));
        }
        
        // Check if we have only one file to avoid ZIP creation
        let downloadBtn, url, filename, finalFileSize;
        
        if (selectedFiles.length === 1 && processedFiles.length === 1) {
            // Single file - download directly without ZIP
            progressText.textContent = 'Preparing download...';
            const singleFile = selectedFiles[0];
            const extension = getFileExtension(singleFile.name);
            const cleanedContent = removeComments(await singleFile.text(), extension);
            
            const blob = new Blob([cleanedContent], { type: 'text/plain' });
            url = URL.createObjectURL(blob);
            filename = singleFile.name;
            finalFileSize = blob.size;
            
            downloadBtn = document.createElement('a');
            downloadBtn.href = url;
            downloadBtn.download = filename;
            downloadBtn.className = 'download-btn';
            downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download Cleaned File';
        } else {
            // Multiple files - create ZIP
            progressText.textContent = 'Generating ZIP file...';
            const zipBlob = await zip.generateAsync({
                type: 'blob',
                compression: 'DEFLATE',
                compressionOptions: { level: 6 }
            });
            
            url = URL.createObjectURL(zipBlob);
            const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
            filename = `cleaned_code_${timestamp}.zip`;
            finalFileSize = zipBlob.size;
            
            downloadBtn = document.createElement('a');
            downloadBtn.href = url;
            downloadBtn.download = filename;
            downloadBtn.className = 'download-btn';
            downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download Cleaned Files';
        }
        
        // Calculate statistics
        const totalLinesRemoved = processedFiles.reduce((sum, file) => sum + file.linesRemoved, 0);
        const compressionRatio = ((totalSize - finalFileSize) / totalSize * 100).toFixed(1);
        
        // Show success status with detailed statistics
        status.className = 'status success';
        status.innerHTML = `
            <h3><i class="fas fa-check-circle"></i> Processing Complete!</h3>
            <div class="stats">
                <div class="stat-card">
                    <div class="stat-number">
                        <i class="fas fa-file-code"></i>
                        ${processedFiles.length}
                    </div>
                    <div class="stat-label">Files Processed</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">
                        <i class="fas fa-minus-circle"></i>
                        ${totalLinesRemoved}
                    </div>
                    <div class="stat-label">Lines Removed</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">
                        <i class="fas fa-compress-arrows-alt"></i>
                        ${compressionRatio}%
                    </div>
                    <div class="stat-label">Size Reduction</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">
                        <i class="fas fa-file-archive"></i>
                        ${formatFileSize(finalFileSize)}
                    </div>
                    <div class="stat-label">${selectedFiles.length === 1 ? 'File Size' : 'ZIP Size'}</div>
                </div>
            </div>
            ${skippedFiles.length > 0 ? 
                `<details style="margin: 1rem 0; padding: 1rem; background: rgba(255,255,255,0.5); border-radius: 8px;">
                    <summary style="cursor: pointer; font-weight: 600;">
                        <i class="fas fa-info-circle"></i> 
                        ${skippedFiles.length} files skipped/unchanged
                    </summary>
                    <div style="margin-top: 0.5rem; font-size: 0.9rem;">
                        ${skippedFiles.join('<br>')}
                    </div>
                </details>` : ''
            }
            <div style="text-align: center; margin-top: 1.5rem;">
                ${downloadBtn.outerHTML}
            </div>
        `;
        status.style.display = 'block';
        
        // Auto-download after a short delay
        setTimeout(() => {
            const finalDownloadBtn = status.querySelector('.download-btn');
            if (finalDownloadBtn) {
                finalDownloadBtn.click();
            }
        }, 1000);
        
    } catch (error) {
        console.error('Processing error:', error);
        status.className = 'status error';
        status.innerHTML = `
            <h3><i class="fas fa-exclamation-triangle"></i> Processing Error</h3>
            <p><strong>Error:</strong> ${error.message}</p>
            <p>Please try again with different files or check the browser console for more details.</p>
            <details style="margin: 1rem 0; padding: 1rem; background: rgba(255,255,255,0.5); border-radius: 8px;">
                <summary style="cursor: pointer; font-weight: 600;">Technical Details</summary>
                <pre style="margin-top: 0.5rem; font-size: 0.8rem; white-space: pre-wrap;">${error.stack || 'No stack trace available'}</pre>
            </details>
        `;
        status.style.display = 'block';
    }
    
    progress.style.display = 'none';
    processBtn.disabled = false;
}

function isBinaryFile(filename) {
    const binaryExtensions = [
        'jpg', 'jpeg', 'png', 'gif', 'bmp', 'ico', 'tiff', 'webp',
        'mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv',
        'mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a',
        'zip', 'rar', '7z', 'tar', 'gz', 'bz2',
        'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
        'exe', 'dll', 'so', 'dylib', 'bin'
    ];
    
    const extension = getFileExtension(filename);
    return binaryExtensions.includes(extension);
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize drag and drop
    initializeDragAndDrop();
    
    // Set up file input handler
    document.getElementById('fileInput').addEventListener('change', handleFileSelect);
    
    // Show supported languages info in console
    console.log('CodeClean - Supported file extensions:', getSupportedLanguages().join(', '));
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + O to open file dialog
        if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
            e.preventDefault();
            if (isFolderMode) {
                document.getElementById('fileInput').click();
            } else {
                document.getElementById('fileInputSingle').click();
            }
        }
        
        // Ctrl/Cmd + Enter to process files
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            const processBtn = document.getElementById('processBtn');
            if (!processBtn.disabled) {
                processFiles();
            }
        }
        
        // Escape to clear selection
        if (e.key === 'Escape') {
            selectedFiles = [];
            displayFiles();
        }
    });
    
    // Add tooltips for better UX
    addTooltips();
});

function addTooltips() {
    const tooltips = [
        {
            selector: '.logo',
            text: 'CodeClean - Your code cleaning companion'
        },
        {
            selector: '#processBtn',
            text: 'Process selected files and remove comments (Ctrl+Enter)'
        },
        {
            selector: '#switchBtn',
            text: 'Toggle between folder and individual file selection'
        }
    ];
    
    tooltips.forEach(tooltip => {
        const element = document.querySelector(tooltip.selector);
        if (element) {
            element.title = tooltip.text;
        }
    });
}