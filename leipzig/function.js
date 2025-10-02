// 注释数据管理
class GlossingManager {
    constructor() {
        this.storageKey = 'leipzigGlossings';
        this.savedGlossings = this.loadFromStorage();
        this.currentGlossing = null;
    }

    // 从本地存储加载数据
    loadFromStorage() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : [];
    }

    // 保存到本地存储
    saveToStorage() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.savedGlossings));
        this.updateSavedCount();
    }

    // 添加新的注释
    addGlossing(original, gloss, translation) {
        const newGlossing = {
            id: Date.now(),
            original: original,
            gloss: gloss,
            translation: translation,
            timestamp: new Date().toLocaleString()
        };
        
        this.savedGlossings.push(newGlossing);
        this.saveToStorage();
        return newGlossing;
    }

    // 删除注释
    deleteGlossing(id) {
        this.savedGlossings = this.savedGlossings.filter(item => item.id !== id);
        this.saveToStorage();
    }

    // 清空所有保存
    clearAll() {
        this.savedGlossings = [];
        this.saveToStorage();
    }

    // 获取保存数量
    getSavedCount() {
        return this.savedGlossings.length;
    }

    // 更新界面显示的数量
    updateSavedCount() {
        const countElement = document.getElementById('saved-count');
        if (countElement) {
            countElement.textContent = `已保存: ${this.getSavedCount()} 条注释`;
        }
    }

    // 设置当前注释
    setCurrentGlossing(original, gloss, translation) {
        this.currentGlossing = { original, gloss, translation };
    }
}

// 初始化管理器
const glossingManager = new GlossingManager();

// 格式化按钮事件
document.getElementById('format-btn').addEventListener('click', function() {
    const original = document.getElementById('original').value.trim();
    const gloss = document.getElementById('gloss').value.trim();
    const translation = document.getElementById('translation').value.trim();
    
    if (!original || !gloss) {
        alert('请填写原文和注释');
        return;
    }
    
    // 分割原文和注释为单词
    const originalWords = original.split(/\s+/);
    const glossWords = gloss.split(/\s+/);
    
    if (originalWords.length !== glossWords.length) {
        alert('原文和注释中的单词数量不匹配');
        return;
    }
    
    // 创建表格格式的输出
    let tableHTML = '<div class="scrollable-table">';
    tableHTML += '<table class="glossing-table">';
    
    // 第一行：原文
    tableHTML += '<tr class="original">';
    originalWords.forEach(word => {
        tableHTML += `<td>${word}</td>`;
    });
    tableHTML += '</tr>';
    
    // 第二行：注释
    tableHTML += '<tr class="gloss">';
    glossWords.forEach(word => {
        tableHTML += `<td>${word}</td>`;
    });
    tableHTML += '</tr>';
    
    tableHTML += '</table>';
    tableHTML += '</div>';
    
    // 添加翻译
    if (translation) {
        tableHTML += `<div class="translation">${translation}</div>`;
    }
    
    document.getElementById('output').innerHTML = tableHTML;
    
    // 设置当前注释
    glossingManager.setCurrentGlossing(original, gloss, translation);
});

// 保存当前注释
document.getElementById('save-current').addEventListener('click', function() {
    const original = document.getElementById('original').value.trim();
    const gloss = document.getElementById('gloss').value.trim();
    const translation = document.getElementById('translation').value.trim();
    
    if (!original || !gloss) {
        alert('请先生成有效的注释');
        return;
    }
    
    glossingManager.addGlossing(original, gloss, translation);
    alert('注释已保存！');
    updateSavedList();
});

// 清空所有保存
document.getElementById('clear-storage').addEventListener('click', function() {
    if (confirm('确定要清空所有保存的注释吗？此操作不可撤销。')) {
        glossingManager.clearAll();
        updateSavedList();
        alert('所有保存的注释已清空');
    }
});

