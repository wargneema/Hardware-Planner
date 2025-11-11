// HardwarePlanner JavaScript
let partCount = 0;
let builds = [];
let currentBuildIndex = 0;
let currency = 'USD';
let budgetLimit = 0;

// Component categories with icons and typical price ranges
const componentCategories = {
    'CPU': { icon: 'fas fa-microchip', color: '#e74c3c', avgPrice: 300 },
    'GPU': { icon: 'fas fa-tv', color: '#3498db', avgPrice: 500 },
    'RAM': { icon: 'fas fa-memory', color: '#9b59b6', avgPrice: 150 },
    'Motherboard': { icon: 'fas fa-th-large', color: '#f39c12', avgPrice: 200 },
    'Storage': { icon: 'fas fa-hdd', color: '#27ae60', avgPrice: 100 },
    'PSU': { icon: 'fas fa-plug', color: '#e67e22', avgPrice: 120 },
    'Case': { icon: 'fas fa-cube', color: '#34495e', avgPrice: 80 },
    'Cooler': { icon: 'fas fa-snowflake', color: '#1abc9c', avgPrice: 60 },
    'Other': { icon: 'fas fa-cog', color: '#95a5a6', avgPrice: 50 }
};

// Popular component suggestions with detailed specs
const componentSuggestions = {
    'CPU': [
        { name: 'Intel Core i5-13600K', price: 320, socket: 'LGA1700', power: 125, performance: 85 },
        { name: 'AMD Ryzen 5 7600X', price: 300, socket: 'AM5', power: 105, performance: 82 },
        { name: 'Intel Core i7-13700K', price: 420, socket: 'LGA1700', power: 125, performance: 92 },
        { name: 'AMD Ryzen 7 7700X', price: 400, socket: 'AM5', power: 105, performance: 90 },
        { name: 'Intel Core i9-13900K', price: 580, socket: 'LGA1700', power: 125, performance: 98 }
    ],
    'GPU': [
        { name: 'NVIDIA RTX 4070', price: 600, power: 200, performance: 85, length: 267 },
        { name: 'AMD RX 7800 XT', price: 500, power: 263, performance: 82, length: 276 },
        { name: 'NVIDIA RTX 4080', price: 1200, power: 320, performance: 95, length: 304 },
        { name: 'AMD RX 7900 XTX', price: 1000, power: 355, performance: 92, length: 287 },
        { name: 'NVIDIA RTX 4090', price: 1600, power: 450, performance: 100, length: 304 }
    ],
    'RAM': [
        { name: 'Corsair Vengeance LPX 16GB DDR4-3200', price: 60, type: 'DDR4', speed: 3200, capacity: 16 },
        { name: 'G.Skill Trident Z5 32GB DDR5-5600', price: 180, type: 'DDR5', speed: 5600, capacity: 32 },
        { name: 'Kingston Fury Beast 16GB DDR4-3600', price: 65, type: 'DDR4', speed: 3600, capacity: 16 },
        { name: 'Corsair Dominator Platinum 32GB DDR5-5200', price: 220, type: 'DDR5', speed: 5200, capacity: 32 }
    ],
    'Motherboard': [
        { name: 'ASUS ROG Strix B550-F', price: 190, socket: 'AM4', ramType: 'DDR4', maxRam: 128 },
        { name: 'MSI MAG B650 Tomahawk', price: 200, socket: 'AM5', ramType: 'DDR5', maxRam: 128 },
        { name: 'ASUS TUF Gaming X570-Plus', price: 180, socket: 'AM4', ramType: 'DDR4', maxRam: 128 },
        { name: 'Gigabyte B550 AORUS Elite', price: 160, socket: 'AM4', ramType: 'DDR4', maxRam: 128 }
    ],
    'Storage': [
        { name: 'Samsung 980 Pro 1TB NVMe', price: 100, capacity: 1000, type: 'NVMe' },
        { name: 'WD Black SN850X 2TB', price: 200, capacity: 2000, type: 'NVMe' },
        { name: 'Crucial MX4 1TB SATA SSD', price: 80, capacity: 1000, type: 'SATA' },
        { name: 'Seagate Barracuda 2TB HDD', price: 60, capacity: 2000, type: 'HDD' }
    ],
    'PSU': [
        { name: 'Corsair RM750x 750W', price: 120, wattage: 750, efficiency: '80+ Gold' },
        { name: 'EVGA SuperNOVA 850 G5', price: 140, wattage: 850, efficiency: '80+ Gold' },
        { name: 'Seasonic Focus GX-650', price: 100, wattage: 650, efficiency: '80+ Gold' },
        { name: 'be quiet! Straight Power 11 750W', price: 130, wattage: 750, efficiency: '80+ Gold' }
    ],
    'Case': [
        { name: 'Fractal Design Define 7', price: 170, maxGpuLength: 315, formFactor: 'Mid Tower' },
        { name: 'NZXT H510', price: 80, maxGpuLength: 325, formFactor: 'Mid Tower' },
        { name: 'Corsair 4000D Airflow', price: 100, maxGpuLength: 360, formFactor: 'Mid Tower' },
        { name: 'Lian Li PC-O11 Dynamic', price: 150, maxGpuLength: 420, formFactor: 'Mid Tower' }
    ],
    'Cooler': [
        { name: 'Noctua NH-D15', price: 100, type: 'Air', socket: ['LGA1700', 'AM4', 'AM5'] },
        { name: 'Corsair H100i RGB Platinum', price: 160, type: 'AIO', socket: ['LGA1700', 'AM4', 'AM5'] },
        { name: 'be quiet! Dark Rock Pro 4', price: 90, type: 'Air', socket: ['LGA1700', 'AM4'] },
        { name: 'Arctic Liquid Freezer II 280', price: 120, type: 'AIO', socket: ['LGA1700', 'AM4', 'AM5'] }
    ]
};

// Build templates
const buildTemplates = {
    'Budget Gaming': {
        description: 'Affordable gaming build for 1080p gaming',
        estimatedPrice: 800,
        parts: [
            { category: 'CPU', name: 'AMD Ryzen 5 5600', price: 130 },
            { category: 'GPU', name: 'AMD RX 6600', price: 230 },
            { category: 'RAM', name: 'Corsair Vengeance LPX 16GB DDR4-3200', price: 60 },
            { category: 'Motherboard', name: 'MSI B450M PRO-VDH MAX', price: 70 },
            { category: 'Storage', name: 'Kingston NV2 500GB NVMe', price: 35 },
            { category: 'PSU', name: 'EVGA BR 600W', price: 50 },
            { category: 'Case', name: 'Cooler Master MasterBox Q300L', price: 45 },
            { category: 'Cooler', name: 'AMD Wraith Stealth (included)', price: 0 }
        ]
    },
    'High-End Gaming': {
        description: 'Premium gaming build for 4K gaming',
        estimatedPrice: 2500,
        parts: [
            { category: 'CPU', name: 'Intel Core i7-13700K', price: 420 },
            { category: 'GPU', name: 'NVIDIA RTX 4080', price: 1200 },
            { category: 'RAM', name: 'G.Skill Trident Z5 32GB DDR5-5600', price: 180 },
            { category: 'Motherboard', name: 'ASUS ROG Strix Z790-E', price: 400 },
            { category: 'Storage', name: 'Samsung 980 Pro 2TB NVMe', price: 200 },
            { category: 'PSU', name: 'Corsair RM850x 850W', price: 140 },
            { category: 'Case', name: 'Fractal Design Define 7', price: 170 },
            { category: 'Cooler', name: 'Noctua NH-D15', price: 100 }
        ]
    },
    'Workstation': {
        description: 'Professional workstation for content creation',
        estimatedPrice: 3000,
        parts: [
            { category: 'CPU', name: 'AMD Ryzen 9 7900X', price: 550 },
            { category: 'GPU', name: 'NVIDIA RTX 4070 Ti', price: 800 },
            { category: 'RAM', name: 'Corsair Vengeance Pro 64GB DDR5-5200', price: 400 },
            { category: 'Motherboard', name: 'ASUS ProArt X670E-CREATOR', price: 500 },
            { category: 'Storage', name: 'Samsung 980 Pro 2TB NVMe', price: 200 },
            { category: 'PSU', name: 'Seasonic Prime TX-850', price: 200 },
            { category: 'Case', name: 'Fractal Design Define 7 XL', price: 200 },
            { category: 'Cooler', name: 'Corsair H150i Elite Capellix', price: 180 }
        ]
    },
    'Office Build': {
        description: 'Basic office computer for productivity tasks',
        estimatedPrice: 500,
        parts: [
            { category: 'CPU', name: 'AMD Ryzen 5 5600G', price: 160 },
            { category: 'RAM', name: 'Corsair Vengeance LPX 16GB DDR4-3200', price: 60 },
            { category: 'Motherboard', name: 'ASRock B450M PRO4', price: 70 },
            { category: 'Storage', name: 'Crucial MX4 500GB SATA SSD', price: 50 },
            { category: 'PSU', name: 'EVGA BR 450W', price: 40 },
            { category: 'Case', name: 'Fractal Design Core 1000', price: 50 },
            { category: 'Cooler', name: 'AMD Wraith Stealth (included)', price: 0 }
        ]
    }
};

