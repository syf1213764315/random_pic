#!/bin/bash
# Linux 硬盘分区与格式化脚本
# 警告：执行此脚本会清空目标硬盘上的所有数据！！！

set -e

echo "=== Linux 硬盘分区与格式化脚本 ==="
echo "警告: 此操作会清空目标硬盘上的所有数据，请谨慎使用！"
echo ""
lsblk
echo ""

read -p "请输入目标硬盘 (例如 /dev/sdb): " DISK

# 确认输入
if [[ ! $DISK =~ ^/dev/sd[a-z]$ ]]; then
    echo "输入的硬盘无效！"
    exit 1
fi

read -p "确认要操作硬盘 $DISK 吗？(yes/NO): " CONFIRM
if [[ "$CONFIRM" != "yes" ]]; then
    echo "用户取消操作。"
    exit 0
fi

echo "开始对 $DISK 进行分区和格式化..."

# 清空分区表并新建 GPT
parted -s "$DISK" mklabel gpt
parted -s "$DISK" mkpart primary 0% 100%

# 格式化第一个分区
PARTITION="${DISK}1"
mkfs.ext3 -F "$PARTITION"

echo "=== 硬盘 $DISK 已完成 GPT 分区并格式化为 EXT3 ==="
lsblk "$DISK"
