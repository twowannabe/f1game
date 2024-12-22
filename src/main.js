class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    preload() {
        console.log('Загрузка ресурсов...');
        this.load.image('car1', 'assets/car1.png');        // Машина игрока
        this.load.image('car2', 'assets/car2.png');        // Машина AI
        this.load.image('road', 'assets/trainroad.png');   // Дорожное полотно
    }

    create() {
        console.log('Создание сцены...');

        // === Дорога ===
        this.road = this.add.tileSprite(400, 300, 800, 600, 'road');
        this.road.setAngle(90); // Поворачиваем дорогу на 90 градусов

        // === Полосы движения ===
        const lanes = [200, 400]; // Координаты Y для полос

        // === Машина игрока ===
        this.playerCar = this.physics.add.sprite(100, lanes[0], 'car1').setScale(0.5);
        this.playerCar.setAngle(0); // Оставляем ориентацию
        this.playerCar.setCollideWorldBounds(true);

        // === Машина AI ===
        this.aiCar = this.physics.add.sprite(100, lanes[1], 'car2').setScale(0.5);
        this.aiCar.setAngle(0);
        this.aiCar.setCollideWorldBounds(true);

        // === Управление ===
        this.cursors = this.input.keyboard.createCursorKeys();

        // === Скорости машин ===
        this.playerSpeed = 0;
        this.maxSpeed = 300;
        this.aiSpeed = 200;

        // === Таймеры и прогресс ===
        this.raceDuration = 15000; // 15 секунд
        this.raceElapsed = 0;
        this.raceFinished = false;

        // === Интерфейс ===
        this.speedText = this.add.text(16, 16, 'Speed: 0 km/h', { font: '24px Arial', fill: '#ffffff' });
    }

    update(time, delta) {
        if (this.raceFinished) return;

        // === Таймер гонки ===
        this.raceElapsed += delta;
        if (this.raceElapsed >= this.raceDuration) {
            this.endRace();
            return;
        }

        // === Управление машиной игрока ===
        if (this.cursors.left.isDown) {
            this.playerCar.x -= 250 * (delta / 1000);
            this.road.tilePositionX -= this.playerSpeed * (delta / 1000); // Прокрутка дороги
        } else if (this.cursors.right.isDown) {
            this.playerCar.x += 250 * (delta / 1000);
            this.road.tilePositionX += this.playerSpeed * (delta / 1000); // Прокрутка дороги
        }

        if (this.cursors.up.isDown) {
            this.playerSpeed = Math.min(this.playerSpeed + 10, this.maxSpeed);
        } else if (this.cursors.down.isDown) {
            this.playerSpeed = Math.max(this.playerSpeed - 10, 0);
        }

        // === Движение AI ===
        this.aiCar.x += this.aiSpeed * (delta / 1000);
        if (this.aiCar.x > 800) {
            this.aiCar.x = -100; // Перезапуск AI машины с начала
        }

        // === Обновление интерфейса ===
        this.speedText.setText(`Speed: ${Math.floor(this.playerSpeed)} km/h`);
    }

    endRace() {
        console.log('Гонка завершена!');
        this.raceFinished = true;

        // Остановка машин
        this.playerCar.setVelocity(0);
        this.aiCar.setVelocity(0);

        // Определение победителя
        const winner = this.playerCar.x > this.aiCar.x ? 'Player' : 'AI';
        const resultText = `Finished!\nWinner: ${winner}`;

        // Вывод результата
        this.add.text(400, 300, resultText, {
            font: '24px Arial',
            fill: '#ffffff',
            align: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: { x: 20, y: 20 },
        }).setOrigin(0.5);
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000',
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 }, debug: false },
    },
    scene: [MainScene],
};

const game = new Phaser.Game(config);