// Currency rates (simplified - in real app would use API)
const currencyRates = {
    'USD': 1,
    'EUR': 0.85,
    'GBP': 0.73,
    'CAD': 1.25,
    'AUD': 1.35
};

const currencySymbols = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'CAD': 'C$',
    'AUD': 'A$'
};

// Initialize the application
function init() {
    loadFromStorage();
    setupEventListeners();
    setupDragAndDrop();
    updateComponentCount();
    updateBuildSelector();
    updateCurrencyDisplay();
    checkBudgetAlert();
}

// Local Storage functions
function saveToStorage() {
    const buildData = {
        builds: builds,
        currentBuildIndex: currentBuildIndex,
        currency: currency,
        budgetLimit: budgetLimit
    };
    localStorage.setItem('hardwarePlanner', JSON.stringify(buildData));
}

function loadFromStorage() {
    const saved = localStorage.getItem('hardwarePlanner');
    if (saved) {
        const data = JSON.parse(saved);
        builds = data.builds || [];
        currentBuildIndex = data.currentBuildIndex || 0;
        currency = data.currency || 'USD';
        budgetLimit = data.budgetLimit || 0;
        
        if (builds.length === 0) {
            builds = [{ name: 'My Hardware Build', parts: [] }];
        }
        
        loadCurrentBuild();
    } else {
        builds = [{ name: 'My Hardware Build', parts: [] }];
    }
}

function loadCurrentBuild() {
    const container = document.getElementById('parts-container');
    container.innerHTML = '';
    partCount = 0;
    
    if (builds[currentBuildIndex] && builds[currentBuildIndex].parts) {
        builds[currentBuildIndex].parts.forEach(part => {
            addPartFromData(part);
        });
    }
    
    updateTotal();
    updateComponentCount();
    toggleEmptyState();
}

function saveCurrentBuild() {
    const parts = [];
    const partRows = document.querySelectorAll('.part-row');
    
    partRows.forEach(row => {
        const category = row.querySelector('.category-select').value;
        const name = row.querySelector('.component-input input').value;
        const link = row.querySelector('.link-input input').value;
        const price = parseFloat(row.querySelector('.price-input input').value) || 0;
        const purchased = row.querySelector('.purchased-checkbox input').checked;
        const noteElement = row.querySelector('.component-note');
        const note = noteElement ? noteElement.textContent.replace('📝 ', '') : '';
        
        if (name || link || price) {
            parts.push({ category, name, link, price, purchased, note });
        }
    });
    
    builds[currentBuildIndex].parts = parts;
    saveToStorage();
}

// Build management
function createNewBuild() {
    const name = prompt('Enter build name:', `Build ${builds.length + 1}`);
    if (name) {
        builds.push({ name: name, parts: [] });
        currentBuildIndex = builds.length - 1;
        loadCurrentBuild();
        updateBuildSelector();
        saveToStorage();
    }
}

function deleteBuild() {
    if (builds.length > 1) {
        if (confirm(`Delete "${builds[currentBuildIndex].name}"?`)) {
            builds.splice(currentBuildIndex, 1);
            currentBuildIndex = Math.max(0, currentBuildIndex - 1);
            loadCurrentBuild();
            updateBuildSelector();
            saveToStorage();
        }
    } else {
        alert('Cannot delete the last build.');
    }
}

function switchBuild(index) {
    saveCurrentBuild();
    currentBuildIndex = index;
    loadCurrentBuild();
}

function updateBuildSelector() {
    const selector = document.getElementById('build-selector');
    selector.innerHTML = '';
    
    builds.forEach((build, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = build.name;
        option.selected = index === currentBuildIndex;
        selector.appendChild(option);
    });
}

// Component management
function addPart() {
    console.log('addPart function called!');
    partCount++;
    const container = document.getElementById('parts-container');
    const emptyState = document.getElementById('empty-state');
    
    const partRow = document.createElement('div');
    partRow.className = 'part-row';
    partRow.id = `part-${partCount}`;
    partRow.draggable = true;
    partRow.dataset.partId = partCount;
    
    partRow.innerHTML = createPartRowHTML(partCount);
    container.appendChild(partRow);
    
    setupPartRowEvents(partRow);
    emptyState.style.display = 'none';
    updateTotal();
    updateComponentCount();
    saveCurrentBuild();
}

function addPartFromData(partData) {
    partCount++;
    const container = document.getElementById('parts-container');
    
    const partRow = document.createElement('div');
    partRow.className = 'part-row';
    partRow.id = `part-${partCount}`;
    partRow.draggable = true;
    partRow.dataset.partId = partCount;
    
    // Handle grouped options
    if (partData.parentId) {
        partRow.dataset.parentId = partData.parentId;
        partRow.classList.add('option-row', 'grouped-option');
        partRow.insertAdjacentHTML('afterbegin', '<div class="option-indicator"><i class="fas fa-arrow-turn-down"></i> Option</div>');
    }
    
    partRow.innerHTML = createPartRowHTML(partCount, partData);
    container.appendChild(partRow);
    setupPartRowEvents(partRow);
}

