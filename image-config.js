// Image configuration for perfect adaptation
const ImageConfig = {
    // Base body image
    base: {
        src: './website/body.png',
        position: { x: 250, y: 250 },
        size: { width: 400, height: 400 },
        scale: 1
    },
    
    // Cloth items (3 items)
    cloth: {
        items: [
            { id: 'cloth1', src: './website/cloth/1.png', name: 'T-Shirt' },
            { id: 'cloth2', src: './website/cloth/2.png', name: 'Dress' },
            { id: 'cloth3', src: './website/cloth/3.png', name: 'Coat' }
        ],
        position: { x: 250, y: 310 },
        size: { width: 300, height: 220 },
        scale: 1,
        zIndex: 2
    },
    
    // Tap/Hat items (7 items)
    tap: {
        items: [
            { id: 'tap1', src: './website/tap/1.png', name: 'Cap' },
            { id: 'tap2', src: './website/tap/2.png', name: 'Wizard Hat' },
            { id: 'tap3', src: './website/tap/3.png', name: 'Crown' },
            { id: 'tap4', src: './website/tap/4.png', name: 'Cowboy' },
            { id: 'tap5', src: './website/tap/5.png', name: 'Headphone' },
            { id: 'tap6', src: './website/tap/6.png', name: 'Plug' },
            { id: 'tap7', src: './website/tap/7.png', name: 'Special Hat' }
        ],
        position: { x: 250, y: 120 },
        size: { width: 200, height: 140 },
        scale: 1,
        zIndex: 6
    },
    
    // Eyes items (7 items)
    eyes: {
        items: [
            { id: 'eyes1', src: './website/eyes/1.png', name: 'Sunglasses' },
            { id: 'eyes2', src: './website/eyes/2.png', name: 'Glasses' },
            { id: 'eyes3', src: './website/eyes/3.png', name: 'Monocle' },
            { id: 'eyes4', src: './website/eyes/4.png', name: 'Flaming Eyes' },
            { id: 'eyes5', src: './website/eyes/5.png', name: 'Cool Eyes' },
            { id: 'eyes6', src: './website/eyes/6.png', name: 'Star Eyes' },
            { id: 'eyes7', src: './website/eyes/7.png', name: 'Laser Eyes' }
        ],
        position: { x: 250, y: 200 },
        size: { width: 150, height: 65 },
        scale: 1,
        zIndex: 5
    },
    
    // Mouth items (7 items)
    mouth: {
        items: [
            { id: 'mouth1', src: './website/mouth/1.png', name: 'Shark Teeth' },
            { id: 'mouth2', src: './website/mouth/2.png', name: 'Smile' },
            { id: 'mouth3', src: './website/mouth/3.png', name: 'Tongue' },
            { id: 'mouth4', src: './website/mouth/4.png', name: 'Happy' },
            { id: 'mouth5', src: './website/mouth/5.png', name: 'Cool' },
            { id: 'mouth6', src: './website/mouth/6.png', name: 'Whistle' },
            { id: 'mouth7', src: './website/mouth/7.png', name: 'Golden Teeth' }
        ],
        position: { x: 250, y: 245 },
        size: { width: 85, height: 45 },
        scale: 1,
        zIndex: 4
    },
    
    // Ornament items (8 items)
    ornament: {
        items: [
            { id: 'ornament1', src: './website/ornament/1.png', name: 'Collar' },
            { id: 'ornament2', src: './website/ornament/2.png', name: 'Bowtie' },
            { id: 'ornament3', src: './website/ornament/3.png', name: 'Medal' },
            { id: 'ornament4', src: './website/ornament/4.png', name: 'Badge' },
            { id: 'ornament5', src: './website/ornament/5.png', name: 'Balloon' },
            { id: 'ornament6', src: './website/ornament/6.png', name: 'Flower' },
            { id: 'ornament7', src: './website/ornament/7.png', name: 'Gift' },
            { id: 'ornament8', src: './website/ornament/8.png', name: 'Gold Coin' }
        ],
        // Different positions for different types
        positions: {
            // Neck ornaments (1-4)
            neck: { x: 250, y: 285, width: 120, height: 80, scale: 1, zIndex: 3 },
            // Hand ornaments (5-8)
            hand: { x: 350, y: 320, width: 100, height: 100, scale: 1, zIndex: 4 }
        }
    },
    
    // Canvas settings
    canvas: {
        width: 500,
        height: 500,
        backgroundColor: '#ffffff'
    },
    
    // Helper function to get appropriate position for ornament
    getOrnamentPosition(itemId) {
        const num = parseInt(itemId.replace('ornament', ''));
        if (num <= 4) {
            return this.ornament.positions.neck;
        } else {
            return this.ornament.positions.hand;
        }
    }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImageConfig;
}