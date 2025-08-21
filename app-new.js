// Main Application Controller
const App = {
    // Available items for each category
    items: {
        background: [
            { id: 'none', name: 'None', rarity: 'common' },
            { id: 'crimson', name: 'Crimson', rarity: 'common' },
            { id: 'park', name: 'Park', rarity: 'common' },
            { id: 'beach', name: 'Beach', rarity: 'rare' },
            { id: 'stars', name: 'Stars', rarity: 'epic' }
        ],
        body: [
            { id: 'none', name: 'None', rarity: 'common' },
            { id: 'tshirt', name: 'T-Shirt', rarity: 'common' },
            { id: 'dress', name: 'Dress', rarity: 'rare' },
            { id: 'coat', name: 'Coat', rarity: 'rare' },
            { id: 'workaholic', name: 'Twilight Stripes', rarity: 'epic' }
        ],
        eyes: [
            { id: 'none', name: 'None', rarity: 'common' },
            { id: 'sunglasses', name: 'Sunglasses', rarity: 'common' },
            { id: 'glasses', name: 'Glasses', rarity: 'common' },
            { id: 'monocle', name: 'Monocle', rarity: 'rare' },
            { id: 'monad-flaming', name: 'Monad Flaming Eyes', rarity: 'legendary' },
            { id: 'eye5', name: 'Cool Eyes', rarity: 'rare' },
            { id: 'eye6', name: 'Star Eyes', rarity: 'epic' },
            { id: 'eye7', name: 'Laser Eyes', rarity: 'legendary' }
        ],
        head: [
            { id: 'none', name: 'None', rarity: 'common' },
            { id: 'cap', name: 'Cap', rarity: 'common' },
            { id: 'wizard', name: 'Wizard Hat', rarity: 'rare' },
            { id: 'crown', name: 'Crown', rarity: 'epic' },
            { id: 'cowboy-beepbop', name: 'Cowboy Beepbop', rarity: 'epic' },
            { id: 'visor-headphone', name: 'Visor Headphone', rarity: 'common' },
            { id: 'plug', name: 'Plug', rarity: 'common' },
            { id: 'tap7', name: 'Special Hat', rarity: 'legendary' }
        ],
        shirt: [
            { id: 'none', name: 'None', rarity: 'common' },
            { id: 'collar', name: 'Collar', rarity: 'common' },
            { id: 'bowtie', name: 'Bowtie', rarity: 'common' },
            { id: 'medal', name: 'Medal', rarity: 'rare' },
            { id: 'workaholic', name: 'Workaholic', rarity: 'epic' }
        ],
        handle: [
            { id: 'none', name: 'None', rarity: 'common' },
            { id: 'balloon', name: 'Balloon', rarity: 'common' },
            { id: 'flower', name: 'Flower', rarity: 'common' },
            { id: 'gift', name: 'Gift', rarity: 'rare' },
            { id: 'gold-coin', name: 'Gold Coin', rarity: 'legendary' }
        ],
        mouth: [
            { id: 'none', name: 'None', rarity: 'common' },
            { id: 'shark-teeth', name: 'Shark Teeth', rarity: 'epic' },
            { id: 'smile', name: 'Smile', rarity: 'common' },
            { id: 'tongue', name: 'Tongue', rarity: 'common' },
            { id: 'mouth4', name: 'Happy Mouth', rarity: 'rare' },
            { id: 'mouth5', name: 'Cool Mouth', rarity: 'rare' },
            { id: 'mouth6', name: 'Whistle', rarity: 'epic' },
            { id: 'mouth7', name: 'Golden Teeth', rarity: 'legendary' }
        ]
    },

    // Current active category
    activeCategory: 'head',

    // Initialize the application
    init() {
        // Initialize character builder
        if (typeof CharacterBuilder !== 'undefined') {
            CharacterBuilder.init();
            
            // Set initial items
            CharacterBuilder.updateItem('background', 'crimson');
            CharacterBuilder.updateItem('body', 'workaholic');
            CharacterBuilder.updateItem('eyes', 'monad-flaming');
            CharacterBuilder.updateItem('head', 'cowboy-beepbop');
            CharacterBuilder.updateItem('shirt', 'workaholic');
            CharacterBuilder.updateItem('handle', 'gold-coin');
            CharacterBuilder.updateItem('mouth', 'shark-teeth');
        }

        // Setup event listeners
        this.setupEventListeners();
        
        // Load initial category items
        this.loadCategoryItems('head');
        
        // Update UI with current selections
        this.updateSelectionDisplay();
    },

    // Setup all event listeners
    setupEventListeners() {
        // Category selection
        document.querySelectorAll('.category-section').forEach(section => {
            section.addEventListener('click', (e) => {
                const categoryHeader = e.currentTarget.querySelector('.category-header');
                if (categoryHeader && e.target.closest('.category-header')) {
                    this.handleCategoryClick(section);
                }
            });
        });

        // Item selection
        document.addEventListener('click', (e) => {
            if (e.target.closest('.item-card')) {
                this.handleItemSelection(e.target.closest('.item-card'));
            }
        });

        // Action buttons
        document.getElementById('save-btn')?.addEventListener('click', () => {
            this.saveCharacter();
        });

        document.getElementById('copy-btn')?.addEventListener('click', () => {
            this.copyToClipboard();
        });

        document.getElementById('download-btn')?.addEventListener('click', () => {
            this.downloadCharacter();
        });

        // Social connect
        document.querySelector('.connect-btn')?.addEventListener('click', () => {
            this.connectSocials();
        });
    },

    // Handle category click
    handleCategoryClick(section) {
        // Remove active class from all sections
        document.querySelectorAll('.category-section').forEach(s => {
            s.classList.remove('active');
        });

        // Add active class to clicked section
        section.classList.add('active');

        // Get category name
        const categoryLabel = section.querySelector('.category-label').textContent.toLowerCase();
        this.activeCategory = categoryLabel;

        // Load items for this category
        this.loadCategoryItems(categoryLabel);

        // Update panel title
        const panelTitle = document.querySelector('.panel-title');
        if (panelTitle) {
            panelTitle.textContent = section.querySelector('.category-label').textContent;
        }
    },

    // Load items for a category
    loadCategoryItems(category) {
        const itemsGrid = document.getElementById('items-grid');
        if (!itemsGrid) return;

        // Clear existing items
        itemsGrid.innerHTML = '';

        // Get items for this category
        const categoryItems = this.items[category] || [];

        // Create item cards
        categoryItems.forEach(item => {
            const card = this.createItemCard(category, item);
            itemsGrid.appendChild(card);
        });

        // Mark selected item
        const currentItem = CharacterBuilder?.currentItems[category] || 'none';
        const selectedCard = itemsGrid.querySelector(`[data-item="${currentItem}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }
    },

    // Create an item card element
    createItemCard(category, item) {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.dataset.category = category;
        card.dataset.item = item.id;

        // Create preview
        const preview = document.createElement('div');
        preview.className = 'item-preview';

        if (item.id === 'none') {
            // Show silhouette for "none" option
            const silhouette = document.createElement('div');
            silhouette.className = 'item-silhouette';
            preview.appendChild(silhouette);
        } else {
            // Get image URL from CharacterBuilder
            const imageUrl = CharacterBuilder?.getItemImageUrl(category, item.id);
            if (imageUrl) {
                const img = document.createElement('img');
                img.src = imageUrl;
                img.alt = item.name;
                preview.appendChild(img);
            } else {
                // Fallback to placeholder
                const placeholder = document.createElement('div');
                placeholder.className = 'item-silhouette';
                preview.appendChild(placeholder);
            }
        }

        // Create info section
        const info = document.createElement('div');
        info.className = 'item-info';

        const name = document.createElement('span');
        name.className = 'item-name';
        name.textContent = item.name;

        const rarity = document.createElement('span');
        rarity.className = `item-rarity ${item.rarity}`;
        rarity.textContent = item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1);

        info.appendChild(name);
        info.appendChild(rarity);

        card.appendChild(preview);
        card.appendChild(info);

        return card;
    },

    // Handle item selection
    handleItemSelection(card) {
        const category = card.dataset.category;
        const itemId = card.dataset.item;

        // Update selection UI
        document.querySelectorAll(`[data-category="${category}"]`).forEach(c => {
            c.classList.remove('selected');
        });
        card.classList.add('selected');

        // Update character builder
        if (CharacterBuilder) {
            CharacterBuilder.updateItem(category, itemId);
        }

        // Update selection display
        this.updateSelectionDisplay();

        // Dispatch custom event
        document.dispatchEvent(new CustomEvent('item-selected', {
            detail: { category, item: itemId }
        }));
    },

    // Update selection display in left panel
    updateSelectionDisplay() {
        if (!CharacterBuilder) return;

        Object.keys(CharacterBuilder.currentItems).forEach(category => {
            const itemId = CharacterBuilder.currentItems[category];
            const item = this.items[category]?.find(i => i.id === itemId);
            
            if (item) {
                const displayElement = document.getElementById(`selected-${category}`);
                if (displayElement) {
                    displayElement.textContent = item.name;
                }
            }
        });
    },

    // Save character
    async saveCharacter() {
        if (CharacterBuilder) {
            await CharacterBuilder.saveAsImage();
            this.showNotification('Character saved successfully!');
        }
    },

    // Copy to clipboard
    async copyToClipboard() {
        const canvas = document.getElementById('character-canvas');
        if (!canvas) return;

        try {
            canvas.toBlob(async (blob) => {
                const item = new ClipboardItem({ 'image/png': blob });
                await navigator.clipboard.write([item]);
                this.showNotification('Character copied to clipboard!');
            });
        } catch (err) {
            console.error('Failed to copy:', err);
            this.showNotification('Failed to copy to clipboard');
        }
    },

    // Download character
    downloadCharacter() {
        if (CharacterBuilder) {
            CharacterBuilder.saveAsImage();
            this.showNotification('Download started!');
        }
    },

    // Connect socials
    connectSocials() {
        // Placeholder for social connection
        this.showNotification('Social connection coming soon!');
    },

    // Show notification
    showNotification(message) {
        // Remove existing notification
        const existing = document.querySelector('.notification');
        if (existing) {
            existing.remove();
        }

        // Create notification
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #4CAF50;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            animation: slideDown 0.3s ease;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    },

    // Add random outfit generation
    randomizeOutfit() {
        const categories = Object.keys(this.items);
        
        categories.forEach(category => {
            const items = this.items[category];
            // 30% chance for "none", 70% for other items
            const randomIndex = Math.random() < 0.3 ? 0 : Math.floor(Math.random() * items.length);
            const selectedItem = items[randomIndex];
            
            if (CharacterBuilder) {
                CharacterBuilder.updateItem(category, selectedItem.id);
            }
        });
        
        this.updateSelectionDisplay();
        this.showNotification('Random outfit generated!');
    }
};

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            transform: translateX(-50%) translateY(-100%);
            opacity: 0;
        }
        to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes slideUp {
        from {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        to {
            transform: translateX(-50%) translateY(-100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Export for debugging
window.App = App;