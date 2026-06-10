export const level3ShopLayout = {
    1: {
        sprite: "./assets/sprites/shopItems/apple.png",
        posX: 180,
        posY: 290,
        scale: 1.0
    },
    2: {
        sprite: "./assets/sprites/shopItems/banana.png",
        posX: 243,
        posY: 290,
        scale: 1.0
    },
    3: {
        sprite: "./assets/sprites/shopItems/carrot.png",
        posX: 306,
        posY: 290,
        scale: 1.0
    },
    4: {
        sprite: "./assets/sprites/shopItems/tomato.png",
        posX: 369,
        posY: 290,
        scale: 1.0
    },
    5: {
        sprite: "./assets/sprites/shopItems/cucumber.png",
        posX: 432,
        posY: 290,
        scale: 1.0
    },
    6: {
        sprite: "./assets/sprites/shopItems/potato.png",
        posX: 495,
        posY: 290,
        scale: 1.0
    },
    7: {
        sprite: "./assets/sprites/shopItems/rubin.png",
        posX: 600,
        posY: 298,
        scale: 1.25
    },
    8: {
        sprite: "./assets/sprites/shopItems/blueprint.png",
        posX: 645,
        posY: 298,
        scale: 1.2,
        keyItem: {
            label: "QUERY BLUEPRINT",
            price: "25$",
            action: "showQueryBlueprintPopup"
        },
        tooltipX: 485,
        tooltipY: 260
    },
    9: {
        sprite: "./assets/sprites/shopItems/protein_shake.png",
        posX: 55,
        posY: 225,
        scale: 1.6
    },
    10: {
        sprite: "./assets/sprites/shopItems/creatine.png",
        posX: 622,
        posY: 155,
        scale: 1.6
    },
    11: {
        sprite: "./assets/sprites/shopItems/lift_belt.png",
        posX: 624,
        posY: 235,
        scale: 1.5
    },
    12: {
        sprite: "./assets/sprites/shopItems/hint.png",
        posX: 32,
        posY: 292,
        scale: 1.3,
        keyItem: {
            label: "SHOPKEEPER HINT",
            price: "10$",
            action: "showShopkeeperHintPopup"
        },
        tooltipX: 95,
        tooltipY: 260
    }
};
