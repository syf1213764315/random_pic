// 存储当前选择的装扮
const currentOutfit = {
    hat: 'none',
    necklace: 'none',
    glasses: 'none',
    clothes: 'none',
    handheld: 'none',
    background: 'none'
};

// 装扮物品的图片映射
const itemImages = {
    hat: {
        none: null,
        cap: 'https://api.iconify.design/noto:billed-cap.svg?width=150',
        wizard: 'https://api.iconify.design/noto:mage.svg?width=150',
        crown: 'https://api.iconify.design/noto:crown.svg?width=150'
    },
    necklace: {
        none: null,
        collar: 'https://api.iconify.design/fxemoji:collar.svg?width=150',
        bowtie: 'https://api.iconify.design/noto:necktie.svg?width=150',
        medal: 'https://api.iconify.design/noto:sports-medal.svg?width=150'
    },
    glasses: {
        none: null,
        sunglasses: 'https://api.iconify.design/noto:sunglasses.svg?width=120',
        glasses: 'https://api.iconify.design/noto:glasses.svg?width=120',
        monocle: 'https://api.iconify.design/twemoji:monocle.svg?width=120'
    },
    clothes: {
        none: null,
        tshirt: 'https://api.iconify.design/noto:t-shirt.svg?width=280',
        dress: 'https://api.iconify.design/noto:dress.svg?width=280',
        coat: 'https://api.iconify.design/noto:coat.svg?width=280'
    },
    handheld: {
        none: null,
        balloon: 'https://api.iconify.design/noto:balloon.svg?width=100',
        flower: 'https://api.iconify.design/noto:rose.svg?width=100',
        gift: 'https://api.iconify.design/noto:wrapped-gift.svg?width=100'
    },
    background: {
        none: null,
        park: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        beach: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        stars: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    }
};

// 加载身体部位系统
let bodyPartsLoaded = false;
function loadBodyPartsSystem() {
    const script = document.createElement('script');
    script.src = 'body-parts-system.js';
    script.onload = () => {
        bodyPartsLoaded = true;
        console.log('Body parts system loaded');
    };
    document.head.appendChild(script);
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    loadBodyPartsSystem();
    initializeItems();
    setupEventListeners();
    loadBaseImage();
});

// 加载基础图片
function loadBaseImage() {
    const baseLayer = document.getElementById('base-dog-img');
    // 使用来自base-dog-image.js的图片，或者你可以替换为实际的小狗图片URL
    if (typeof DOG_BASE64 !== 'undefined') {
        baseLayer.src = DOG_BASE64;
    } else {
        // 备用图片
        baseLayer.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRkZGREVEIi8+CjxjaXJjbGUgY3g9IjE1MCIgY3k9IjEyMCIgcj0iNjAiIGZpbGw9IiNGRkNDODAiLz4KPGNpcmNsZSBjeD0iMTIwIiBjeT0iMTEwIiByPSI4IiBmaWxsPSIjMzMzIi8+CjxjaXJjbGUgY3g9IjE4MCIgY3k9IjExMCIgcj0iOCIgZmlsbD0iIzMzMyIvPgo8cGF0aCBkPSJNMTUwIDE0MEMxNDAgMTQwIDEzNSAxMzUgMTM1IDEzNUMxMzUgMTM1IDE0MCAxNDUgMTUwIDE0NUMxNjAgMTQ1IDE2NSAxMzUgMTY1IDEzNUMxNjUgMTM1IDE2MCAxNDAgMTUwIDE0MFoiIGZpbGw9IiMzMzMiLz4KPGVsbGlwc2UgY3g9IjE1MCIgY3k9IjIwMCIgcng9IjUwIiByeT0iNzAiIGZpbGw9IiNGRkNDODAiLz4KPHJlY3QgeD0iMTIwIiB5PSIyMjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSI1MCIgcng9IjEwIiBmaWxsPSIjRkZDQzgwIi8+CjxyZWN0IHg9IjE2MCIgeT0iMjIwIiB3aWR0aD0iMjAiIGhlaWdodD0iNTAiIHJ4PSIxMCIgZmlsbD0iI0ZGQ0M4MCIvPgo8cGF0aCBkPSJNOTAgMTAwQzkwIDgwIDEwMCA3MCAxMTAgNzBDMTIwIDcwIDEzMCA4MCAxMzAgMTAwIiBzdHJva2U9IiNGRkNDODAiIHN0cm9rZS13aWR0aD0iMjAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8cGF0aCBkPSJNMTcwIDEwMEMxNzAgODAgMTgwIDcwIDE5MCA3MEMyMDAgNzAgMjEwIDgwIDIxMCAxMDAiIHN0cm9rZT0iI0ZGQ0M4MCIgc3Ryb2tlLXdpZHRoPSIyMCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPg==';
    }
}