// 更新已保存注释列表
function updateSavedList() {
    const savedList = document.querySelector('.saved-list');
    if (!savedList) return;
    
    const glossings = glossingManager.savedGlossings;
    
    if (glossings.length === 0) {
        savedList.innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">暂无保存的注释</div>';
        return;
    }
    
    let listHTML = '';
    glossings.forEach(glossing => {
        const preview = glossing.original.substring(0, 30) + (glossing.original.length > 30 ? '...' : '');
        listHTML += `
            <div class="saved-item" data-id="${glossing.id}">
                <div>
                    <strong>${glossing.timestamp}</strong>
                    <div class="saved-item-preview">${preview}</div>
                </div>
                <button class="delete-saved" onclick="deleteSavedItem(${glossing.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });
    
    savedList.innerHTML = listHTML;
}

// 删除单个保存的注释
function deleteSavedItem(id) {
    if (confirm('确定要删除这个注释吗？')) {
        glossingManager.deleteGlossing(id);
        updateSavedList();
    }
}

// 导出为CSV功能
document.getElementById('export-csv').addEventListener('click', function() {
    const glossings = glossingManager.savedGlossings;
    
    if (glossings.length === 0) {
        alert('没有保存的注释可以导出');
        return;
    }
    
    let csvContent = '序号,原文,注释,翻译,保存时间\n';
    
    glossings.forEach((glossing, index) => {
        const row = [
            index + 1,
            `"${glossing.original}"`,
            `"${glossing.gloss}"`,
            `"${glossing.translation}"`,
            `"${glossing.timestamp}"`
        ].join(',');
        csvContent += row + '\n';
    });
    
    // 创建下载链接
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `leipzig_glossings_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// 导出为Excel功能
document.getElementById('export-excel').addEventListener('click', function() {
    const glossings = glossingManager.savedGlossings;
    
    if (glossings.length === 0) {
        alert('没有保存的注释可以导出');
        return;
    }
    
    // 创建Excel内容
    let excelContent = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" 
              xmlns:x="urn:schemas-microsoft-com:office:excel" 
              xmlns="http://www.w3.org/TR/REC-html40">
        <head>
            <meta charset="UTF-8">
            <!--[if gte mso 9]>
            <xml>
                <x:ExcelWorkbook>
                    <x:ExcelWorksheets>
                        <x:ExcelWorksheet>
                            <x:Name>莱比契注释</x:Name>
                            <x:WorksheetOptions>
                                <x:DisplayGridlines/>
                            </x:WorksheetOptions>
                        </x:ExcelWorksheet>
                    </x:ExcelWorksheets>
                </x:ExcelWorkbook>
            </xml>
            <![endif]-->
            <style>
                table { border-collapse: collapse; width: 100%; }
                th, td { border: 1px solid black; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
            </style>
        </head>
        <body>
            <h2>莱比契注释导出</h2>
            <p>导出时间: ${new Date().toLocaleString()}</p>
            <p>总计: ${glossings.length} 条注释</p>
            <table>
                <tr>
                    <th>序号</th>
                    <th>原文</th>
                    <th>注释</th>
                    <th>翻译</th>
                    <th>保存时间</th>
                </tr>
    `;
    
    glossings.forEach((glossing, index) => {
        excelContent += `
            <tr>
                <td>${index + 1}</td>
                <td>${glossing.original}</td>
                <td>${glossing.gloss}</td>
                <td>${glossing.translation}</td>
                <td>${glossing.timestamp}</td>
            </tr>
        `;
    });
    
    excelContent += `
            </table>
        </body>
        </html>
    `;
    
    // 创建下载链接
    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `leipzig_glossings_${new Date().toISOString().split('T')[0]}.xls`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    // 显示保存数量
    glossingManager.updateSavedCount();
    
    // 创建已保存注释列表区域
    const outputSection = document.querySelector('.output-section');
    const savedListHTML = `
        <div class="saved-list-container">
            <h3>已保存的注释</h3>
            <div class="saved-list"></div>
        </div>
    `;
    outputSection.insertAdjacentHTML('beforeend', savedListHTML);
    
    // 更新已保存列表
    updateSavedList();
    
    // 显示示例
    document.getElementById('format-btn').click();
});
