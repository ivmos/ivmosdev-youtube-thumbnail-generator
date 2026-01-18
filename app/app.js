// YouTube Thumbnail Generator
// Canvas-based thumbnail creator with templates and customization

class ThumbnailGenerator {
    constructor() {
        this.canvas = document.getElementById('thumbnailCanvas');
        this.ctx = this.canvas.getContext('2d');

        // State
        this.backgroundImage = null;
        this.authorImage = null;

        // Default settings
        this.settings = {
            title: 'YOUR TITLE HERE',
            titleFont: "'Bebas Neue', sans-serif",
            titleSize: 80,
            titleColor: '#ffffff',
            strokeColor: '#000000',
            strokeWidth: 4,
            titlePosition: 'center',
            titleShadow: true,
            authorPosition: 'bottom-right',
            authorSize: 120,
            authorBorder: true,
            overlayEnabled: false,
            overlayColor: '#000000',
            overlayOpacity: 30
        };

        this.init();
    }

    init() {
        this.bindEvents();
        this.render();
    }

    bindEvents() {
        // Background image upload
        document.getElementById('backgroundInput').addEventListener('change', (e) => {
            this.handleImageUpload(e, 'background');
        });

        // Author image upload
        document.getElementById('authorInput').addEventListener('change', (e) => {
            this.handleImageUpload(e, 'author');
        });

        // Title text
        document.getElementById('titleText').addEventListener('input', (e) => {
            this.settings.title = e.target.value;
            this.render();
        });

        // Title font
        document.getElementById('titleFont').addEventListener('change', (e) => {
            this.settings.titleFont = e.target.value;
            this.render();
        });

        // Title size
        document.getElementById('titleSize').addEventListener('input', (e) => {
            this.settings.titleSize = parseInt(e.target.value);
            document.getElementById('titleSizeValue').textContent = e.target.value + 'px';
            this.render();
        });

        // Title color
        document.getElementById('titleColor').addEventListener('input', (e) => {
            this.settings.titleColor = e.target.value;
            this.render();
        });

        // Stroke color
        document.getElementById('strokeColor').addEventListener('input', (e) => {
            this.settings.strokeColor = e.target.value;
            this.render();
        });

        // Stroke width
        document.getElementById('strokeWidth').addEventListener('input', (e) => {
            this.settings.strokeWidth = parseInt(e.target.value);
            document.getElementById('strokeWidthValue').textContent = e.target.value + 'px';
            this.render();
        });

        // Title position
        document.getElementById('titlePosition').addEventListener('change', (e) => {
            this.settings.titlePosition = e.target.value;
            this.render();
        });

        // Title shadow
        document.getElementById('titleShadow').addEventListener('change', (e) => {
            this.settings.titleShadow = e.target.checked;
            this.render();
        });

        // Author position
        document.getElementById('authorPosition').addEventListener('change', (e) => {
            this.settings.authorPosition = e.target.value;
            this.render();
        });

        // Author size
        document.getElementById('authorSize').addEventListener('input', (e) => {
            this.settings.authorSize = parseInt(e.target.value);
            document.getElementById('authorSizeValue').textContent = e.target.value + 'px';
            this.render();
        });

        // Author border
        document.getElementById('authorBorder').addEventListener('change', (e) => {
            this.settings.authorBorder = e.target.checked;
            this.render();
        });

        // Overlay enabled
        document.getElementById('overlayEnabled').addEventListener('change', (e) => {
            this.settings.overlayEnabled = e.target.checked;
            this.render();
        });

        // Overlay color
        document.getElementById('overlayColor').addEventListener('input', (e) => {
            this.settings.overlayColor = e.target.value;
            this.render();
        });

        // Overlay opacity
        document.getElementById('overlayOpacity').addEventListener('input', (e) => {
            this.settings.overlayOpacity = parseInt(e.target.value);
            document.getElementById('overlayOpacityValue').textContent = e.target.value + '%';
            this.render();
        });

        // Template buttons
        document.querySelectorAll('.template-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.applyTemplate(btn.dataset.template);
            });
        });

        // Download button
        document.getElementById('downloadBtn').addEventListener('click', () => {
            this.download();
        });
    }

    handleImageUpload(event, type) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                if (type === 'background') {
                    this.backgroundImage = img;
                    document.getElementById('backgroundFileName').textContent = file.name;
                } else {
                    this.authorImage = img;
                    document.getElementById('authorFileName').textContent = file.name;
                }
                this.render();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    render() {
        const { ctx, canvas } = this;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw background
        this.drawBackground();

        // Draw overlay
        if (this.settings.overlayEnabled) {
            this.drawOverlay();
        }

        // Draw title
        this.drawTitle();

        // Draw author photo
        if (this.authorImage) {
            this.drawAuthorPhoto();
        }
    }

    drawBackground() {
        const { ctx, canvas } = this;

        if (this.backgroundImage) {
            // Cover the canvas while maintaining aspect ratio
            const imgRatio = this.backgroundImage.width / this.backgroundImage.height;
            const canvasRatio = canvas.width / canvas.height;

            let drawWidth, drawHeight, offsetX, offsetY;

            if (imgRatio > canvasRatio) {
                drawHeight = canvas.height;
                drawWidth = drawHeight * imgRatio;
                offsetX = (canvas.width - drawWidth) / 2;
                offsetY = 0;
            } else {
                drawWidth = canvas.width;
                drawHeight = drawWidth / imgRatio;
                offsetX = 0;
                offsetY = (canvas.height - drawHeight) / 2;
            }

            ctx.drawImage(this.backgroundImage, offsetX, offsetY, drawWidth, drawHeight);
        } else {
            // Default gradient background
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#1a1a2e');
            gradient.addColorStop(1, '#16213e');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Add placeholder text
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.font = '30px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Upload a background image', canvas.width / 2, canvas.height / 2 + 100);
        }
    }

    drawOverlay() {
        const { ctx, canvas, settings } = this;

        const alpha = settings.overlayOpacity / 100;
        ctx.fillStyle = this.hexToRgba(settings.overlayColor, alpha);
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    drawTitle() {
        const { ctx, canvas, settings } = this;

        if (!settings.title) return;

        ctx.font = `${settings.titleSize}px ${settings.titleFont}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Calculate Y position
        let y;
        switch (settings.titlePosition) {
            case 'top':
                y = canvas.height * 0.2;
                break;
            case 'bottom':
                y = canvas.height * 0.8;
                break;
            default:
                y = canvas.height / 2;
        }

        const x = canvas.width / 2;

        // Split title into lines
        const lines = settings.title.split('\n');
        const lineHeight = settings.titleSize * 1.1;
        const totalHeight = lines.length * lineHeight;
        const startY = y - (totalHeight / 2) + (lineHeight / 2);

        lines.forEach((line, index) => {
            const lineY = startY + (index * lineHeight);

            // Draw shadow
            if (settings.titleShadow) {
                ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
                ctx.shadowBlur = 20;
                ctx.shadowOffsetX = 5;
                ctx.shadowOffsetY = 5;
            }

            // Draw stroke
            if (settings.strokeWidth > 0) {
                ctx.strokeStyle = settings.strokeColor;
                ctx.lineWidth = settings.strokeWidth;
                ctx.lineJoin = 'round';
                ctx.strokeText(line, x, lineY);
            }

            // Reset shadow for fill
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;

            // Draw fill
            ctx.fillStyle = settings.titleColor;
            ctx.fillText(line, x, lineY);
        });
    }

    drawAuthorPhoto() {
        const { ctx, canvas, settings } = this;

        const size = settings.authorSize;
        const padding = 30;

        // Calculate position
        let x, y;
        switch (settings.authorPosition) {
            case 'top-left':
                x = padding;
                y = padding;
                break;
            case 'top-right':
                x = canvas.width - size - padding;
                y = padding;
                break;
            case 'bottom-left':
                x = padding;
                y = canvas.height - size - padding;
                break;
            default: // bottom-right
                x = canvas.width - size - padding;
                y = canvas.height - size - padding;
        }

        // Draw circular clip
        ctx.save();
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        // Draw image
        const imgRatio = this.authorImage.width / this.authorImage.height;
        let drawWidth, drawHeight, offsetX, offsetY;

        if (imgRatio > 1) {
            drawHeight = size;
            drawWidth = size * imgRatio;
            offsetX = x - (drawWidth - size) / 2;
            offsetY = y;
        } else {
            drawWidth = size;
            drawHeight = size / imgRatio;
            offsetX = x;
            offsetY = y - (drawHeight - size) / 2;
        }

        ctx.drawImage(this.authorImage, offsetX, offsetY, drawWidth, drawHeight);
        ctx.restore();

        // Draw border
        if (settings.authorBorder) {
            ctx.beginPath();
            ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 4;
            ctx.stroke();

            // Outer glow
            ctx.beginPath();
            ctx.arc(x + size / 2, y + size / 2, size / 2 + 2, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }

    applyTemplate(templateName) {
        const templates = {
            gaming: {
                titleFont: "'Bangers', cursive",
                titleSize: 100,
                titleColor: '#ffff00',
                strokeColor: '#ff0000',
                strokeWidth: 8,
                titlePosition: 'center',
                titleShadow: true,
                overlayEnabled: true,
                overlayColor: '#000000',
                overlayOpacity: 20,
                title: 'EPIC GAMING\nMOMENT!'
            },
            tutorial: {
                titleFont: "'Roboto', sans-serif",
                titleSize: 70,
                titleColor: '#ffffff',
                strokeColor: '#2ecc71',
                strokeWidth: 5,
                titlePosition: 'center',
                titleShadow: true,
                overlayEnabled: true,
                overlayColor: '#000000',
                overlayOpacity: 40,
                title: 'HOW TO...\nSTEP BY STEP'
            },
            vlog: {
                titleFont: "'Anton', sans-serif",
                titleSize: 90,
                titleColor: '#ffffff',
                strokeColor: '#e74c3c',
                strokeWidth: 4,
                titlePosition: 'bottom',
                titleShadow: true,
                overlayEnabled: false,
                overlayColor: '#000000',
                overlayOpacity: 30,
                title: 'DAY IN MY LIFE'
            },
            dramatic: {
                titleFont: "'Bebas Neue', sans-serif",
                titleSize: 110,
                titleColor: '#ffffff',
                strokeColor: '#000000',
                strokeWidth: 6,
                titlePosition: 'center',
                titleShadow: true,
                overlayEnabled: true,
                overlayColor: '#000000',
                overlayOpacity: 50,
                title: 'YOU WON\'T\nBELIEVE THIS'
            },
            minimal: {
                titleFont: "'Oswald', sans-serif",
                titleSize: 60,
                titleColor: '#333333',
                strokeColor: '#ffffff',
                strokeWidth: 0,
                titlePosition: 'center',
                titleShadow: false,
                overlayEnabled: true,
                overlayColor: '#ffffff',
                overlayOpacity: 70,
                title: 'Clean & Simple'
            }
        };

        const template = templates[templateName];
        if (!template) return;

        // Apply template settings
        Object.assign(this.settings, template);

        // Update UI
        document.getElementById('titleText').value = template.title;
        document.getElementById('titleFont').value = template.titleFont;
        document.getElementById('titleSize').value = template.titleSize;
        document.getElementById('titleSizeValue').textContent = template.titleSize + 'px';
        document.getElementById('titleColor').value = template.titleColor;
        document.getElementById('strokeColor').value = template.strokeColor;
        document.getElementById('strokeWidth').value = template.strokeWidth;
        document.getElementById('strokeWidthValue').textContent = template.strokeWidth + 'px';
        document.getElementById('titlePosition').value = template.titlePosition;
        document.getElementById('titleShadow').checked = template.titleShadow;
        document.getElementById('overlayEnabled').checked = template.overlayEnabled;
        document.getElementById('overlayColor').value = template.overlayColor;
        document.getElementById('overlayOpacity').value = template.overlayOpacity;
        document.getElementById('overlayOpacityValue').textContent = template.overlayOpacity + '%';

        this.render();
    }

    download() {
        const link = document.createElement('a');
        link.download = 'youtube-thumbnail.png';
        link.href = this.canvas.toDataURL('image/png');
        link.click();
    }

    hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    new ThumbnailGenerator();
});
