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
        
        // Base character - adjusted for body.png (made larger)
        base: {
            x: 250,
            y: 260,
            width: 430,
            height: 430,
            scale: 1.1,
            zIndex: 1
        },
        
        // Body items (clothes) - adjusted positions (moved up and made larger)
        body: {
            tshirt: { x: 250, y: 260, width: 380, height: 380, scale: 1.35, zIndex: 2 },
            dress: { x: 250, y: 260, width: 410, height: 400, scale: 1.25, zIndex: 2 },
            coat: { x: 250, y: 260, width: 430, height: 385, scale: 1.25, zIndex: 2 },
            workaholic: { x: 250, y: 260, width: 380, height: 360, scale: 1.35, zIndex: 2 }
        },
        
        // Eyes accessories - adjusted for better fit (made larger)
        eyes: {
            sunglasses: { x: 250, y: 195, width: 220, height: 190, scale: 1.35, zIndex: 5 },
            glasses: { x: 250, y: 195, width: 210, height: 180, scale: 1.35, zIndex: 5 },
            monocle: { x: 275, y: 190, width: 200, height:180, scale: 1.35, zIndex: 5 },
            'monad-flaming': { x: 250, y: 195, width: 210, height: 210, scale: 1.35, zIndex: 5 },
            eye5: { x: 250, y: 235, width: 215, height: 185, scale: 2.35, zIndex: 5 },
            eye6: { x: 250, y: 235, width: 200, height: 200, scale: 2.35, zIndex: 5 },
            eye7: { x: 250, y: 235, width: 190, height: 190, scale: 2.35, zIndex: 5 }
        },
        
        // Head accessories (hats) - adjusted for tap images (moved down and made larger)
        head: {
            cap: { x: 250, y: 190, width: 260, height: 175, scale: 1.45, zIndex: 6 },
            wizard: { x: 250, y: 180, width: 285, height: 220, scale: 1.45, zIndex: 6 },
            crown: { x: 250, y: 185, width: 240, height: 160, scale: 1.45, zIndex: 6 },
            'cowboy-beepbop': { x: 250, y: 190, width: 295, height: 185, scale: 1.45, zIndex: 6 },
            'visor-headphone': { x: 250, y: 195, width: 270, height: 175, scale: 1.45, zIndex: 6 },
            plug: { x: 250, y: 180, width: 230, height: 200, scale: 1.45, zIndex: 6 },
            tap7: { x: 250, y: 175, width: 265, height: 180, scale: 1.45, zIndex: 6 }
        },
        
        // Shirt/Neck accessories (ornaments) - adjusted positions (moved up and made larger)
        shirt: {
            collar: { x: 250, y: 265, width: 190, height: 85, scale: 1.35, zIndex: 3 },
            bowtie: { x: 250, y: 260, width: 110, height: 85, scale: 1.35, zIndex: 3 },
            medal: { x: 250, y: 280, width: 138, height: 138, scale: 1.35, zIndex: 3 },
            workaholic: { x: 250, y: 270, width: 168, height: 96, scale: 1.35, zIndex: 3 }
        },
        
        // Handle items (ornaments) - adjusted positions (moved up and made larger)
        handle: {
            balloon: { x: 375, y: 190, width: 138, height: 168, scale: 1.35, zIndex: 4 },
            flower: { x: 125, y: 285, width: 110, height: 138, scale: 1.35, zIndex: 4 },
            gift: { x: 365, y: 335, width: 126, height: 126, scale: 1.35, zIndex: 4 },
            'gold-coin': { x: 135, y: 310, width: 110, height: 110, scale: 1.35, zIndex: 4 }
        },
        
        // Mouth accessories - adjusted for better positioning (made larger)
        mouth: {
            'shark-teeth': { x: 250, y: 250, width: 210, height: 210, scale: 2.35, zIndex: 4 },
            smile: { x: 250, y: 250, width: 210, height: 210, scale: 2.35, zIndex: 4 },
            tongue: { x: 250, y: 250, width: 210, height: 210, scale: 2.35, zIndex: 4 },
            mouth4: { x: 250, y: 250, width: 210, height: 210, scale: 2.35, zIndex: 4 },
            mouth5: { x: 250, y: 250, width: 210, height: 210, scale: 2.35, zIndex: 4 },
            mouth6: { x: 250, y: 250, width: 210, height: 210, scale: 2.35, zIndex: 4 },
            mouth7: { x: 250, y: 250, width: 210, height: 210, scale: 2.35, zIndex: 4 }
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
        
        // Use the local body.png image
        baseImg.src = './website/body.png';
        
        baseImg.onload = () => {
            this.baseImage = baseImg;
            this.render();
        };
        
        baseImg.onerror = () => {
            // Fallback to base64 or placeholder if local image fails
            if (typeof DOG_BASE64 !== 'undefined') {
                baseImg.src = DOG_BASE64;
            } else {
                this.drawPlaceholderCharacter();
            }
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
                tshirt: './website/cloth/1.png',
                dress: './website/cloth/2.png',
                coat: './website/cloth/3.png',
                workaholic: './website/cloth/1.png'
            },
            eyes: {
                sunglasses: './website/eyes/1.png',
                glasses: './website/eyes/2.png',
                monocle: './website/eyes/3.png',
                'monad-flaming': './website/eyes/4.png',
                eye5: './website/eyes/5.png',
                eye6: './website/eyes/6.png',
                eye7: './website/eyes/7.png'
            },
            head: {
                cap: './website/tap/1.png',
                wizard: './website/tap/2.png',
                crown: './website/tap/3.png',
                'cowboy-beepbop': './website/tap/4.png',
                'visor-headphone': './website/tap/5.png',
                plug: './website/tap/6.png',
                tap7: './website/tap/7.png'
            },
            shirt: {
                collar: './website/ornament/1.png',
                bowtie: './website/ornament/2.png',
                medal: './website/ornament/3.png',
                workaholic: './website/ornament/4.png'
            },
            handle: {
                balloon: './website/ornament/5.png',
                flower: './website/ornament/6.png',
                gift: './website/ornament/7.png',
                'gold-coin': './website/ornament/8.png'
            },
            mouth: {
                'shark-teeth': './website/mouth/1.png',
                smile: './website/mouth/2.png',
                tongue: './website/mouth/3.png',
                mouth4: './website/mouth/4.png',
                mouth5: './website/mouth/5.png',
                mouth6: './website/mouth/6.png',
                mouth7: './website/mouth/7.png'
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
