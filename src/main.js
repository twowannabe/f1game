class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    preload() {
        console.log('Загрузка ресурсов...');
        this.load.image('car1', 'assets/car1.png'); // Машина игрока
        this.load.image('car2', 'assets/car2.png'); // Машина AI
        this.load.image('background', 'assets/trainroad.png'); // Задний фон
    }

    create() {
        console.log('Создание сцены...');

        // === Фон ===
        this.background = this.add.tileSprite(
            400, 300, 800, 600, 'background'
        );

        // === Машина игрока ===
        this.playerCar = this.physics.add.sprite(400, 500, 'car1');
        this.playerCar.setScale(0.5);
        this.playerCar.setAngle(-90);
        this.playerCar.setCollideWorldBounds(true);

        // === Машина AI ===
        this.aiCar = this.physics.add.sprite(600, 500, 'car2');
        this.aiCar.setScale(0.5);
        this.aiCar.setAngle(-90);
        this.aiCar.setCollideWorldBounds(true);

        // === Управление ===
        this.cursors = this.input.keyboard.createCursorKeys();

        // === Таймер гонки ===
        this.raceDuration = 15000; // 15 секунд
        this.raceElapsed = 0;
        this.raceFinished = false;

        // === Скорости машин ===
        this.car1Speed = -200; // Скорость игрока
        this.car2Speed = -150; // Скорость AI

        // Таймер смены скоростей
        this.time.addEvent({
            delay: 5000,
            callback: () => {
                this.car1Speed = -150; // Игрок замедляется
                this.car2Speed = -210; // AI ускоряется
            },
            loop: false,
        });

        this.time.addEvent({
            delay: 10000,
            callback: () => {
                this.car1Speed = -200; // Игрок ускоряется
                this.car2Speed = -200; // AI замедляется
            },
            loop: false,
        });

        // === Таймер на экран ===
        this.timerText = this.add.text(16, 16, 'Time: 15', {
            font: '24px Arial',
            fill: '#ffffff',
        });

        console.log('Сцена создана!');
    }

    update(time, delta) {
        if (this.raceFinished) return;

        // === Таймер гонки ===
        this.raceElapsed += delta;
        const timeLeft = Math.max(0, Math.ceil((this.raceDuration - this.raceElapsed) / 1000));
        this.timerText.setText(`Time: ${timeLeft}`);

        // === Управление машиной игрока ===
        if (this.cursors.left.isDown) {
            this.playerCar.x -= 250 * (delta / 1000);
        } else if (this.cursors.right.isDown) {
            this.playerCar.x += 250 * (delta / 1000);
        }

        // === Движение машин ===
        this.playerCar.y += this.car1Speed * (delta / 1000);
        this.aiCar.y += this.car2Speed * (delta / 1000);

        // === Проверка на выход за пределы ===
        if (this.playerCar.y <= 100) {
            this.playerCar.y = 500; // Вернуть на начальную высоту
        }

        if (this.aiCar.y <= 100) {
            this.aiCar.y = 500; // Вернуть на начальную высоту
        }

        // === Прокрутка фона ===
        this.background.tilePositionY += Math.abs(this.car1Speed) * (delta / 1000);

        // === Проверка завершения гонки ===
        if (this.raceElapsed >= this.raceDuration) {
            this.endRace();
        }
    }

    endRace() {
        console.log('Гонка завершена!');
        this.raceFinished = true;

        // Остановка машин
        this.playerCar.setVelocity(0);
        this.aiCar.setVelocity(0);

        // Определение победителя
        const winner = this.playerCar.y < this.aiCar.y ? 'Player' : 'AI';
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
        arcade: {
            gravity: { y: 0 }, // Без гравитации
            debug: false,
        },
    },
    scene: [MainScene],
};

const game = new Phaser.Game(config);