// 初始化所有装扮选项
function initializeItems() {
    const items = document.querySelectorAll('.item');
    items.forEach(item => {
        item.addEventListener('click', handleItemClick);
    });
}

// 设置事件监听器
function setupEventListeners() {
    document.getElementById('random-btn').addEventListener('click', randomizeOutfit);
    document.getElementById('save-btn').addEventListener('click', saveImage);
    document.getElementById('share-x-btn').addEventListener('click', shareToX);
}

// 处理装扮选项点击
function handleItemClick(e) {
    const item = e.currentTarget;
    const category = item.dataset.category;
    const itemName = item.dataset.item;
    
    // 更新选中状态
    const categoryItems = document.querySelectorAll(`[data-category="${category}"]`);
    categoryItems.forEach(i => i.classList.remove('selected'));
    item.classList.add('selected');
    
    // 更新当前装扮
    currentOutfit[category] = itemName;
    
    // 更新显示
    updateDisplay(category, itemName);
}

// 更新显示层 - 使用身体部位系统进行精确定位
function updateDisplay(category, itemName) {
    const layer = document.getElementById(`${category}-layer`);
    
    if (itemName === 'none' || !itemImages[category][itemName]) {
        layer.style.display = 'none';
    } else {
        if (category === 'background') {
            const container = document.querySelector('.canvas-container');
            if (itemName === 'none') {
                container.style.background = 'white';
            } else {
                container.style.background = itemImages[category][itemName];
            }
        } else {
            layer.src = itemImages[category][itemName];
            layer.style.display = 'block';
            
            // 使用身体部位系统进行精确定位
            if (typeof BodyPartsSystem !== 'undefined') {
                const position = BodyPartsSystem.getDecorationPosition(category, itemName);
                if (position) {
                    // 应用精确位置
                    layer.style.position = 'absolute';
                    layer.style.left = `${position.x}px`;
                    layer.style.top = `${position.y}px`;
                    layer.style.transform = `translate(-50%, -50%) scale(${position.scale}) rotate(${position.rotation}deg)`;
                    layer.style.zIndex = position.zIndex;
                    
                    // 添加平滑过渡效果
                    layer.style.transition = 'all 0.3s ease';
                }
            }
        }
    }
}

// 随机搭配
function randomizeOutfit() {
    const categories = Object.keys(currentOutfit);
    
    categories.forEach(category => {
        const items = Object.keys(itemImages[category]);
        // 30%概率选择"无"，70%概率选择其他选项
        const randomIndex = Math.random() < 0.3 ? 0 : Math.floor(Math.random() * items.length);
        const selectedItem = items[randomIndex];
        
        // 更新选中状态
        const itemElements = document.querySelectorAll(`[data-category="${category}"]`);
        itemElements.forEach(el => {
            el.classList.remove('selected');
            if (el.dataset.item === selectedItem) {
                el.classList.add('selected');
            }
        });
        
        currentOutfit[category] = selectedItem;
        updateDisplay(category, selectedItem);
    });
    
    // 添加动画效果
    const container = document.querySelector('.canvas-container');
    container.style.animation = 'none';
    setTimeout(() => {
        container.style.animation = 'fadeIn 0.5s ease';
    }, 10);
}

