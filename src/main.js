class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene'    });
    }

    preload() {
        // Загрузка ресурсов
        this.load.image('ground', 'assets/medievalTile_002.png');

        // Две машинки (замените пути к своим файлам)
        this.load.image('car1', 'assets/car1.png');
        this.load.image('car2', 'assets/car2.png');

        // Загрузка фона
        this.load.image('background', 'assets/trainroad.png');
    }

    create() {
        // Фоновое изображение (тайлспрайт для вертикальной прокрутки)
        this.background = this.add.tileSprite(400, 300, this.sys.game.config.width, this.sys.game.config.height, 'background');
        this.background.setOrigin(0.5, 0.5);

        // Создаем землю
        const platforms = this.physics.add.staticGroup();
        const tileWidth = 70;
        const screenWidth = 800;

        for (let x = 0; x < screenWidth; x += tileWidth) {
            platforms.create(x + tileWidth / 2, 568, 'ground').setScale(1).refreshBody();
        }

        // Машинка игрока
        this.playerCar = this.physics.add.sprite(100, 200, 'car1');
        this.playerCar.setAngle(-90);  // Повернуть на -90 градусов
        this.playerCar.setCollideWorldBounds(true);
        this.physics.add.collider(this.playerCar, platforms);
        // this.playerCar.body.allowGravity = false;

        // Машинка с ИИ
        this.aiCar = this.physics.add.sprite(500, 200, 'car2');
        this.aiCar.setAngle(-90);      // То же самое, если нужно
        this.aiCar.setCollideWorldBounds(true);
        this.physics.add.collider(this.aiCar, platforms);
        this.aiCar.body.allowGravity = false;

        // Вектор направления для AI-машинки (1 — вправо, -1 — влево)
        this.aiDirection = 1;

        // Настраиваем клавиатуру для управления
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        // Управление машинкой игрока
        if (this.cursors.left.isDown) {
            this.playerCar.setVelocityX(-350);
        } else if (this.cursors.right.isDown) {
            this.playerCar.setVelocityX(150);
        } else {
            this.playerCar.setVelocityX(0);
        }

        // Простая логика для машинки с ИИ:
        // Двигаем в текущем направлении
        this.aiCar.setVelocityX(100 * this.aiDirection);

        // Если доехали до правого края — меняем направление на влево
        if (this.aiCar.x >= 700) {
            this.aiDirection = -1;
        }
        // Если доехали до левого края — меняем направление на вправо
        else if (this.aiCar.x <= 100) {
            this.aiDirection = 1;
        }

        // Прокрутка фона вертикально
        this.background.tilePositionY -= 2; // Скорость прокрутки, можно настроить по желанию
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    },
    scene: [MainScene], // Только основная сцена
};

const game = new Phaser.Game(config);
