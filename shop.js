const shopItems = document.getElementById("shop-items");
const tooltip = document.getElementById("shop-tooltip");

export function renderShopVisuals(db, shopLayout, buyNotebook, keyItemActions = {}) {
    const keyItems = {
        "SQL Notebook": {
            label: "SQL NOTEBOOK",
            price: "30$",
            action: "buyNotebook",
            tooltipX: 170,
            tooltipY: 265
        },
        "Shopkeeper Hint": {
            label: "SHOPKEEPER HINT",
            price: "10$"
        },
        "Query Blueprint": {
            label: "QUERY BLUEPRINT",
            price: "25$"
        }
    };

    const result = db.exec(`SELECT
        products.id,
        products.name,
        inventory.stock
    FROM inventory
    JOIN products
    ON inventory.product_id = products.id`);

    const rows = result[0]?.values || [];
    shopItems.innerHTML = "";

    rows.forEach(row => {
        const productId = row[0];
        const name = row[1];
        const stock = row[2];
        const visual = shopLayout[productId];

        if(!visual)
            return;

        const sprite = visual.sprite;
        const posX = visual.posX;
        const posY = visual.posY;
        const scale = visual.scale;

        const keyItem = visual.keyItem || keyItems[name];
        const tooltipX = visual.tooltipX ?? keyItem?.tooltipX ?? posX - 16;
        const tooltipY = visual.tooltipY ?? keyItem?.tooltipY ?? posY - 58;

        const zIndex = keyItem
            ? "z-index:25;"
            : "";
        const keyItemAttributes = keyItem
            ? `
                data-key-item="true"
                data-tooltip-label="${escapeAttribute(keyItem.label)}"
                data-tooltip-price="${escapeAttribute(keyItem.price)}"
                data-tooltip-x="${tooltipX}"
                data-tooltip-y="${tooltipY}"
                data-action="${keyItem.action || ""}"`
            : "";

        const html = `
        <div class="item-stack ${keyItem ? "shop-key-item" : ""}"
            ${keyItemAttributes}
            style="
            left:${posX}px;
            top:${posY}px;
            ${zIndex}">

            <div class="shop-item-wrapper"
                style="transform: scale(${scale});">

                <img class="shop-item" src="${sprite}">
            </div>

            <div class="item-count"
                style="
                right:${-7 * scale}px;
                bottom:${-8 * scale}px;">

                ${stock}
            </div>
        </div>`;

        shopItems.insertAdjacentHTML("beforeend", html);
    });

    shopItems.onpointerover = event => {
        const item = event.target.closest(".shop-key-item");
        if(!item || !shopItems.contains(item))
            return;
        if(item.contains(event.relatedTarget))
            return;

        tooltip.style.display = "block";
        tooltip.style.left = `${item.dataset.tooltipX}px`;
        tooltip.style.top = `${item.dataset.tooltipY}px`;
        tooltip.innerHTML = `
            ${item.dataset.tooltipLabel}<br>
            ${item.dataset.tooltipPrice}<br>
            Kaufen ?`;
    };

    shopItems.onpointerout = event => {
        const item = event.target.closest(".shop-key-item");
        if(!item || !shopItems.contains(item))
            return;
        if(item.contains(event.relatedTarget))
            return;

        tooltip.style.display = "none";
    };

    shopItems.onclick = event => {
        const item = event.target.closest(".shop-key-item");
        if(!item || !shopItems.contains(item))
            return;

        if(item.dataset.action === "buyNotebook") {
            buyNotebook();
            return;
        }

        keyItemActions[item.dataset.action]?.();
    };
}

export function hideTooltip() {
    tooltip.style.display = "none";
}

function escapeAttribute(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll('"', "&quot;")
        .replaceAll("<", "&lt;");
}
