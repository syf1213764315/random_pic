// 交互式位置调整系统
const PositionAdjuster = {
    isActive: false,
    currentItem: null,
    isDragging: false,
    dragOffset: { x: 0, y: 0 },
    adjustments: {},
    
    // 初始化调整器
    init() {
        this.createControls();
        this.setupEventListeners();
        this.loadSavedAdjustments();
    },
    
    // 创建控制面板
    createControls() {
        const controlPanel = document.createElement('div');
        controlPanel.id = 'position-controls';
        controlPanel.className = 'position-controls';
        controlPanel.innerHTML = `
            <div class="control-header">
                <h3>位置微调</h3>
                <button class="toggle-btn" id="toggle-adjuster">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M12 5v14M5 12h14"/>
                    </svg>
                </button>
            </div>
            <div class="control-body" style="display: none;">
                <div class="adjustment-info">
                    <p>点击装饰品进行位置调整</p>
                    <p class="selected-item">未选择</p>
                </div>
                <div class="adjustment-controls">
                    <div class="position-controls-group">
                        <label>水平位置</label>
                        <input type="range" id="pos-x" min="-100" max="100" value="0" step="1">
                        <span class="value-display">0</span>
                    </div>
                    <div class="position-controls-group">
                        <label>垂直位置</label>
                        <input type="range" id="pos-y" min="-100" max="100" value="0" step="1">
                        <span class="value-display">0</span>
                    </div>
                    <div class="position-controls-group">
                        <label>缩放</label>
                        <input type="range" id="scale" min="50" max="200" value="100" step="5">
                        <span class="value-display">100%</span>
                    </div>
                    <div class="position-controls-group">
                        <label>旋转</label>
                        <input type="range" id="rotation" min="-180" max="180" value="0" step="5">
                        <span class="value-display">0°</span>
                    </div>
                </div>
                <div class="control-buttons">
                    <button class="btn-small" id="reset-position">重置</button>
                    <button class="btn-small" id="reset-all">全部重置</button>
                    <button class="btn-small primary" id="save-adjustments">保存调整</button>
                </div>
            </div>
        `;
        
        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .position-controls {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 280px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                z-index: 1000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            
            .control-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px;
                border-bottom: 1px solid #eee;
            }
            
            .control-header h3 {
                margin: 0;
                font-size: 16px;
                color: #333;
            }
            
            .toggle-btn {
                width: 32px;
                height: 32px;
                border: none;
                background: #f0f0f0;
                border-radius: 8px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
            }
            
            .toggle-btn:hover {
                background: #e0e0e0;
            }
            
            .toggle-btn.active {
                background: #4CAF50;
                color: white;
                transform: rotate(45deg);
            }
            
            .control-body {
                padding: 15px;
            }
            
            .adjustment-info {
                margin-bottom: 15px;
                padding: 10px;
                background: #f8f8f8;
                border-radius: 8px;
            }
            
            .adjustment-info p {
                margin: 5px 0;
                font-size: 13px;
                color: #666;
            }
            
            .selected-item {
                font-weight: bold;
                color: #333;
            }
            
            .position-controls-group {
                margin-bottom: 15px;
            }
            
            .position-controls-group label {
                display: block;
                margin-bottom: 5px;
                font-size: 12px;
                color: #666;
                font-weight: 500;
            }
            
            .position-controls-group input[type="range"] {
                width: 100%;
                height: 6px;
                border-radius: 3px;
                background: #e0e0e0;
                outline: none;
                -webkit-appearance: none;
            }
            
            .position-controls-group input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: #4CAF50;
                cursor: pointer;
            }
            
            .value-display {
                display: inline-block;
                margin-left: 10px;
                font-size: 12px;
                color: #333;
                font-weight: 500;
            }
            
            .control-buttons {
                display: flex;
                gap: 10px;
                margin-top: 15px;
            }
            
            .btn-small {
                flex: 1;
                padding: 8px;
                border: 1px solid #ddd;
                background: white;
                border-radius: 6px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .btn-small:hover {
                background: #f5f5f5;
            }
            
            .btn-small.primary {
                background: #4CAF50;
                color: white;
                border-color: #4CAF50;
            }
            
            .btn-small.primary:hover {
                background: #45a049;
            }
            
            .adjustable-item {
                cursor: move !important;
                outline: 2px dashed transparent;
                transition: outline 0.2s;
            }
            
            .adjustable-item:hover {
                outline-color: rgba(76, 175, 80, 0.5);
            }
            
            .adjustable-item.selected {
                outline-color: #4CAF50;
                outline-style: solid;
            }
            
            .adjustment-handle {
                position: absolute;
                width: 12px;
                height: 12px;
                background: #4CAF50;
                border: 2px solid white;
                border-radius: 50%;
                cursor: move;
                z-index: 1001;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(controlPanel);
    },
    
    // 设置事件监听器
    setupEventListeners() {
        // 切换调整器
        document.getElementById('toggle-adjuster').addEventListener('click', () => {
            this.toggleAdjuster();
        });
        
        // 滑块控制
        const controls = ['pos-x', 'pos-y', 'scale', 'rotation'];
        controls.forEach(id => {
            const slider = document.getElementById(id);
            slider.addEventListener('input', (e) => {
                this.updateItemPosition(id, e.target.value);
            });
        });
        
        // 按钮控制
        document.getElementById('reset-position').addEventListener('click', () => {
            this.resetCurrentItem();
        });
        
        document.getElementById('reset-all').addEventListener('click', () => {
            this.resetAllAdjustments();
        });
        
        document.getElementById('save-adjustments').addEventListener('click', () => {
            this.saveAdjustments();
        });
    },
    
    // 切换调整器状态
    toggleAdjuster() {
        this.isActive = !this.isActive;
        const toggleBtn = document.getElementById('toggle-adjuster');
        const controlBody = document.querySelector('.control-body');
        
        toggleBtn.classList.toggle('active');
        controlBody.style.display = this.isActive ? 'block' : 'none';
        
        if (this.isActive) {
            this.enableAdjustment();
        } else {
            this.disableAdjustment();
        }
    },
    
    // 启用调整模式
    enableAdjustment() {
        const layers = document.querySelectorAll('.layer:not(.base-layer)');
        layers.forEach(layer => {
            if (layer.style.display !== 'none') {
                layer.classList.add('adjustable-item');
                layer.style.pointerEvents = 'auto';
                
                layer.addEventListener('click', this.selectItem.bind(this));
                layer.addEventListener('mousedown', this.startDrag.bind(this));
            }
        });
        
        document.addEventListener('mousemove', this.drag.bind(this));
        document.addEventListener('mouseup', this.endDrag.bind(this));
    },
    
    // 禁用调整模式
    disableAdjustment() {
        const layers = document.querySelectorAll('.layer');
        layers.forEach(layer => {
            layer.classList.remove('adjustable-item', 'selected');
            layer.style.pointerEvents = 'none';
            
            layer.removeEventListener('click', this.selectItem);
            layer.removeEventListener('mousedown', this.startDrag);
        });
        
        document.removeEventListener('mousemove', this.drag);
        document.removeEventListener('mouseup', this.endDrag);
    },
    
    // 选择装饰品
    selectItem(e) {
        e.stopPropagation();
        
        // 移除之前的选中状态
        document.querySelectorAll('.layer.selected').forEach(layer => {
            layer.classList.remove('selected');
        });
        
        // 设置新的选中状态
        e.target.classList.add('selected');
        this.currentItem = e.target;
        
        // 更新控制面板
        const itemName = e.target.id.replace('-layer', '');
        document.querySelector('.selected-item').textContent = `当前选中: ${itemName}`;
        
        // 加载当前调整值
        this.loadItemAdjustments(itemName);
    },
    
    // 开始拖动
    startDrag(e) {
        if (!this.currentItem) return;
        
        this.isDragging = true;
        const rect = this.currentItem.getBoundingClientRect();
        this.dragOffset = {
            x: e.clientX - rect.left - rect.width / 2,
            y: e.clientY - rect.top - rect.height / 2
        };
        
        e.preventDefault();
    },
    
    // 拖动中
    drag(e) {
        if (!this.isDragging || !this.currentItem) return;
        
        const container = document.querySelector('.canvas-container');
        const containerRect = container.getBoundingClientRect();
        
        const x = e.clientX - containerRect.left - this.dragOffset.x;
        const y = e.clientY - containerRect.top - this.dragOffset.y;
        
        this.currentItem.style.left = `${x}px`;
        this.currentItem.style.top = `${y}px`;
        
        // 更新滑块值
        const centerX = containerRect.width / 2;
        const centerY = containerRect.height / 2;
        const offsetX = Math.round(x - centerX);
        const offsetY = Math.round(y - centerY);
        
        document.getElementById('pos-x').value = offsetX;
        document.getElementById('pos-y').value = offsetY;
        this.updateValueDisplay('pos-x', offsetX);
        this.updateValueDisplay('pos-y', offsetY);
    },
    
    // 结束拖动
    endDrag() {
        this.isDragging = false;
    },
    
    // 更新装饰品位置
    updateItemPosition(control, value) {
        if (!this.currentItem) return;
        
        const itemName = this.currentItem.id.replace('-layer', '');
        
        if (!this.adjustments[itemName]) {
            this.adjustments[itemName] = { x: 0, y: 0, scale: 100, rotation: 0 };
        }
        
        switch(control) {
            case 'pos-x':
                this.adjustments[itemName].x = parseInt(value);
                break;
            case 'pos-y':
                this.adjustments[itemName].y = parseInt(value);
                break;
            case 'scale':
                this.adjustments[itemName].scale = parseInt(value);
                break;
            case 'rotation':
                this.adjustments[itemName].rotation = parseInt(value);
                break;
        }
        
        this.applyAdjustments(this.currentItem, this.adjustments[itemName]);
        this.updateValueDisplay(control, value);
    },
    
    // 应用调整
    applyAdjustments(element, adjustments) {
        const baseTransform = `translate(-50%, -50%)`;
        const adjustTransform = `translate(${adjustments.x}px, ${adjustments.y}px) scale(${adjustments.scale / 100}) rotate(${adjustments.rotation}deg)`;
        element.style.transform = `${baseTransform} ${adjustTransform}`;
    },
    
    // 更新显示值
    updateValueDisplay(control, value) {
        const displays = {
            'pos-x': value,
            'pos-y': value,
            'scale': `${value}%`,
            'rotation': `${value}°`
        };
        
        const valueDisplay = document.querySelector(`#${control} + .value-display`);
        if (valueDisplay) {
            valueDisplay.textContent = displays[control];
        }
    },
    
    // 重置当前装饰品
    resetCurrentItem() {
        if (!this.currentItem) return;
        
        const itemName = this.currentItem.id.replace('-layer', '');
        this.adjustments[itemName] = { x: 0, y: 0, scale: 100, rotation: 0 };
        
        this.applyAdjustments(this.currentItem, this.adjustments[itemName]);
        
        // 重置滑块
        document.getElementById('pos-x').value = 0;
        document.getElementById('pos-y').value = 0;
        document.getElementById('scale').value = 100;
        document.getElementById('rotation').value = 0;
        
        ['pos-x', 'pos-y', 'scale', 'rotation'].forEach(id => {
            this.updateValueDisplay(id, document.getElementById(id).value);
        });
    },
    
    // 重置所有调整
    resetAllAdjustments() {
        this.adjustments = {};
        
        document.querySelectorAll('.layer:not(.base-layer)').forEach(layer => {
            layer.style.transform = 'translate(-50%, -50%)';
        });
        
        this.resetCurrentItem();
        localStorage.removeItem('decorationAdjustments');
    },
    
    // 保存调整
    saveAdjustments() {
        localStorage.setItem('decorationAdjustments', JSON.stringify(this.adjustments));
        this.showNotification('调整已保存！');
    },
    
    // 加载保存的调整
    loadSavedAdjustments() {
        const saved = localStorage.getItem('decorationAdjustments');
        if (saved) {
            this.adjustments = JSON.parse(saved);
        }
    },
    
    // 加载装饰品调整值
    loadItemAdjustments(itemName) {
        const adjustments = this.adjustments[itemName] || { x: 0, y: 0, scale: 100, rotation: 0 };
        
        document.getElementById('pos-x').value = adjustments.x;
        document.getElementById('pos-y').value = adjustments.y;
        document.getElementById('scale').value = adjustments.scale;
        document.getElementById('rotation').value = adjustments.rotation;
        
        ['pos-x', 'pos-y', 'scale', 'rotation'].forEach(id => {
            this.updateValueDisplay(id, document.getElementById(id).value);
        });
    },
    
    // 显示通知
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #4CAF50;
            color: white;
            padding: 15px 30px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            z-index: 2000;
            animation: fadeInOut 2s ease;
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
    },
    
    // 获取调整后的位置（供保存图片时使用）
    getAdjustedPosition(itemName, basePosition) {
        const adjustments = this.adjustments[itemName];
        if (!adjustments) return basePosition;
        
        return {
            x: basePosition.x + adjustments.x,
            y: basePosition.y + adjustments.y,
            scale: basePosition.scale * (adjustments.scale / 100),
            rotation: basePosition.rotation + adjustments.rotation,
            zIndex: basePosition.zIndex
        };
    }
};

// 导出调整器
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PositionAdjuster;
}