// 增强的保存图片功能 - 使用身体部位系统进行无缝渲染
async function saveImage() {
    const canvas = document.getElementById('dress-up-canvas');
    const ctx = canvas.getContext('2d');
    
    // 设置画布大小
    canvas.width = 500;
    canvas.height = 500;
    canvas.style.display = 'block';
    
    // 启用抗锯齿
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制背景
    if (currentOutfit.background !== 'none') {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        const bgColors = {
            park: ['#667eea', '#764ba2'],
            beach: ['#f093fb', '#f5576c'],
            stars: ['#4facfe', '#00f2fe']
        };
        
        if (bgColors[currentOutfit.background]) {
            gradient.addColorStop(0, bgColors[currentOutfit.background][0]);
            gradient.addColorStop(1, bgColors[currentOutfit.background][1]);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    } else {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // 准备图层数据
    const layers = [];
    const layerElements = [
        { element: document.querySelector('.base-layer'), name: 'base', category: null, item: null },
        { element: document.getElementById('clothes-layer'), name: 'clothes', category: 'clothes', item: currentOutfit.clothes },
        { element: document.getElementById('necklace-layer'), name: 'necklace', category: 'necklace', item: currentOutfit.necklace },
        { element: document.getElementById('glasses-layer'), name: 'glasses', category: 'glasses', item: currentOutfit.glasses },
        { element: document.getElementById('hat-layer'), name: 'hat', category: 'hat', item: currentOutfit.hat },
        { element: document.getElementById('handheld-layer'), name: 'handheld', category: 'handheld', item: currentOutfit.handheld }
    ];
    
    // 等待所有图片加载
    const loadPromises = layerElements.map(layer => {
        return new Promise((resolve) => {
            if (!layer.element || layer.element.style.display === 'none') {
                resolve(null);
                return;
            }
            
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                const layerData = {
                    image: img,
                    visible: true,
                    name: layer.name
                };
                
                // 使用身体部位系统获取精确位置
                if (layer.category && layer.item && typeof BodyPartsSystem !== 'undefined') {
                    let position = BodyPartsSystem.getDecorationPosition(layer.category, layer.item);
                    if (position) {
                        // 应用用户的手动调整
                        if (typeof PositionAdjuster !== 'undefined') {
                            position = PositionAdjuster.getAdjustedPosition(layer.item, position);
                        }
                        layerData.position = { x: position.x, y: position.y };
                        layerData.scale = position.scale;
                        layerData.rotation = position.rotation;
                        layerData.zIndex = position.zIndex;
                    }
                } else if (layer.name === 'base') {
                    // 基础图片居中
                    layerData.position = { x: canvas.width / 2, y: canvas.height / 2 };
                    layerData.scale = 1;
                    layerData.zIndex = 0;
                }
                
                resolve(layerData);
            };
            img.onerror = () => resolve(null);
            img.src = layer.element.src;
        });
    });
    
    const loadedLayers = await Promise.all(loadPromises);
    loadedLayers.forEach(layer => {
        if (layer) layers.push(layer);
    });
    
    // 使用身体部位系统渲染图层
    if (typeof BodyPartsSystem !== 'undefined') {
        BodyPartsSystem.renderLayers(ctx, layers);
        
        // 应用无缝混合
        if (layers.length > 1) {
            // 在头部和脖子之间创建无缝过渡
            if (BodyPartsSystem.zones.head && BodyPartsSystem.zones.neck) {
                BodyPartsSystem.createSeamlessBlend(ctx, BodyPartsSystem.zones.head, BodyPartsSystem.zones.neck);
            }
            // 在脖子和身体之间创建无缝过渡
            if (BodyPartsSystem.zones.neck && BodyPartsSystem.zones.body) {
                BodyPartsSystem.createSeamlessBlend(ctx, BodyPartsSystem.zones.neck, BodyPartsSystem.zones.body);
            }
        }
    } else {
        // 后备渲染方法
        layers.sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
        layers.forEach(layer => {
            if (layer.image && layer.visible) {
                ctx.save();
                if (layer.position) {
                    ctx.translate(layer.position.x, layer.position.y);
                }
                if (layer.scale) {
                    ctx.scale(layer.scale, layer.scale);
                }
                if (layer.rotation) {
                    ctx.rotate(layer.rotation * Math.PI / 180);
                }
                ctx.drawImage(layer.image, -layer.image.width / 2, -layer.image.height / 2);
                ctx.restore();
            }
        });
    }
    
    // 隐藏画布
    setTimeout(() => {
        canvas.style.display = 'none';
    }, 100);
    
    // 下载图片
    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cute-dog-${Date.now()}.png`;
        a.click();
        URL.revokeObjectURL(url);
    });
}

// 分享到X（Twitter）
function shareToX() {
    const text = '看看我装扮的可爱小狗！🐕✨';
    const url = window.location.href;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    
    window.open(shareUrl, '_blank', 'width=550,height=420');
    showNotification('正在打开X分享窗口...');
}

// 显示通知
function showNotification(message) {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px 30px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        font-weight: 600;
        animation: slideDown 0.3s ease;
    `;
    notification.textContent = message;
    
    // 添加动画样式
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
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // 3秒后移除
    setTimeout(() => {
        notification.style.animation = 'slideDown 0.3s ease reverse';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 添加键盘快捷键
document.addEventListener('keydown', (e) => {
    if (e.key === 'r' || e.key === 'R') {
        randomizeOutfit();
    } else if (e.key === 's' || e.key === 'S') {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            saveImage();
        }
    }
});