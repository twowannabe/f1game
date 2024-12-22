class IntroScene extends Phaser.Scene {
    constructor() {
        super({ key: 'IntroScene' });
    }

    preload() {
        // Загрузка слайдов
        this.load.image('slide1', 'assets/slide1.jpeg');
        this.load.image('slide2', 'assets/slide2.jpeg');
        this.load.image('slide3', 'assets/slide3.jpeg');
    }

    create() {
        const slides = ['slide1', 'slide2', 'slide3'];
        let currentSlide = 0;

        // Функция отображения слайда
        const showSlide = (index) => {
            // Удаляем предыдущий слайд
            if (this.currentImage) {
                this.currentImage.destroy();
                this.currentText.destroy();
                this.nextButton.destroy();
            }

            // Добавляем изображение
            this.currentImage = this.add.image(400, 300, slides[index]).setScale(0.8);

            // Добавляем текст
            const texts = [
                'Добро пожаловать в наше приключение!',
                'Остерегайтесь врагов на пути.',
                'Нажмите кнопку, чтобы начать игру!',
            ];
            this.currentText = this.add.text(400, 500, texts[index], {
                font: '20px Arial',
                fill: '#ffffff',
            }).setOrigin(0.5);

            // Добавляем кнопку
            this.nextButton = this.add.text(700, 550, 'Далее >>', {
                font: '18px Arial',
                fill: '#ffffff',
                backgroundColor: '#000',
                padding: { x: 10, y: 5 },
            }).setInteractive();

            // Обработчик нажатия кнопки
            this.nextButton.on('pointerdown', () => {
                currentSlide++;
                if (currentSlide < slides.length) {
                    showSlide(currentSlide);
                } else {
                    this.scene.start('MainScene'); // Переход к основной сцене
                }
            });
        };

        // Показать первый слайд
        showSlide(currentSlide);
    }
}

class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    preload() {
        // Загрузка ресурсов
        this.load.image('ground', 'assets/medievalTile_002.png');
        this.load.image('run0', 'assets/char/character_maleAdventurer_run0.png');
        this.load.image('run1', 'assets/char/character_maleAdventurer_run1.png');
        this.load.image('run2', 'assets/char/character_maleAdventurer_run2.png');
        // Загрузка фоновой картинки
        this.load.image('background', 'assets/trainroad.png');
    }

    create() {
        // Создание прокручивающегося фона
        this.background = this.add.tileSprite(0, 0, this.sys.game.config.width, this.sys.game.config.height, 'background');
        this.background.setOrigin(0, 0); // Устанавливаем начало координат

        // Земля
        const platforms = this.physics.add.staticGroup();
        const tileWidth = 70;
        const screenWidth = 800;

        for (let x = 0; x < screenWidth; x += tileWidth) {
            platforms.create(x + tileWidth / 2, 568, 'ground').setScale(1).refreshBody();
        }

        // Анимации персонажа
        this.anims.create({
            key: 'run',
            frames: [
                { key: 'run0' },
                { key: 'run1' },
                { key: 'run2' }
            ],
            frameRate: 10,
            repeat: -1
        });

        // Персонаж
        this.player = this.physics.add.sprite(100, 450, 'run0').setScale(0.5);
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, platforms);
        this.player.play('run');

        // Управление
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-150);
            this.player.anims.play('run', true);
            this.player.flipX = true;
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(150);
            this.player.anims.play('run', true);
            this.player.flipX = false;
        } else {
            this.player.setVelocityX(0);
            this.player.anims.stop();
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-350); // Прыжок
        }

        // Двигаем фон
        this.background.tilePositionY - 2; // Прокрутка по горизонтали
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
    scene: [IntroScene, MainScene], // Добавляем обе сцены
};

const game = new Phaser.Game(config);
