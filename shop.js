const shopItems = document.getElementById("shop-items");
const tooltip = document.getElementById("shop-tooltip");

export function renderShopVisuals(db, buyNotebook) {
    const result = db.exec(`SELECT
        products.name,
        products.sprite,
        products.pos_x,
        products.pos_y,
        products.scale,
        inventory.stock
    FROM inventory
    JOIN products
    ON inventory.product_id = products.id`);

    const rows = result[0].values;
    shopItems.innerHTML = "";

    rows.forEach(row => {
        const name = row[0];
        const sprite = row[1];
        const posX = row[2];
        const posY = row[3];
        const scale = row[4];
        const stock = row[5];

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