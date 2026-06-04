const shopItems = document.getElementById("shop-items");
const tooltip = document.getElementById("shop-tooltip");

export function renderShopVisuals(db, shopLayout, buyNotebook) {
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

        const isNotebook = name === "SQL Notebook";

        const html = `
        <div class="item-stack ${isNotebook ? "shop-key-item" : ""}"
            style="
            left:${posX}px;
            top:${posY}px;">

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

        shopItems.innerHTML += html;

        if(isNotebook) {
            const notebook = shopItems.lastElementChild;

            notebook.addEventListener("mouseenter", () => {
                tooltip.style.display = "block";
                tooltip.style.left = "170px";
                tooltip.style.top = "265px";

                tooltip.innerHTML = `
                    SQL NOTEBOOK<br>
                    30$<br>
                    Kaufen ?`;
            });

            notebook.addEventListener("mouseleave", () => {
                tooltip.style.display = "none";
            });

            notebook.addEventListener("click", () => {
                buyNotebook();
            });
        }
    });
}

export function hideTooltip() {
    tooltip.style.display = "none";
}
