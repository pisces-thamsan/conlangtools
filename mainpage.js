// 初始化页面
document.addEventListener('DOMContentLoaded', function () {
    const toolsContainer = document.getElementById('tools-container');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const searchBox = document.querySelector('.search-box');
    const toolCount = document.getElementById('tool-count');

    // 显示所有工具
    displayTools(tools);
    toolCount.textContent = tools.length;

    // 分类筛选功能
    categoryButtons.forEach(button => {
        button.addEventListener('click', function () {
            // 更新活动按钮
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const category = this.getAttribute('data-category');
            filterTools(category);
        });
    });

    // 搜索功能
    searchBox.addEventListener('input', function () {
        const searchTerm = this.value.toLowerCase();
        const activeCategory = document.querySelector('.category-btn.active').getAttribute('data-category');

        filterTools(activeCategory, searchTerm);
    });

    // 显示工具函数
    function displayTools(toolsToDisplay) {
        toolsContainer.innerHTML = '';

        toolsToDisplay.forEach(tool => {
            const toolCard = document.createElement('div');
            toolCard.className = 'tool-card';
            toolCard.setAttribute('data-category', tool.category);

            toolCard.innerHTML = `
                        <div class="tool-icon">
                            <i class="${tool.icon}"></i>
                        </div>
                        <div class="tool-content">
                            <h3>${tool.name}</h3>
                            <p>${tool.description}</p>
                            <a href="${tool.link}" target="_blank" class="tool-link">使用工具</a>
                        </div>
                    `;

            toolsContainer.appendChild(toolCard);
        });
    }

    // 筛选工具函数
    function filterTools(category, searchTerm = '') {
        let filteredTools = tools;

        // 按分类筛选
        if (category !== 'all') {
            filteredTools = filteredTools.filter(tool => tool.category === category);
        }

        // 按搜索词筛选
        if (searchTerm) {
            filteredTools = filteredTools.filter(tool =>
                tool.name.toLowerCase().includes(searchTerm) ||
                tool.description.toLowerCase().includes(searchTerm)
            );
        }

        // 显示筛选结果
        displayTools(filteredTools);
        toolCount.textContent = filteredTools.length;
    }
});