function createPartRowHTML(id, data = {}) {
    const categoryOptions = Object.keys(componentCategories).map(cat => 
        `<option value="${cat}" ${data.category === cat ? 'selected' : ''}>${cat}</option>`
    ).join('');
    
    return `
        <div class="col-drag">
            <button class="drag-handle" title="Drag to reorder">
                <i class="fas fa-grip-vertical"></i>
            </button>
        </div>
        <div class="col-category">
            <select class="category-select" onchange="updateCategoryIcon(this); saveCurrentBuild(); validateBuild();">
                ${categoryOptions}
            </select>
        </div>
        <div class="col-component">
            <div class="component-input">
                <i class="component-icon ${componentCategories[data.category || 'CPU'].icon}"></i>
                <input type="text" 
                       placeholder="e.g., Intel Core i7-13700K" 
                       value="${data.name || ''}"
                       onchange="updateTotal(); saveCurrentBuild(); validateBuild();"
                       list="suggestions-${id}">
                <datalist id="suggestions-${id}"></datalist>
                <button class="note-btn" onclick="addNoteToComponent(${id})" title="Add note">
                    <i class="fas fa-sticky-note"></i>
                </button>
            </div>
            ${data.note ? `<div class="component-note"><i class="fas fa-sticky-note"></i> ${data.note}</div>` : ''}
        </div>
        <div class="col-link">
            <div class="link-input">
                <i class="fas fa-link link-icon"></i>
                <input type="url" 
                       placeholder="https://example.com/product"
                       value="${data.link || ''}"
                       onchange="saveCurrentBuild();">
                <button class="link-btn" onclick="openLink(this)" title="Open link">
                    <i class="fas fa-external-link-alt"></i>
                </button>
            </div>
        </div>
        <div class="col-price">
            <div class="price-input-group">
                <div class="price-input">
                    <span class="currency">${currencySymbols[currency]}</span>
                    <input type="number" 
                           step="0.01" 
                           min="0" 
                           placeholder="0.00"
                           value="${data.price || ''}"
                           onchange="updateTotal(); saveCurrentBuild(); checkBudgetAlert(); validateBuild();">
                    <button class="confirm-price-btn" onclick="confirmPrice(${id})" title="Confirm current price">
                        <i class="fas fa-check"></i>
                    </button>
                </div>
                <button class="price-history-btn" onclick="showPriceHistory(${id})" title="Price history">
                    <i class="fas fa-chart-line"></i>
                </button>
            </div>
        </div>
        <div class="col-purchased">
            <label class="purchased-checkbox">
                <input type="checkbox" ${data.purchased ? 'checked' : ''} onchange="togglePurchased(${id})">
                <span class="checkmark"></span>
                <span class="purchased-label">Purchased</span>
            </label>
        </div>
        <div class="col-actions">
            <button class="add-option-btn" onclick="addOption(${id})" title="Add alternative option">
                <i class="fas fa-plus-circle"></i>
            </button>
            <button class="favorite-btn" onclick="toggleFavorite(${id})" title="Mark as favorite">
                <i class="fas fa-heart"></i>
            </button>
            <button class="duplicate-btn" onclick="duplicatePart(${id})" title="Duplicate component">
                <i class="fas fa-copy"></i>
            </button>
            <button class="remove-btn" onclick="removePart(${id})" title="Remove component">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
}

function setupPartRowEvents(partRow) {
    const categorySelect = partRow.querySelector('.category-select');
    const componentInput = partRow.querySelector('.component-input input');
    
    // Update suggestions when category changes
    updateSuggestions(categorySelect, componentInput);
    
    // Update icon when category changes
    updateCategoryIcon(categorySelect);
    
    // Setup drag handle
    const dragHandle = partRow.querySelector('.drag-handle');
    if (dragHandle) {
        dragHandle.addEventListener('mousedown', function() {
            partRow.draggable = true;
        });
        
        dragHandle.addEventListener('mouseup', function() {
            partRow.draggable = false;
        });
    }
}

function updateCategoryIcon(selectElement) {
    const category = selectElement.value;
    const icon = selectElement.closest('.part-row').querySelector('.component-icon');
    const categoryData = componentCategories[category];
    
    icon.className = `component-icon ${categoryData.icon}`;
    icon.style.color = categoryData.color;
    
    // Update suggestions
    const componentInput = selectElement.closest('.part-row').querySelector('.component-input input');
    updateSuggestions(selectElement, componentInput);
}

function updateSuggestions(categorySelect, componentInput) {
    const category = categorySelect.value;
    const datalist = componentInput.nextElementSibling;
    
    datalist.innerHTML = '';
    if (componentSuggestions[category]) {
        componentSuggestions[category].forEach(suggestion => {
            const option = document.createElement('option');
            option.value = suggestion.name;
            datalist.appendChild(option);
        });
    }
}

// Build template functions
function loadTemplate(templateName) {
    if (!buildTemplates[templateName]) return;
    
    const template = buildTemplates[templateName];
    const container = document.getElementById('parts-container');
    
    // Clear existing parts
    container.innerHTML = '';
    partCount = 0;
    
    // Add template parts
    template.parts.forEach(part => {
        addPartFromData(part);
    });
    
    updateTotal();
    updateComponentCount();
    toggleEmptyState();
    saveCurrentBuild();
    
    // Show template loaded message
    showNotification(`Template "${templateName}" loaded successfully!`, 'success');
}

function showTemplateModal() {
    const modal = document.getElementById('template-modal');
    modal.style.display = 'block';
    
    // Populate template cards
    const container = document.getElementById('template-cards');
    container.innerHTML = '';
    
    Object.entries(buildTemplates).forEach(([name, template]) => {
        const card = document.createElement('div');
        card.className = 'template-card';
        card.innerHTML = `
            <h3>${name}</h3>
            <p>${template.description}</p>
            <div class="template-price">Est. ${formatCurrency(template.estimatedPrice)}</div>
            <div class="template-parts">${template.parts.length} components</div>
            <button onclick="loadTemplate('${name}'); closeTemplateModal();" class="load-template-btn">
                Load Template
            </button>
        `;
        container.appendChild(card);
    });
}

function closeTemplateModal() {
    document.getElementById('template-modal').style.display = 'none';
}

// Component comparison functions
function showComparisonModal() {
    const modal = document.getElementById('comparison-modal');
    modal.style.display = 'block';
    populateComparisonCategories();
}

function closeComparisonModal() {
    document.getElementById('comparison-modal').style.display = 'none';
}

function populateComparisonCategories() {
    const select = document.getElementById('comparison-category');
    select.innerHTML = '';
    
    Object.keys(componentSuggestions).forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        select.appendChild(option);
    });
    
    updateComparisonComponents();
}

function updateComparisonComponents() {
    const category = document.getElementById('comparison-category').value;
    const container = document.getElementById('comparison-components');
    
    container.innerHTML = '';
    
    if (componentSuggestions[category]) {
        componentSuggestions[category].forEach(component => {
            const card = document.createElement('div');
            card.className = 'comparison-card';
            card.innerHTML = createComparisonCardHTML(component, category);
            container.appendChild(card);
        });
    }
}

function createComparisonCardHTML(component, category) {
    let specs = '';
    
    switch(category) {
        case 'CPU':
            specs = `
                <div class="spec">Socket: ${component.socket}</div>
                <div class="spec">Power: ${component.power}W</div>
                <div class="spec">Performance: ${component.performance}/100</div>
            `;
            break;
        case 'GPU':
            specs = `
                <div class="spec">Power: ${component.power}W</div>
                <div class="spec">Length: ${component.length}mm</div>
                <div class="spec">Performance: ${component.performance}/100</div>
            `;
            break;
        case 'RAM':
            specs = `
                <div class="spec">Type: ${component.type}</div>
                <div class="spec">Speed: ${component.speed}MHz</div>
                <div class="spec">Capacity: ${component.capacity}GB</div>
            `;
            break;
        case 'PSU':
            specs = `
                <div class="spec">Wattage: ${component.wattage}W</div>
                <div class="spec">Efficiency: ${component.efficiency}</div>
            `;
            break;
    }
    
    return `
        <h4>${component.name}</h4>
        <div class="component-price">${formatCurrency(component.price)}</div>
        <div class="component-specs">${specs}</div>
        <button onclick="addComponentFromComparison('${component.name}', '${category}', ${component.price})" class="add-component-btn">
            Add to Build
        </button>
    `;
}

function addComponentFromComparison(name, category, price) {
    addPartFromData({ category, name, price });
    updateTotal();
    updateComponentCount();
    toggleEmptyState();
    saveCurrentBuild();
    closeComparisonModal();
    showNotification(`${name} added to build!`, 'success');
}

// Validation functions
function validateBuild() {
    const parts = getCurrentBuildParts();
    const warnings = [];
    
    // Check socket compatibility
    const cpu = parts.find(p => p.category === 'CPU');
    const motherboard = parts.find(p => p.category === 'Motherboard');
    const cooler = parts.find(p => p.category === 'Cooler');
    
    if (cpu && motherboard) {
        const cpuData = componentSuggestions.CPU.find(c => c.name === cpu.name);
        const mbData = componentSuggestions.Motherboard.find(m => m.name === motherboard.name);
        
        if (cpuData && mbData && cpuData.socket !== mbData.socket) {
            warnings.push({
                type: 'error',
                message: `Socket mismatch: ${cpu.name} (${cpuData.socket}) incompatible with ${motherboard.name} (${mbData.socket})`
            });
        }
    }
    
    // Check RAM compatibility
    const ram = parts.find(p => p.category === 'RAM');
    if (ram && motherboard) {
        const ramData = componentSuggestions.RAM.find(r => r.name === ram.name);
        const mbData = componentSuggestions.Motherboard.find(m => m.name === motherboard.name);
        
        if (ramData && mbData && ramData.type !== mbData.ramType) {
            warnings.push({
                type: 'error',
                message: `RAM type mismatch: ${ram.name} (${ramData.type}) incompatible with ${motherboard.name} (${mbData.ramType})`
            });
        }
    }
    
    // Check PSU wattage
    const psu = parts.find(p => p.category === 'PSU');
    const gpu = parts.find(p => p.category === 'GPU');
    
    if (psu && (cpu || gpu)) {
        const psudData = componentSuggestions.PSU.find(p => p.name === psu.name);
        let totalPower = 100; // Base system power
        
        if (cpu) {
            const cpuData = componentSuggestions.CPU.find(c => c.name === cpu.name);
            if (cpuData) totalPower += cpuData.power;
        }
        
        if (gpu) {
            const gpuData = componentSuggestions.GPU.find(g => g.name === gpu.name);
            if (gpuData) totalPower += gpuData.power;
        }
        
        if (psudData && totalPower > psudData.wattage * 0.8) {
            warnings.push({
                type: 'warning',
                message: `PSU may be insufficient: ${totalPower}W estimated vs ${psudData.wattage}W PSU (recommend 20% headroom)`
            });
        }
    }
    
    // Check GPU clearance
    const case_ = parts.find(p => p.category === 'Case');
    if (gpu && case_) {
        const gpuData = componentSuggestions.GPU.find(g => g.name === gpu.name);
        const caseData = componentSuggestions.Case.find(c => c.name === case_.name);
        
        if (gpuData && caseData && gpuData.length > caseData.maxGpuLength) {
            warnings.push({
                type: 'error',
                message: `GPU too long: ${gpu.name} (${gpuData.length}mm) won't fit in ${case_.name} (max ${caseData.maxGpuLength}mm)`
            });
        }
    }
    
    displayValidationResults(warnings);
    return warnings;
}

