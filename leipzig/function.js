document.getElementById('format-btn').addEventListener('click', function () {
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
});

// 页面加载时显示示例
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('format-btn').click();
});

// 导出为CSV功能
document.getElementById('export-csv').addEventListener('click', function () {
    const output = document.getElementById('output');
    const table = output.querySelector('.glossing-table');
    const translation = output.querySelector('.translation');

    if (!table) {
        alert('请先生成莱比契格式');
        return;
    }

    let csvContent = '';

    // 获取表格数据
    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const rowData = Array.from(cells).map(cell => `"${cell.textContent}"`).join(',');
        csvContent += rowData + '\r\n';
    });

    // 添加翻译
    if (translation) {
        csvContent += `"${translation.textContent}"\r\n`;
    }

    // 创建下载链接
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'leipzig_glossing.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// 导出为Excel功能
document.getElementById('export-excel').addEventListener('click', function () {
    const output = document.getElementById('output');
    const table = output.querySelector('.glossing-table');
    const translation = output.querySelector('.translation');

    if (!table) {
        alert('请先生成莱比契格式');
        return;
    }

    // 创建Excel内容
    let excelContent = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>莱比契注释</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>';

    // 添加表格
    excelContent += table.outerHTML;

    // 添加翻译
    if (translation) {
        excelContent += `<div style="margin-top: 15px; font-style: italic; text-align: center;">${translation.innerHTML}</div>`;
    }

    excelContent += '</body></html>';

    // 创建下载链接
    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'leipzig_glossing.xls');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});
