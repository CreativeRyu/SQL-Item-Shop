export const level3ShopLayout = {
    1: {
        sprite: "./assets/sprites/shopItems/apple.png",
        posX: 175,
        posY: 290,
        scale: 1.0
    },
    2: {
        sprite: "./assets/sprites/shopItems/banana.png",
        posX: 230,
        posY: 290,
        scale: 1.0
    },
    3: {
        sprite: "./assets/sprites/shopItems/carrot.png",
        posX: 285,
        posY: 290,
        scale: 1.0
    },
    4: {
        sprite: "./assets/sprites/shopItems/tomato.png",
        posX: 340,
        posY: 290,
        scale: 1.0
    },
    5: {
        sprite: "./assets/sprites/shopItems/cucumber.png",
        posX: 395,
        posY: 290,
        scale: 1.0
    },
    6: {
        sprite: "./assets/sprites/shopItems/potato.png",
        posX: 450,
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
        posX: 32,
        posY: 225,
        scale: 1.6
    },
    13: {
        sprite: "./assets/sprites/shopItems/protein_bar.png",
        posX: 505,

        posY: 296,
        scale: 1.5
    },
    14: {
        sprite: "./assets/sprites/shopItems/protein_cookies.png",
        posX: 80,
        posY: 291,
        scale: 1.3
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