function getCurrentBuildParts() {
    const parts = [];
    const partRows = document.querySelectorAll('.part-row');
    
    partRows.forEach(row => {
        const category = row.querySelector('.category-select').value;
        const name = row.querySelector('.component-input input').value;
        const price = parseFloat(row.querySelector('.price-input input').value) || 0;
        
        if (name) {
            parts.push({ category, name, price });
        }
    });
    
    return parts;
}

function displayValidationResults(warnings) {
    const container = document.getElementById('validation-results');
    container.innerHTML = '';
    
    if (warnings.length === 0) {
        container.innerHTML = '<div class="validation-success"><i class="fas fa-check-circle"></i> No compatibility issues found!</div>';
    } else {
        warnings.forEach(warning => {
            const div = document.createElement('div');
            div.className = `validation-${warning.type}`;
            div.innerHTML = `<i class="fas fa-${warning.type === 'error' ? 'exclamation-triangle' : 'exclamation-circle'}"></i> ${warning.message}`;
            container.appendChild(div);
        });
    }
}

// Notes functionality
function addNoteToComponent(partId) {
    const note = prompt('Add a note for this component:');
    if (note) {
        const partRow = document.getElementById(`part-${partId}`);
        let noteElement = partRow.querySelector('.component-note');
        
        if (!noteElement) {
            noteElement = document.createElement('div');
            noteElement.className = 'component-note';
            partRow.querySelector('.col-component').appendChild(noteElement);
        }
        
        noteElement.innerHTML = `<i class="fas fa-sticky-note"></i> ${note}`;
        noteElement.title = note;
        
        saveCurrentBuild();
    }
}

// Price History Functions
function confirmPrice(partId) {
    const partRow = document.getElementById(`part-${partId}`);
    const priceInput = partRow.querySelector('.price-input input');
    const componentName = partRow.querySelector('.component-input input').value;
    const price = parseFloat(priceInput.value);
    
    if (!componentName || !price) {
        showNotification('Please enter component name and price first', 'error');
        return;
    }
    
    // Get or create price history
    let priceHistory = JSON.parse(localStorage.getItem('priceHistory') || '{}');
    
    if (!priceHistory[componentName]) {
        priceHistory[componentName] = [];
    }
    
    // Add new price entry
    const priceEntry = {
        price: price,
        date: new Date().toISOString().split('T')[0],
        currency: currency
    };
    
    priceHistory[componentName].push(priceEntry);
    
    // Save to localStorage
    localStorage.setItem('priceHistory', JSON.stringify(priceHistory));
    
    showNotification(`Price ${formatCurrency(price)} confirmed for ${componentName}`, 'success');
    
    // Visual feedback
    const confirmBtn = partRow.querySelector('.confirm-price-btn');
    confirmBtn.style.background = '#28a745';
    setTimeout(() => {
        confirmBtn.style.background = '#6c757d';
    }, 1000);
}

function showPriceHistory(partId) {
    const partRow = document.getElementById(`part-${partId}`);
    const componentName = partRow.querySelector('.component-input input').value;
    
    if (!componentName) {
        showNotification('Please enter component name first', 'error');
        return;
    }
    
    const priceHistory = JSON.parse(localStorage.getItem('priceHistory') || '{}');
    const componentHistory = priceHistory[componentName] || [];
    
    if (componentHistory.length === 0) {
        showNotification('No price history found for this component', 'info');
        return;
    }
    
    // Show price history modal
    const modal = document.getElementById('price-history-modal');
    const componentNameEl = document.getElementById('price-history-component');
    const historyTable = document.getElementById('price-history-table');
    
    componentNameEl.textContent = componentName;
    
    // Build history table
    let tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Price</th>
                    <th>Change</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    componentHistory.forEach((entry, index) => {
        let changeHTML = '';
        if (index > 0) {
            const prevPrice = componentHistory[index - 1].price;
            const change = entry.price - prevPrice;
            const changePercent = ((change / prevPrice) * 100).toFixed(1);
            const changeClass = change > 0 ? 'price-increase' : change < 0 ? 'price-decrease' : 'price-same';
            changeHTML = `<span class="${changeClass}">
                ${change > 0 ? '+' : ''}${formatCurrency(change)} (${changePercent}%)
            </span>`;
        }
        
        tableHTML += `
            <tr>
                <td>${entry.date}</td>
                <td>${formatCurrency(entry.price)}</td>
                <td>${changeHTML}</td>
            </tr>
        `;
    });
    
    tableHTML += '</tbody></table>';
    historyTable.innerHTML = tableHTML;
    
    modal.style.display = 'block';
}

function closePriceHistoryModal() {
    document.getElementById('price-history-modal').style.display = 'none';
}

// Purchase Status Functions
function togglePurchased(partId) {
    const partRow = document.getElementById(`part-${partId}`);
    const checkbox = partRow.querySelector('.purchased-checkbox input');
    const isPurchased = checkbox.checked;
    
    // Visual feedback
    if (isPurchased) {
        partRow.classList.add('purchased');
        showNotification('Component marked as purchased', 'success');
    } else {
        partRow.classList.remove('purchased');
        showNotification('Component marked as not purchased', 'info');
    }
    
    saveCurrentBuild();
}

// Export Functions
function showExportModal() {
    const modal = document.getElementById('export-modal');
    modal.style.display = 'block';
    
    // Update build summary
    updateExportPreview();
}

function closeExportModal() {
    document.getElementById('export-modal').style.display = 'none';
}

function updateExportPreview() {
    const parts = getCurrentBuildParts();
    const previewTable = document.getElementById('export-preview');
    
    let totalPrice = 0;
    let purchasedCount = 0;
    let purchasedTotal = 0;
    
    // Summary cards
    let summaryHTML = `
        <div class="export-summary">
            <div class="summary-grid">
    `;
    
    // Calculate totals first
    parts.forEach(part => {
        const partRow = Array.from(document.querySelectorAll('.part-row')).find(row => 
            row.querySelector('.component-input input').value === part.name
        );
        const isPurchased = partRow ? partRow.querySelector('.purchased-checkbox input').checked : false;
        
        totalPrice += part.price;
        if (isPurchased) {
            purchasedCount++;
            purchasedTotal += part.price;
        }
    });
    
    summaryHTML += `
                <div class="summary-card">
                    <div class="summary-icon">📦</div>
                    <div class="summary-info">
                        <div class="summary-value">${parts.length}</div>
                        <div class="summary-label">Components</div>
                    </div>
                </div>
                <div class="summary-card">
                    <div class="summary-icon">💰</div>
                    <div class="summary-info">
                        <div class="summary-value">${formatCurrency(totalPrice)}</div>
                        <div class="summary-label">Total Cost</div>
                    </div>
                </div>
                <div class="summary-card">
                    <div class="summary-icon">✅</div>
                    <div class="summary-info">
                        <div class="summary-value">${purchasedCount}/${parts.length}</div>
                        <div class="summary-label">Purchased</div>
                    </div>
                </div>
                <div class="summary-card">
                    <div class="summary-icon">💳</div>
                    <div class="summary-info">
                        <div class="summary-value">${formatCurrency(totalPrice - purchasedTotal)}</div>
                        <div class="summary-label">Remaining</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Enhanced table
    let tableHTML = `
        <div class="export-table-container">
            <table class="export-table">
                <thead>
                    <tr>
                        <th class="col-category">Category</th>
                        <th class="col-component">Component</th>
                        <th class="col-website">Website</th>
                        <th class="col-price">Price</th>
                        <th class="col-status">Status</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    parts.forEach(part => {
        const partRow = Array.from(document.querySelectorAll('.part-row')).find(row => 
            row.querySelector('.component-input input').value === part.name
        );
        
        const isPurchased = partRow ? partRow.querySelector('.purchased-checkbox input').checked : false;
        const link = partRow ? partRow.querySelector('.link-input input').value : '';
        const websiteName = link ? new URL(link).hostname.replace('www.', '') : 'N/A';
        
        const statusBadge = isPurchased 
            ? '<span class="status-badge purchased">✅ Purchased</span>'
            : '<span class="status-badge pending">❌ Pending</span>';
            
        const categoryBadge = `<span class="category-badge ${part.category.toLowerCase()}">${part.category}</span>`;
        
        tableHTML += `
            <tr class="${isPurchased ? 'purchased-row' : ''}">
                <td class="col-category">${categoryBadge}</td>
                <td class="col-component">
                    <div class="component-name">${part.name}</div>
                </td>
                <td class="col-website">
                    ${link ? `<a href="${link}" target="_blank" class="website-link">${websiteName}</a>` : '<span class="no-link">N/A</span>'}
                </td>
                <td class="col-price">
                    <span class="price-amount">${formatCurrency(part.price)}</span>
                </td>
                <td class="col-status">${statusBadge}</td>
            </tr>
        `;
    });
    
    tableHTML += `
                </tbody>
            </table>
        </div>
    `;
    
    previewTable.innerHTML = summaryHTML + tableHTML;
}

