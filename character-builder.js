// Character Builder System - Fixed Position Layout
const CharacterBuilder = {
    // Canvas dimensions
    canvasWidth: 500,
    canvasHeight: 500,
    
    // Character base position (center of canvas)
    characterCenter: { x: 250, y: 250 },
    
    // Fixed positions for each accessory type relative to character center
    itemPositions: {
        // Background is full canvas
        background: {
            x: 0,
            y: 0,
            width: 500,
            height: 500,
            scale: 1,
            zIndex: 0
        },
        
        // Base character
        base: {
            x: 250,
            y: 250,
            width: 300,
            height: 300,
            scale: 1,
            zIndex: 1
        },
        
        // Body items (clothes)
        body: {
            tshirt: { x: 250, y: 320, width: 200, height: 150, scale: 1.2, zIndex: 2 },
            dress: { x: 250, y: 330, width: 220, height: 180, scale: 1.3, zIndex: 2 },
            coat: { x: 250, y: 320, width: 240, height: 160, scale: 1.3, zIndex: 2 },
            workaholic: { x: 250, y: 320, width: 200, height: 150, scale: 1.2, zIndex: 2 }
        },
        
        // Eyes accessories
        eyes: {
            sunglasses: { x: 250, y: 180, width: 120, height: 40, scale: 1, zIndex: 5 },
            glasses: { x: 250, y: 180, width: 110, height: 35, scale: 1, zIndex: 5 },
            monocle: { x: 270, y: 175, width: 50, height: 50, scale: 0.8, zIndex: 5 },
            'monad-flaming': { x: 250, y: 180, width: 130, height: 45, scale: 1.1, zIndex: 5 }
        },
        
        // Head accessories (hats)
        head: {
            cap: { x: 250, y: 120, width: 150, height: 80, scale: 1.2, zIndex: 6 },
            wizard: { x: 250, y: 100, width: 160, height: 120, scale: 1.3, zIndex: 6 },
            crown: { x: 250, y: 110, width: 140, height: 70, scale: 1.1, zIndex: 6 },
            'cowboy-beepbop': { x: 250, y: 115, width: 180, height: 90, scale: 1.3, zIndex: 6 },
            'visor-headphone': { x: 250, y: 120, width: 160, height: 80, scale: 1.2, zIndex: 6 },
            plug: { x: 250, y: 105, width: 100, height: 100, scale: 1, zIndex: 6 }
        },
        
        // Shirt/Neck accessories
        shirt: {
            collar: { x: 250, y: 260, width: 120, height: 40, scale: 1, zIndex: 3 },
            bowtie: { x: 250, y: 255, width: 60, height: 40, scale: 0.9, zIndex: 3 },
            medal: { x: 250, y: 270, width: 80, height: 80, scale: 1, zIndex: 3 },
            workaholic: { x: 250, y: 265, width: 100, height: 50, scale: 1, zIndex: 3 }
        },
        
        // Handle items (handheld)
        handle: {
            balloon: { x: 350, y: 200, width: 80, height: 100, scale: 1, zIndex: 4 },
            flower: { x: 150, y: 280, width: 60, height: 80, scale: 0.9, zIndex: 4 },
            gift: { x: 340, y: 320, width: 70, height: 70, scale: 1, zIndex: 4 },
            'gold-coin': { x: 160, y: 300, width: 60, height: 60, scale: 1, zIndex: 4 }
        },
        
        // Mouth accessories
        mouth: {
            'shark-teeth': { x: 250, y: 210, width: 60, height: 30, scale: 1, zIndex: 4 },
            smile: { x: 250, y: 210, width: 50, height: 25, scale: 1, zIndex: 4 },
            tongue: { x: 250, y: 215, width: 55, height: 35, scale: 1, zIndex: 4 }
        }
    },
    
    // Current selected items
    currentItems: {
        background: 'none',
        body: 'none',
        eyes: 'none',
        head: 'none',
        shirt: 'none',
        handle: 'none',
        mouth: 'none'
    },
    
    // Initialize the character builder
    init() {
        this.setupCanvas();
        this.loadBaseCharacter();
        this.bindEvents();
    },
    
    // Setup the main canvas
    setupCanvas() {
        const canvas = document.getElementById('character-canvas');
        if (!canvas) {
            console.error('Character canvas not found');
            return;
        }
        
        canvas.width = this.canvasWidth;
        canvas.height = this.canvasHeight;
        this.ctx = canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
    },
    
    // Load base character image
    loadBaseCharacter() {
        const baseImg = new Image();
        baseImg.crossOrigin = 'anonymous';
        
        // Use the base dog image if available
        if (typeof DOG_BASE64 !== 'undefined') {
            baseImg.src = DOG_BASE64;
        } else {
            // Create a simple character shape
            this.drawPlaceholderCharacter();
            return;
        }
        
        baseImg.onload = () => {
            this.baseImage = baseImg;
            this.render();
        };
    },
    
    // Draw placeholder character
    drawPlaceholderCharacter() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        
        // Draw simple character shape
        ctx.fillStyle = '#8B4FDB'; // Purple color like in the image
        ctx.beginPath();
        ctx.arc(250, 200, 80, 0, Math.PI * 2); // Head
        ctx.fill();
        
        ctx.fillStyle = '#8B4FDB';
        ctx.fillRect(200, 250, 100, 120); // Body
        
        // Arms
        ctx.fillRect(150, 260, 50, 20);
        ctx.fillRect(300, 260, 50, 20);
        
        // Legs
        ctx.fillRect(210, 370, 30, 50);
        ctx.fillRect(260, 370, 30, 50);
        
        this.renderAccessories();
    },
    
    // Main render function
    render() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        
        // Draw background
        this.drawBackground();
        
        // Draw base character
        if (this.baseImage) {
            const pos = this.itemPositions.base;
            ctx.save();
            ctx.translate(pos.x, pos.y);
            ctx.scale(pos.scale, pos.scale);
            ctx.drawImage(
                this.baseImage,
                -pos.width / 2,
                -pos.height / 2,
                pos.width,
                pos.height
            );
            ctx.restore();
        } else {
            this.drawPlaceholderCharacter();
        }
        
        // Render all accessories in order of z-index
        this.renderAccessories();
    },
    
    // Draw background
    drawBackground() {
        const ctx = this.ctx;
        const bgType = this.currentItems.background;
        
        if (bgType === 'none') {
            ctx.fillStyle = '#F5F5F5';
            ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        } else {
            // Draw gradient backgrounds
            const gradients = {
                crimson: ['#DC143C', '#8B0000'],
                park: ['#667eea', '#764ba2'],
                beach: ['#f093fb', '#f5576c'],
                stars: ['#4facfe', '#00f2fe']
            };
            
            if (gradients[bgType]) {
                const gradient = ctx.createLinearGradient(0, 0, this.canvasWidth, this.canvasHeight);
                gradient.addColorStop(0, gradients[bgType][0]);
                gradient.addColorStop(1, gradients[bgType][1]);
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
            }
        }
    },
    
    // Render all accessories
    renderAccessories() {
        const accessories = [];
        
        // Collect all active accessories with their positions
        Object.keys(this.currentItems).forEach(category => {
            const itemName = this.currentItems[category];
            if (itemName !== 'none' && category !== 'background') {
                const positions = this.itemPositions[category];
                if (positions && positions[itemName]) {
                    accessories.push({
                        category,
                        name: itemName,
                        ...positions[itemName]
                    });
                }
            }
        });
        
        // Sort by z-index
        accessories.sort((a, b) => a.zIndex - b.zIndex);
        
        // Draw each accessory
        accessories.forEach(item => {
            this.drawAccessory(item);
        });
    },
    
    // Draw a single accessory
    drawAccessory(item) {
        const ctx = this.ctx;
        
        // Get the image URL for this item
        const imageUrl = this.getItemImageUrl(item.category, item.name);
        if (!imageUrl) return;
        
        // Create and load the image
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            ctx.save();
            ctx.translate(item.x, item.y);
            ctx.scale(item.scale, item.scale);
            
            // Apply any rotation if needed
            if (item.rotation) {
                ctx.rotate(item.rotation * Math.PI / 180);
            }
            
            // Draw the image centered
            ctx.drawImage(
                img,
                -item.width / 2,
                -item.height / 2,
                item.width,
                item.height
            );
            ctx.restore();
        };
        img.src = imageUrl;
    },
    
    // Get image URL for an item
    getItemImageUrl(category, itemName) {
        // Map to existing item images or use new ones
        const imageMap = {
            body: {
                tshirt: 'https://api.iconify.design/noto:t-shirt.svg?width=200',
                dress: 'https://api.iconify.design/noto:dress.svg?width=200',
                coat: 'https://api.iconify.design/noto:coat.svg?width=200',
                workaholic: 'https://api.iconify.design/noto:necktie.svg?width=200'
            },
            eyes: {
                sunglasses: './website/eyes/1.png',
                glasses: 'https://api.iconify.design/noto:glasses.svg?width=120',
                monocle: 'https://api.iconify.design/twemoji:monocle.svg?width=120',
                'monad-flaming': 'https://api.iconify.design/noto:fire.svg?width=120'
            },
            head: {
                cap: 'https://api.iconify.design/noto:billed-cap.svg?width=150',
                wizard: 'https://api.iconify.design/noto:mage.svg?width=150',
                crown: 'https://api.iconify.design/noto:crown.svg?width=150',
                'cowboy-beepbop': 'https://api.iconify.design/fxemoji:cowboyhat.svg?width=150',
                'visor-headphone': 'https://api.iconify.design/noto:headphone.svg?width=150',
                plug: 'https://api.iconify.design/noto:electric-plug.svg?width=150'
            },
            shirt: {
                collar: 'https://api.iconify.design/fxemoji:collar.svg?width=120',
                bowtie: 'https://api.iconify.design/noto:necktie.svg?width=120',
                medal: 'https://api.iconify.design/noto:sports-medal.svg?width=120',
                workaholic: 'https://api.iconify.design/noto:briefcase.svg?width=120'
            },
            handle: {
                balloon: 'https://api.iconify.design/noto:balloon.svg?width=100',
                flower: 'https://api.iconify.design/noto:rose.svg?width=100',
                gift: 'https://api.iconify.design/noto:wrapped-gift.svg?width=100',
                'gold-coin': 'https://api.iconify.design/noto:coin.svg?width=100'
            },
            mouth: {
                'shark-teeth': './website/mouth/1.png',
                smile: 'https://api.iconify.design/noto:slightly-smiling-face.svg?width=60',
                tongue: 'https://api.iconify.design/noto:face-with-tongue.svg?width=60'
            }
        };
        
        return imageMap[category]?.[itemName] || null;
    },
    
    // Update an item
    updateItem(category, itemName) {
        this.currentItems[category] = itemName;
        this.render();
    },
    
    // Bind UI events
    bindEvents() {
        // Listen for item selection events
        document.addEventListener('item-selected', (e) => {
            const { category, item } = e.detail;
            this.updateItem(category, item);
        });
    },
    
    // Export current configuration
    exportConfig() {
        return {
            items: { ...this.currentItems },
            positions: { ...this.itemPositions }
        };
    },
    
    // Import configuration
    importConfig(config) {
        if (config.items) {
            this.currentItems = { ...config.items };
        }
        if (config.positions) {
            this.itemPositions = { ...this.itemPositions, ...config.positions };
        }
        this.render();
    },
    
    // Save as image
    async saveAsImage() {
        const canvas = document.getElementById('character-canvas');
        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `character-${Date.now()}.png`;
                a.click();
                URL.revokeObjectURL(url);
                resolve();
            });
        });
    }
};

// Export for use
window.CharacterBuilder = CharacterBuilder;