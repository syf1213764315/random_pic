// 身体部位分割系统 - 精确定位装饰品
const BodyPartsSystem = {
    // 身体部位区域定义（基于500x500画布）
    zones: {
        head: {
            x: 150, y: 50, width: 200, height: 180,
            anchor: { x: 250, y: 140 }, // 头部中心点
            subZones: {
                top: { x: 150, y: 50, width: 200, height: 60 },    // 头顶（帽子区）
                eyes: { x: 170, y: 110, width: 160, height: 40 },  // 眼部（眼镜区）
                ears: { x: 130, y: 90, width: 240, height: 80 }    // 耳朵区
            }
        },
        neck: {
            x: 200, y: 220, width: 100, height: 60,
            anchor: { x: 250, y: 250 }, // 脖子中心点
            subZones: {
                collar: { x: 190, y: 220, width: 120, height: 40 }, // 项圈区
                tie: { x: 220, y: 240, width: 60, height: 60 }      // 领带/领结区
            }
        },
        body: {
            x: 150, y: 270, width: 200, height: 150,
            anchor: { x: 250, y: 345 }, // 身体中心点
            subZones: {
                chest: { x: 170, y: 280, width: 160, height: 80 },  // 胸部区
                belly: { x: 160, y: 350, width: 180, height: 70 }   // 腹部区
            }
        },
        leftPaw: {
            x: 140, y: 400, width: 60, height: 80,
            anchor: { x: 170, y: 440 }, // 左爪中心点
        },
        rightPaw: {
            x: 300, y: 400, width: 60, height: 80,
            anchor: { x: 330, y: 440 }, // 右爪中心点
        },
        tail: {
            x: 350, y: 320, width: 80, height: 120,
            anchor: { x: 390, y: 380 }, // 尾巴中心点
        }
    },

    // 装饰品定位配置
    decorationPositions: {
        hat: {
            zone: 'head',
            subZone: 'top',
            offset: { x: 0, y: -10 },
            scale: 1.2,
            rotation: 0,
            zIndex: 10
        },
        glasses: {
            zone: 'head',
            subZone: 'eyes',
            offset: { x: 0, y: 0 },
            scale: 0.9,
            rotation: 0,
            zIndex: 8
        },
        sunglasses: {
            zone: 'head',
            subZone: 'eyes',
            offset: { x: 0, y: -5 },
            scale: 1.0,
            rotation: 0,
            zIndex: 8
        },
        collar: {
            zone: 'neck',
            subZone: 'collar',
            offset: { x: 0, y: 0 },
            scale: 1.1,
            rotation: 0,
            zIndex: 6
        },
        bowtie: {
            zone: 'neck',
            subZone: 'tie',
            offset: { x: 0, y: -10 },
            scale: 0.8,
            rotation: 0,
            zIndex: 7
        },
        necklace: {
            zone: 'neck',
            subZone: 'collar',
            offset: { x: 0, y: 5 },
            scale: 1.0,
            rotation: 0,
            zIndex: 6
        },
        tshirt: {
            zone: 'body',
            subZone: 'chest',
            offset: { x: 0, y: 10 },
            scale: 1.3,
            rotation: 0,
            zIndex: 4
        },
        dress: {
            zone: 'body',
            subZone: null,
            offset: { x: 0, y: 0 },
            scale: 1.4,
            rotation: 0,
            zIndex: 4
        },
        balloon: {
            zone: 'rightPaw',
            offset: { x: 20, y: -30 },
            scale: 0.8,
            rotation: -15,
            zIndex: 3
        },
        flower: {
            zone: 'leftPaw',
            offset: { x: -10, y: -20 },
            scale: 0.7,
            rotation: 15,
            zIndex: 3
        }
    },

    // 获取装饰品的精确位置
    getDecorationPosition(decorationType, itemName) {
        const config = this.decorationPositions[itemName] || this.decorationPositions[decorationType];
        if (!config) return null;

        const zone = this.zones[config.zone];
        if (!zone) return null;

        let baseX, baseY;
        if (config.subZone && zone.subZones && zone.subZones[config.subZone]) {
            const subZone = zone.subZones[config.subZone];
            baseX = subZone.x + subZone.width / 2;
            baseY = subZone.y + subZone.height / 2;
        } else {
            baseX = zone.anchor.x;
            baseY = zone.anchor.y;
        }

        return {
            x: baseX + (config.offset?.x || 0),
            y: baseY + (config.offset?.y || 0),
            scale: config.scale || 1,
            rotation: config.rotation || 0,
            zIndex: config.zIndex || 5
        };
    },

    // 混合边缘处理 - 创建无缝过渡
    createSeamlessBlend(ctx, zone1, zone2) {
        const gradient = ctx.createLinearGradient(
            zone1.x + zone1.width,
            zone1.y,
            zone2.x,
            zone2.y
        );
        gradient.addColorStop(0, 'rgba(255,255,255,0)');
        gradient.addColorStop(0.5, 'rgba(255,255,255,0.5)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        
        ctx.globalCompositeOperation = 'soft-light';
        ctx.fillStyle = gradient;
        ctx.fillRect(
            Math.min(zone1.x + zone1.width - 10, zone2.x - 10),
            Math.min(zone1.y, zone2.y),
            20,
            Math.max(zone1.height, zone2.height)
        );
        ctx.globalCompositeOperation = 'source-over';
    },

    // 智能图层合成
    renderLayers(ctx, layers) {
        // 按z-index排序
        layers.sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

        layers.forEach(layer => {
            if (!layer.image || !layer.visible) return;

            ctx.save();

            // 应用变换
            if (layer.position) {
                ctx.translate(layer.position.x, layer.position.y);
            }
            if (layer.rotation) {
                ctx.rotate(layer.rotation * Math.PI / 180);
            }
            if (layer.scale) {
                ctx.scale(layer.scale, layer.scale);
            }

            // 应用混合模式
            if (layer.blendMode) {
                ctx.globalCompositeOperation = layer.blendMode;
            }

            // 应用透明度
            if (layer.opacity !== undefined) {
                ctx.globalAlpha = layer.opacity;
            }

            // 绘制图像
            const width = layer.width || layer.image.width;
            const height = layer.height || layer.image.height;
            ctx.drawImage(
                layer.image,
                -width / 2,
                -height / 2,
                width,
                height
            );

            ctx.restore();
        });
    },

    // 边缘羽化处理
    applyFeathering(ctx, x, y, width, height, featherSize = 5) {
        const imageData = ctx.getImageData(x, y, width, height);
        const data = imageData.data;

        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                const distanceFromEdge = Math.min(i, j, height - i - 1, width - j - 1);
                
                if (distanceFromEdge < featherSize) {
                    const alpha = distanceFromEdge / featherSize;
                    const index = (i * width + j) * 4 + 3;
                    data[index] = Math.floor(data[index] * alpha);
                }
            }
        }

        ctx.putImageData(imageData, x, y);
    },

    // 创建身体部位遮罩
    createBodyPartMask(ctx, partName) {
        const zone = this.zones[partName];
        if (!zone) return;

        ctx.save();
        ctx.beginPath();
        
        // 创建平滑的椭圆形遮罩
        ctx.ellipse(
            zone.anchor.x,
            zone.anchor.y,
            zone.width / 2,
            zone.height / 2,
            0,
            0,
            Math.PI * 2
        );
        
        ctx.clip();
    },

    // 应用智能阴影
    applyShadow(ctx, zone, intensity = 0.2) {
        ctx.save();
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = `rgba(0, 0, 0, ${intensity})`;
        
        // 创建渐变阴影
        const gradient = ctx.createRadialGradient(
            zone.anchor.x,
            zone.anchor.y + zone.height / 3,
            0,
            zone.anchor.x,
            zone.anchor.y + zone.height / 3,
            zone.width / 2
        );
        
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, `rgba(0, 0, 0, ${intensity})`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(zone.x, zone.y, zone.width, zone.height);
        ctx.restore();
    }
};

// 导出系统
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BodyPartsSystem;
}