function exportToPDF() {
    const printWindow = window.open('', '_blank');
    const buildName = builds[currentBuildIndex].name;
    const parts = getCurrentBuildParts();
    
    let totalPrice = 0;
    let purchasedCount = 0;
    let purchasedTotal = 0;
    
    // Calculate totals and create table rows (same as PNG)
    let tableRows = '';
    parts.forEach(part => {
        const partRow = Array.from(document.querySelectorAll('.part-row')).find(row => 
            row.querySelector('.component-input input').value === part.name
        );
        
        const isPurchased = partRow ? partRow.querySelector('.purchased-checkbox input').checked : false;
        const link = partRow ? partRow.querySelector('.link-input input').value : '';
        const websiteName = link ? new URL(link).hostname.replace('www.', '') : 'N/A';
        
        totalPrice += part.price;
        if (isPurchased) {
            purchasedCount++;
            purchasedTotal += part.price;
        }
        
        const statusBadge = isPurchased 
            ? '<span class="status-badge purchased">✅ Purchased</span>'
            : '<span class="status-badge pending">❌ Pending</span>';
            
        const categoryBadge = `<span class="category-badge ${part.category.toLowerCase()}">${part.category}</span>`;
        
        tableRows += `
            <tr class="${isPurchased ? 'purchased-row' : ''}">
                <td>${categoryBadge}</td>
                <td><strong>${part.name}</strong></td>
                <td>${link ? `<a href="${link}" target="_blank">${websiteName}</a>` : '<span class="no-link">N/A</span>'}</td>
                <td><strong class="price-amount">${formatCurrency(part.price)}</strong></td>
                <td>${statusBadge}</td>
            </tr>
        `;
    });
    
    // Create table rows
    let pdfTableRows = '';
    parts.forEach(part => {
        const partRow = Array.from(document.querySelectorAll('.part-row')).find(row => 
            row.querySelector('.component-input input').value === part.name
        );
        
        const isPurchased = partRow ? partRow.querySelector('.purchased-checkbox input').checked : false;
        const link = partRow ? partRow.querySelector('.link-input input').value : '';
        const websiteName = link ? new URL(link).hostname.replace('www.', '') : 'N/A';
        
        if (isPurchased) {
            purchasedCount++;
            purchasedTotal += part.price;
        }
        totalPrice += part.price;
        
        const statusIcon = isPurchased ? '✅' : '❌';
        const statusText = isPurchased ? 'Purchased' : 'Not Purchased';
        const rowClass = isPurchased ? 'purchased-row' : '';
        
        pdfTableRows += `
            <tr class="${rowClass}">
                <td class="category-cell">
                    <div class="category-badge ${part.category.toLowerCase()}">${part.category}</div>
                </td>
                <td class="component-cell">
                    <strong>${part.name}</strong>
                </td>
                <td class="website-cell">
                    ${link ? `<a href="${link}" target="_blank">${websiteName}</a>` : 'N/A'}
                </td>
                <td class="price-cell">
                    <strong>${formatCurrency(part.price)}</strong>
                </td>
                <td class="status-cell">
                    <span class="status-badge ${isPurchased ? 'purchased' : 'pending'}">
                        ${statusIcon} ${statusText}
                    </span>
                </td>
            </tr>
        `;
    });
    
    let htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>${buildName} - PC Build Plan</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { 
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                    line-height: 1.4; 
                    color: #333; 
                    background: #f8f9fa;
                    padding: 15px;
                    font-size: 12px;
                }
                
                .container {
                    max-width: 100%;
                    margin: 0 auto;
                    background: white;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                
                .header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 20px;
                    text-align: center;
                }
                
                .header h1 {
                    font-size: 1.8rem;
                    margin-bottom: 5px;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
                }
                
                .header p {
                    font-size: 0.9rem;
                    opacity: 0.9;
                }
                
                .summary-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 10px;
                    padding: 15px;
                    background: #f8f9fa;
                }
                
                .summary-card {
                    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                    border: 1px solid #dee2e6;
                    border-radius: 8px;
                    padding: 10px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    box-shadow: 0 1px 5px rgba(0,0,0,0.1);
                }
                
                .summary-icon {
                    font-size: 1.2rem;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: white;
                    border-radius: 50%;
                    box-shadow: 0 1px 5px rgba(0,0,0,0.1);
                }
                
                .summary-value {
                    font-size: 1rem;
                    font-weight: bold;
                    color: #2c3e50;
                    margin-bottom: 2px;
                }
                
                .summary-label {
                    font-size: 0.7rem;
                    color: #6c757d;
                    text-transform: uppercase;
                    letter-spacing: 0.3px;
                }
                
                .components-table {
                    background: white;
                    border-radius: 6px;
                    overflow: hidden;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    border: 1px solid #e9ecef;
                    margin: 15px;
                }
                
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                
                th {
                    background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
                    color: white;
                    padding: 8px 6px;
                    text-align: left;
                    font-weight: 600;
                    text-transform: uppercase;
                    font-size: 0.7rem;
                    letter-spacing: 0.3px;
                }
                
                td {
                    padding: 6px 4px;
                    border-bottom: 1px solid #f1f3f4;
                    vertical-align: middle;
                    font-size: 0.8rem;
                }
                
                .purchased-row {
                    background: #d4edda;
                }
                
                .category-badge {
                    display: inline-block;
                    padding: 3px 6px;
                    border-radius: 10px;
                    font-size: 0.6rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    color: white;
                    letter-spacing: 0.3px;
                }
                
                .category-badge.cpu { background: linear-gradient(135deg, #e74c3c, #c0392b); }
                .category-badge.gpu { background: linear-gradient(135deg, #3498db, #2980b9); }
                .category-badge.ram { background: linear-gradient(135deg, #9b59b6, #8e44ad); }
                .category-badge.motherboard { background: linear-gradient(135deg, #f39c12, #e67e22); }
                .category-badge.storage { background: linear-gradient(135deg, #27ae60, #229954); }
                .category-badge.psu { background: linear-gradient(135deg, #e67e22, #d35400); }
                .category-badge.case { background: linear-gradient(135deg, #34495e, #2c3e50); }
                .category-badge.cooler { background: linear-gradient(135deg, #1abc9c, #16a085); }
                .category-badge.other { background: linear-gradient(135deg, #95a5a6, #7f8c8d); }
                
                .price-amount {
                    font-weight: bold;
                    font-size: 0.9rem;
                    color: #27ae60;
                }
                
                .status-badge {
                    display: inline-block;
                    padding: 3px 6px;
                    border-radius: 10px;
                    font-size: 0.7rem;
                    font-weight: 600;
                    letter-spacing: 0.2px;
                }
                
                .status-badge.purchased {
                    background: linear-gradient(135deg, #d4edda, #c3e6cb);
                    color: #155724;
                    border: 1px solid #c3e6cb;
                }
                
                .status-badge.pending {
                    background: linear-gradient(135deg, #fff3cd, #ffeaa7);
                    color: #856404;
                    border: 1px solid #ffeaa7;
                }
                
                .no-link {
                    color: #6c757d;
                    font-style: italic;
                }
                
                .footer {
                    text-align: center;
                    padding: 30px;
                    color: #6c757d;
                    font-size: 1rem;
                }
                
                @media print {
                    body { 
                        background: white; 
                        padding: 0; 
                        font-size: 10px;
                    }
                    .container { 
                        box-shadow: none; 
                        max-width: 100%;
                        margin: 0;
                    }
                    .header {
                        padding: 10px;
                    }
                    .header h1 {
                        font-size: 1.4rem;
                    }
                    .summary-grid {
                        padding: 10px;
                        gap: 5px;
                    }
                    .summary-card {
                        padding: 5px;
                    }
                    .components-table {
                        margin: 10px;
                    }
                    th {
                        padding: 4px 3px;
                        font-size: 0.6rem;
                    }
                    td {
                        padding: 3px 2px;
                        font-size: 0.7rem;
                    }
                    .category-badge {
                        padding: 2px 4px;
                        font-size: 0.5rem;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>${buildName}</h1>
                    <p>PC Build Plan - ${new Date().toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}</p>
                </div>
                
                <div class="summary-grid">
                    <div class="summary-card">
                        <div class="summary-icon">📦</div>
                        <div class="summary-info">
                            <div class="summary-value">${parts.length}</div>
                            <div class="summary-label">Components</div>
                        </div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-icon">💰</div>
                        <div class="summary-info">
                            <div class="summary-value">${formatCurrency(totalPrice)}</div>
                            <div class="summary-label">Total Cost</div>
                        </div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-icon">✅</div>
                        <div class="summary-info">
                            <div class="summary-value">${purchasedCount}/${parts.length}</div>
                            <div class="summary-label">Purchased</div>
                        </div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-icon">💳</div>
                        <div class="summary-info">
                            <div class="summary-value">${formatCurrency(totalPrice - purchasedTotal)}</div>
                            <div class="summary-label">Remaining</div>
                        </div>
                    </div>
                </div>
                
                <div class="components-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Component</th>
                                <th>Website</th>
                                <th>Price</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${pdfTableRows}
                        </tbody>
                    </table>
                </div>
                
                <div class="footer">
                    🖥️ Generated by PC Build Planner
                </div>
            </div>
        </body>
        </html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
    
    showNotification('PDF export with import code initiated', 'success');
}

function exportToPNG() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    const parts = getCurrentBuildParts();
    let totalPrice = 0;
    let purchasedCount = 0;
    let purchasedTotal = 0;
    
    // Calculate totals
    parts.forEach(part => {
        const partRow = Array.from(document.querySelectorAll('.part-row')).find(row => 
            row.querySelector('.component-input input').value === part.name
        );
        const isPurchased = partRow ? partRow.querySelector('.purchased-checkbox input').checked : false;
        
        totalPrice += part.price;
        if (isPurchased) {
            purchasedCount++;
            purchasedTotal += part.price;
        }
    });
    
    // Set canvas size based on content
    const rowHeight = 35;
    const headerHeight = 120;
    const summaryHeight = 80;
    const footerHeight = 60;
    const padding = 40;
    
    canvas.width = 1000;
    canvas.height = headerHeight + summaryHeight + (parts.length * rowHeight) + footerHeight + (padding * 2);
    
    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // White content area
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(padding, padding, canvas.width - (padding * 2), canvas.height - (padding * 2));
    
    let currentY = padding + 30;
    
    // Header
    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(builds[currentBuildIndex].name, canvas.width / 2, currentY);
    
    currentY += 30;
    ctx.font = '16px Arial';
    ctx.fillStyle = '#6c757d';
    ctx.fillText(`PC Build Plan - ${new Date().toLocaleDateString()}`, canvas.width / 2, currentY);
    
    currentY += 50;
    
    // Summary cards
    const cardWidth = 200;
    const cardSpacing = 20;
    const totalCardsWidth = (cardWidth * 4) + (cardSpacing * 3);
    const startX = (canvas.width - totalCardsWidth) / 2;
    
    const summaryData = [
        { label: 'Components', value: parts.length.toString() },
        { label: 'Total Cost', value: formatCurrency(totalPrice) },
        { label: 'Purchased', value: `${purchasedCount}/${parts.length}` },
        { label: 'Remaining', value: formatCurrency(totalPrice - purchasedTotal) }
    ];
    
    summaryData.forEach((item, index) => {
        const x = startX + (index * (cardWidth + cardSpacing));
        
        // Card background
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(x, currentY, cardWidth, 60);
        
        // Card border
        ctx.strokeStyle = '#e9ecef';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, currentY, cardWidth, 60);
        
        // Label
        ctx.fillStyle = '#6c757d';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(item.label, x + cardWidth/2, currentY + 20);
        
        // Value
        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 18px Arial';
        ctx.fillText(item.value, x + cardWidth/2, currentY + 45);
    });
    
    currentY += 100;
    
    // Table header
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(padding + 20, currentY, canvas.width - (padding * 2) - 40, 35);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';
    
    const colWidths = [120, 300, 200, 100, 120];
    let colX = padding + 30;
    
    ['Category', 'Component', 'Website', 'Price', 'Status'].forEach((header, index) => {
        ctx.fillText(header, colX, currentY + 22);
        colX += colWidths[index];
    });
    
    currentY += 35;
    
    // Table rows
    parts.forEach((part, index) => {
        const partRow = Array.from(document.querySelectorAll('.part-row')).find(row => 
            row.querySelector('.component-input input').value === part.name
        );
        
        const isPurchased = partRow ? partRow.querySelector('.purchased-checkbox input').checked : false;
        const link = partRow ? partRow.querySelector('.link-input input').value : '';
        const websiteName = link ? new URL(link).hostname.replace('www.', '') : 'N/A';
        
        // Row background
        ctx.fillStyle = isPurchased ? '#d4edda' : (index % 2 === 0 ? '#f8f9fa' : '#ffffff');
        ctx.fillRect(padding + 20, currentY, canvas.width - (padding * 2) - 40, rowHeight);
        
        // Row border
        ctx.strokeStyle = '#e9ecef';
        ctx.lineWidth = 1;
        ctx.strokeRect(padding + 20, currentY, canvas.width - (padding * 2) - 40, rowHeight);
        
        // Row content
        ctx.fillStyle = '#2c3e50';
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        
        colX = padding + 30;
        const rowData = [
            part.category,
            part.name.length > 35 ? part.name.substring(0, 32) + '...' : part.name,
            websiteName.length > 25 ? websiteName.substring(0, 22) + '...' : websiteName,
            formatCurrency(part.price),
            isPurchased ? '✅ Purchased' : '❌ Pending'
        ];
        
        rowData.forEach((data, colIndex) => {
            if (colIndex === 3) { // Price column
                ctx.fillStyle = '#27ae60';
                ctx.font = 'bold 12px Arial';
            } else if (colIndex === 4) { // Status column
                ctx.fillStyle = isPurchased ? '#155724' : '#856404';
                ctx.font = 'bold 11px Arial';
            } else {
                ctx.fillStyle = '#2c3e50';
                ctx.font = '12px Arial';
            }
            
            ctx.fillText(data, colX, currentY + 22);
            colX += colWidths[colIndex];
        });
        
        currentY += rowHeight;
    });
    
    // Footer
    currentY += 30;
    ctx.fillStyle = '#6c757d';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🖥️ Generated by PC Build Planner', canvas.width / 2, currentY);
    
    // Add import code section
    currentY += 40;
    ctx.fillStyle = '#495057';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('📋 Import This Build', canvas.width / 2, currentY);
    
    currentY += 25;
    ctx.fillStyle = '#6c757d';
    ctx.font = '12px Arial';
    ctx.fillText('Use this code to import this build back into PC Build Planner:', canvas.width / 2, currentY);
    
    // Create exportable build data for PNG
    const exportData = {
        buildName: builds[currentBuildIndex].name,
        parts: parts.map(part => {
            const partRow = Array.from(document.querySelectorAll('.part-row')).find(row => 
                row.querySelector('.component-input input').value === part.name
            );
            const isPurchased = partRow ? partRow.querySelector('.purchased-checkbox input').checked : false;
            const link = partRow ? partRow.querySelector('.link-input input').value : '';
            const noteElement = partRow ? partRow.querySelector('.component-note') : null;
            const note = noteElement ? noteElement.textContent.replace('📝 ', '') : '';
            
            return {
                category: part.category,
                name: part.name,
                price: part.price,
                link: link,
                purchased: isPurchased,
                note: note
            };
        }),
        exportDate: new Date().toISOString(),
        currency: currency
    };
    
    const encodedData = btoa(JSON.stringify(exportData));
    const importCode = `PCBUILD:${encodedData}`;
    
    // Draw import code box
    currentY += 20;
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(padding + 40, currentY, canvas.width - (padding * 2) - 80, 60);
    ctx.strokeStyle = '#dee2e6';
    ctx.lineWidth = 2;
    ctx.strokeRect(padding + 40, currentY, canvas.width - (padding * 2) - 80, 60);
    
    // Split the code into multiple lines if too long
    ctx.fillStyle = '#2c3e50';
    ctx.font = '10px monospace';
    ctx.textAlign = 'left';
    
    const maxWidth = canvas.width - (padding * 2) - 100;
    const words = importCode.match(/.{1,80}/g) || [importCode];
    
    words.forEach((line, index) => {
        ctx.fillText(line, padding + 50, currentY + 20 + (index * 12));
    });
    
    // Download
    const link = document.createElement('a');
    link.download = `${builds[currentBuildIndex].name.replace(/[^a-z0-9]/gi, '_')}_build_plan.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
    
    showNotification('PNG export completed', 'success');
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : 'info'}"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function duplicatePart(id) {
    const originalRow = document.getElementById(`part-${id}`);
    const category = originalRow.querySelector('.category-select').value;
    const name = originalRow.querySelector('.component-input input').value;
    const link = originalRow.querySelector('.link-input input').value;
    const price = originalRow.querySelector('.price-input input').value;
    
    addPartFromData({ category, name, link, price: parseFloat(price) || 0 });
    updateTotal();
    updateComponentCount();
    saveCurrentBuild();
}

function removePart(id) {
    const partRow = document.getElementById(`part-${id}`);
    partRow.remove();
    updateTotal();
    updateComponentCount();
    saveCurrentBuild();
    toggleEmptyState();
}

function toggleEmptyState() {
    const container = document.getElementById('parts-container');
    const emptyState = document.getElementById('empty-state');
    emptyState.style.display = container.children.length === 0 ? 'block' : 'none';
}

// Add alternative option for a component
function addOption(parentId) {
    const parentRow = document.getElementById(`part-${parentId}`);
    const parentCategory = parentRow.querySelector('.category-select').value;
    
    if (!parentCategory) {
        showNotification('Please select a category first', 'error');
        return;
    }
    
    partCount++;
    const container = document.getElementById('parts-container');
    
    const optionRow = document.createElement('div');
    optionRow.className = 'part-row option-row';
    optionRow.id = `part-${partCount}`;
    optionRow.draggable = true;
    optionRow.dataset.partId = partCount;
    optionRow.dataset.parentId = parentId;
    optionRow.dataset.category = parentCategory;
    
    optionRow.innerHTML = createPartRowHTML(partCount, { category: parentCategory });
    
    // Insert after parent or after last option of same parent
    let insertAfter = parentRow;
    let nextSibling = parentRow.nextElementSibling;
    while (nextSibling && nextSibling.dataset.parentId === parentId.toString()) {
        insertAfter = nextSibling;
        nextSibling = nextSibling.nextElementSibling;
    }
    
    insertAfter.insertAdjacentElement('afterend', optionRow);
    
    // Add option indicator
    optionRow.classList.add('grouped-option');
    optionRow.insertAdjacentHTML('afterbegin', '<div class="option-indicator"><i class="fas fa-arrow-turn-down"></i> Option</div>');
    
    setupPartRowEvents(optionRow);
    updateTotal();
    updateComponentCount();
    saveCurrentBuild();
}

// Drag and drop functionality
function setupDragAndDrop() {
    const container = document.getElementById('parts-container');
    let draggedElement = null;
    let draggedGroup = [];
    
    container.addEventListener('dragstart', function(e) {
        if (!e.target.classList.contains('part-row')) return;
        
        draggedElement = e.target;
        draggedGroup = getComponentGroup(draggedElement);
        
        // Visual feedback
        draggedGroup.forEach(row => row.classList.add('dragging'));
        e.dataTransfer.effectAllowed = 'move';
    });
    
    container.addEventListener('dragend', function(e) {
        if (draggedGroup.length > 0) {
            draggedGroup.forEach(row => row.classList.remove('dragging'));
        }
        draggedElement = null;
        draggedGroup = [];
    });
    
    container.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        
        // Remove existing drop indicators
        document.querySelectorAll('.drop-indicator').forEach(indicator => {
            indicator.remove();
        });
        
        // Only show drop indicator, don't move the actual element
        const afterElement = getDragAfterElement(container, e.clientY);
        const dropIndicator = document.createElement('div');
        dropIndicator.className = 'drop-indicator';
        dropIndicator.style.cssText = `
            height: 3px;
            background: #667eea;
            margin: 5px 0;
            border-radius: 2px;
            opacity: 0.8;
            transition: all 0.2s ease;
        `;
        
        if (afterElement == null) {
            container.appendChild(dropIndicator);
        } else {
            container.insertBefore(dropIndicator, afterElement);
        }
    });
    
    container.addEventListener('drop', function(e) {
        e.preventDefault();
        
        // Remove all drop indicators
        document.querySelectorAll('.drop-indicator').forEach(indicator => {
            indicator.remove();
        });
        
        // Find the drop position
        const afterElement = getDragAfterElement(container, e.clientY);
        
        // Move the dragged element to the new position
        if (afterElement == null) {
            container.appendChild(draggedElement);
        } else {
            container.insertBefore(draggedElement, afterElement);
        }
        
        // Move entire group if applicable
        if (draggedGroup.length > 1) {
            const targetPosition = Array.from(container.children).indexOf(draggedElement);
            draggedGroup.forEach((row, index) => {
                if (row !== draggedElement) {
                    const newPosition = targetPosition + index + 1;
                    if (newPosition < container.children.length) {
                        container.insertBefore(row, container.children[newPosition]);
                    } else {
                        container.appendChild(row);
                    }
                }
            });
        }
        
        saveCurrentBuild();
        showNotification('Components reordered', 'success');
    });
    
    container.addEventListener('dragleave', function(e) {
        // Only remove indicators if we're leaving the container entirely
        if (!container.contains(e.relatedTarget)) {
            document.querySelectorAll('.drop-indicator').forEach(indicator => {
                indicator.remove();
            });
        }
    });
}

// Get component group (parent + all its options)
function getComponentGroup(element) {
    const group = [element];
    const parentId = element.dataset.parentId;
    const elementId = element.dataset.partId;
    
    // If this is a parent, get all its options
    if (!parentId) {
        const allRows = document.querySelectorAll('.part-row');
        allRows.forEach(row => {
            if (row.dataset.parentId === elementId) {
                group.push(row);
            }
        });
    } else {
        // If this is an option, get parent and all sibling options
        const parent = document.querySelector(`[data-part-id="${parentId}"]`);
        if (parent && !group.includes(parent)) {
            group.unshift(parent);
        }
        
        const allRows = document.querySelectorAll('.part-row');
        allRows.forEach(row => {
            if (row.dataset.parentId === parentId && row !== element) {
                group.push(row);
            }
        });
    }
    
    return group;
}

// Helper function for drag positioning
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.part-row:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Calculations and updates
function updateTotal() {
    const priceInputs = document.querySelectorAll('.col-price input[type="number"]');
    let total = 0;
    
    priceInputs.forEach(input => {
        const value = parseFloat(input.value) || 0;
        total += value;
    });
    
    const formattedTotal = formatCurrency(total);
    document.getElementById('total-price').textContent = formattedTotal;
    document.getElementById('total-display').textContent = formattedTotal;
    
    updateBuildProgress();
}

function updateComponentCount() {
    const count = document.getElementById('parts-container').children.length;
    document.getElementById('component-count').textContent = count;
}

function updateBuildProgress() {
    const essentialCategories = ['CPU', 'GPU', 'RAM', 'Motherboard', 'Storage', 'PSU', 'Case', 'Cooler'];
    const presentCategories = new Set();
    
    document.querySelectorAll('.part-row').forEach(row => {
        const categorySelect = row.querySelector('.category-select');
        const componentInput = row.querySelector('.component-input input');
        
        // Kategori seçili ve component adı dolu olmalı
        if (categorySelect && componentInput && 
            categorySelect.value && 
            componentInput.value.trim() && 
            essentialCategories.includes(categorySelect.value)) {
            presentCategories.add(categorySelect.value);
        }
    });
    
    const progress = (presentCategories.size / essentialCategories.length) * 100;
    const progressBar = document.getElementById('build-progress');
    const progressText = document.getElementById('progress-text');
    
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${Math.round(progress)}% Complete`;
    
    if (progress === 100) {
        progressBar.style.background = 'linear-gradient(90deg, #28a745, #20c997)';
    } else {
        progressBar.style.background = 'linear-gradient(90deg, #667eea, #764ba2)';
    }
}

// Currency and budget functions
function changeCurrency(newCurrency) {
    const oldRate = currencyRates[currency];
    const newRate = currencyRates[newCurrency];
    
    // Convert all prices
    document.querySelectorAll('.price-input input').forEach(input => {
        if (input.value) {
            const oldPrice = parseFloat(input.value);
            const newPrice = (oldPrice / oldRate) * newRate;
            input.value = newPrice.toFixed(2);
        }
    });
    
    // Convert budget limit
    if (budgetLimit > 0) {
        budgetLimit = (budgetLimit / oldRate) * newRate;
        document.getElementById('budget-input').value = budgetLimit.toFixed(2);
    }
    
    currency = newCurrency;
    updateCurrencyDisplay();
    updateTotal();
    saveToStorage();
}

function updateCurrencyDisplay() {
    document.querySelectorAll('.currency').forEach(span => {
        span.textContent = currencySymbols[currency];
    });
    
    document.getElementById('currency-selector').value = currency;
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2
    }).format(amount).replace(/[A-Z]{3}/, currencySymbols[currency]);
}

function setBudget() {
    const input = document.getElementById('budget-input');
    budgetLimit = parseFloat(input.value) || 0;
    checkBudgetAlert();
    saveToStorage();
}

function checkBudgetAlert() {
    if (budgetLimit <= 0) return;
    
    const currentTotal = Array.from(document.querySelectorAll('.col-price input[type="number"]'))
        .reduce((sum, input) => sum + (parseFloat(input.value) || 0), 0);
    
    const alertElement = document.getElementById('budget-alert');
    const percentage = (currentTotal / budgetLimit) * 100;
    
    if (percentage > 100) {
        alertElement.style.display = 'block';
        alertElement.className = 'budget-alert over-budget';
        alertElement.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Over budget by ${formatCurrency(currentTotal - budgetLimit)}`;
    } else if (percentage > 90) {
        alertElement.style.display = 'block';
        alertElement.className = 'budget-alert near-budget';
        alertElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${formatCurrency(budgetLimit - currentTotal)} remaining`;
    } else {
        alertElement.style.display = 'none';
    }
}

// Import/Export functions
function exportBuild() {
    const data = {
        builds: builds,
        currency: currency,
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pc-builds-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function importBuild() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);
                    if (data.builds && Array.isArray(data.builds)) {
                        builds = data.builds;
                        currency = data.currency || 'USD';
                        currentBuildIndex = 0;
                        loadCurrentBuild();
                        updateBuildSelector();
                        updateCurrencyDisplay();
                        saveToStorage();
                        showNotification('Builds imported successfully!', 'success');
                    } else {
                        showNotification('Invalid file format.', 'error');
                    }
                } catch (error) {
                    showNotification('Error reading file.', 'error');
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

// JSON Export Functions
function showJsonExportModal() {
    const modal = document.getElementById('json-export-modal');
    const parts = getCurrentBuildParts();
    
    // Create exportable build data
    const exportData = {
        buildName: builds[currentBuildIndex].name,
        parts: parts.map(part => {
            const partRow = Array.from(document.querySelectorAll('.part-row')).find(row => 
                row.querySelector('.component-input input').value === part.name
            );
            const isPurchased = partRow ? partRow.querySelector('.purchased-checkbox input').checked : false;
            const link = partRow ? partRow.querySelector('.link-input input').value : '';
            const noteElement = partRow ? partRow.querySelector('.component-note') : null;
            const note = noteElement ? noteElement.textContent.replace('📝 ', '') : '';
            
            return {
                category: part.category,
                name: part.name,
                price: part.price,
                link: link,
                purchased: isPurchased,
                note: note
            };
        }),
        exportDate: new Date().toISOString(),
        currency: currency,
        version: '1.0'
    };
    
    const jsonCode = JSON.stringify(exportData, null, 2);
    document.getElementById('json-export-code').value = jsonCode;
    modal.style.display = 'block';
}

function closeJsonExportModal() {
    document.getElementById('json-export-modal').style.display = 'none';
}

function copyJsonCode() {
    const codeTextarea = document.getElementById('json-export-code');
    codeTextarea.select();
    codeTextarea.setSelectionRange(0, 99999); // For mobile devices
    
    try {
        document.execCommand('copy');
        showNotification('JSON code copied to clipboard!', 'success');
    } catch (err) {
        showNotification('Could not copy code. Please select and copy manually.', 'error');
    }
}

// JSON Import Functions
function showImportJsonModal() {
    const modal = document.getElementById('json-import-modal');
    modal.style.display = 'block';
}

function closeJsonImportModal() {
    document.getElementById('json-import-modal').style.display = 'none';
    document.getElementById('json-import-code').value = '';
}

function importFromJson() {
    const codeInput = document.getElementById('json-import-code');
    const code = codeInput.value.trim();
    
    if (!code) {
        showNotification('Please paste the JSON code first.', 'error');
        return;
    }
    
    try {
        const buildData = JSON.parse(code);
        
        // Validate build data
        if (!buildData.buildName || !buildData.parts || !Array.isArray(buildData.parts)) {
            throw new Error('Invalid build data structure');
        }
        
        // Create new build from imported data
        const newBuild = {
            name: buildData.buildName + ' (Imported)',
            parts: buildData.parts
        };
        
        builds.push(newBuild);
        currentBuildIndex = builds.length - 1;
        
        // Set currency if different
        if (buildData.currency && buildData.currency !== currency) {
            currency = buildData.currency;
            updateCurrencyDisplay();
        }
        
        loadCurrentBuild();
        updateBuildSelector();
        saveToStorage();
        closeJsonImportModal();
        
        showNotification(`Build "${buildData.buildName}" imported successfully!`, 'success');
        
    } catch (error) {
        console.error('JSON Import error:', error);
        showNotification('Invalid JSON code. Please check the format and try again.', 'error');
    }
}

// Utility functions
function openLink(button) {
    const linkInput = button.parentElement.querySelector('input[type="url"]');
    const url = linkInput.value.trim();
    if (url) {
        window.open(url, '_blank');
    }
}

function setupEventListeners() {
    // Theme toggle
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    
    // Build selector
    document.getElementById('build-selector').addEventListener('change', function() {
        switchBuild(parseInt(this.value));
    });
    
    // Currency selector
    document.getElementById('currency-selector').addEventListener('change', function() {
        changeCurrency(this.value);
    });
    
    // Budget input
    document.getElementById('budget-input').addEventListener('change', setBudget);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'n':
                    e.preventDefault();
                    addPart();
                    break;
                case 's':
                    e.preventDefault();
                    saveCurrentBuild();
                    break;
                case 'e':
                    e.preventDefault();
                    exportBuild();
                    break;
            }
        }
    });
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('darkTheme', isDark);
    
    const icon = document.querySelector('#theme-toggle i');
    icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
}

// Load theme preference
function loadTheme() {
    const isDark = localStorage.getItem('darkTheme') === 'true';
    if (isDark) {
        document.body.classList.add('dark-theme');
        document.querySelector('#theme-toggle i').className = 'fas fa-sun';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('PC Build Planner loaded successfully!');
    
    // Test button functionality and fix onclick issues
    setTimeout(() => {
        console.log('=== BUTTON DEBUG START ===');
        
        // Test if functions exist
        console.log('addPart function exists:', typeof addPart);
        console.log('createNewBuild function exists:', typeof createNewBuild);
        console.log('showTemplateModal function exists:', typeof showTemplateModal);
        
        const addBtn = document.querySelector('.add-part-btn');
        const addFirstBtn = document.querySelector('.add-first-btn');
        console.log('Add Part Button found:', addBtn);
        console.log('Add First Button found:', addFirstBtn);
        
        // Replace onclick with addEventListener for all buttons
        const allButtons = document.querySelectorAll('button[onclick]');
        console.log('Buttons with onclick found:', allButtons.length);
        
        allButtons.forEach((btn, index) => {
            const onclickAttr = btn.getAttribute('onclick');
            console.log(`Button ${index}: ${btn.className} - onclick: ${onclickAttr}`);
            
            // Remove onclick and add event listener
            btn.removeAttribute('onclick');
            
            // Add proper event listener based on onclick content
            if (onclickAttr.includes('addPart()')) {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    console.log('Calling addPart()');
                    addPart();
                });
            } else if (onclickAttr.includes('createNewBuild()')) {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    console.log('Calling createNewBuild()');
                    createNewBuild();
                });
            } else if (onclickAttr.includes('showTemplateModal()')) {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    console.log('Calling showTemplateModal()');
                    showTemplateModal();
                });
            } else if (onclickAttr.includes('deleteBuild()')) {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    console.log('Calling deleteBuild()');
                    deleteBuild();
                });
            } else if (onclickAttr.includes('exportBuild()')) {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    console.log('Calling exportBuild()');
                    exportBuild();
                });
            } else if (onclickAttr.includes('importBuild()')) {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    console.log('Calling importBuild()');
                    importBuild();
                });
            } else if (onclickAttr.includes('setBudget()')) {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    console.log('Calling setBudget()');
                    setBudget();
                });
            } else if (onclickAttr.includes('validateBuild()')) {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    console.log('Calling validateBuild()');
                    validateBuild();
                });
            } else if (onclickAttr.includes('showComparisonModal()')) {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    console.log('Calling showComparisonModal()');
                    showComparisonModal();
                });
            } else if (onclickAttr.includes('showExportModal()')) {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    console.log('Calling showExportModal()');
                    showExportModal();
                });
            } else {
                // For other functions, try to execute them
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    console.log('Executing:', onclickAttr);
                    try {
                        eval(onclickAttr);
                    } catch (error) {
                        console.error('Error executing:', onclickAttr, error);
                    }
                });
            }
        });
        
        console.log('=== BUTTON DEBUG END ===');
    }, 1000);
    
    loadTheme();
    init();
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        const modals = ['template-modal', 'comparison-modal', 'price-history-modal', 'export-modal', 'json-export-modal', 'json-import-modal'];
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
});

// Auto-save every 30 seconds
setInterval(saveCurrentBuild, 30000);