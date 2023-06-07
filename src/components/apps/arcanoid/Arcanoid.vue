<template>
    <Window>
        <template #topbar>
            <slot name="topbar"></slot>
        </template>

        <template #window>
            <div id="container" ref="container">

            </div>
        </template>
    </Window>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import Window from '../../Window.vue';
import Phaser from "phaser"


const container = ref<HTMLElement | null>(null)

class ArcanoidScene extends Phaser.Scene {
    ship?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
    enemies?: Phaser.GameObjects.Group
    bullets?: Phaser.GameObjects.Group
    cursors?: Phaser.Types.Input.Keyboard.CursorKeys
    score?: Phaser.GameObjects.Text
    health?: Phaser.GameObjects.Text
    scoreNumber: number = 0
    healthNumber: number = 3

    constructor() {
        super('ArcanoidScene')
    }

    preload() {
        this.load.image('ship', '/arcanoid/arcanoidShip.png')
        this.load.image('bullet', '/arcanoid/bullet.png')
        this.load.image('enemy', '/arcanoid/enemy.png')

    }

    create() {
        this.ship = this.physics.add.sprite(150, 150, 'ship')
        this.score = this.add.text(0,0, 'Score: 0')
        this.health = this.add.text(200, 0, `Health: ${this.healthNumber}`)
        
        this.ship.scale = 0.1
        this.ship.x = 150
        this.ship.y = 280
        this.enemies = this.physics.add.group()
        this.bullets = this.physics.add.group()
        this.createEnemies(10)

        this.physics.add.collider(this.bullets, this.enemies, (bullet, enemy) => {
            bullet.destroy()
            enemy.destroy()
            this.scoreNumber += 1
            if (this.score) {
                this.score.text = `Score: ${this.scoreNumber}`
            }
        })

        this.physics.add.collider(this.enemies, this.ship, (ship, enemy) => {
            enemy.destroy()
            this.loseHealth()
        }) 

        this.cursors = this.input.keyboard?.createCursorKeys()
    }

    update() {
        if (this.cursors && this.ship && this.enemies && this.bullets) {
            if (this.cursors.left.isDown) {
                this.ship?.setVelocityX(-100)
            }
    
            if (this.cursors.right.isDown) {
                this.ship?.setVelocityX(100)
            }
    
            if (this.cursors.right.isUp && this.cursors.left.isUp) {
                this.ship?.setVelocityX(0)
            }
    
            if (this.cursors.up.isDown) {
                this.createBullet()
            }
    
            this.enemies.children.entries.forEach(e => {
                const enemy = e as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
                enemy.y += 0.2
                
                if (this.ship && this.ship.y <= enemy.y) {
                    enemy.destroy()
                    this.loseHealth()
                }
            })
    
            if (this.enemies?.children.entries.length === 0) {
                this.createEnemies(10)
            }
    
            this.bullets?.children.entries.forEach(b => {
                const bullet = b as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
                bullet.y -= 2
                if (bullet.y <= 0) {
                    bullet.destroy()
                }
            })
        }


    }

    createEnemies(quantity: number) {
        this.enemies?.createMultiple({
            key: 'enemy',
            setScale: {
                x: 0.3,
                y: 0.3
            },
            quantity
        })

        this.enemies?.children.entries.forEach(e => {
            const enemy = e as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
            enemy.x = Phaser.Math.RND.between(20, 250)
            enemy.y = Phaser.Math.RND.between(20, 100)
            enemy.setCollideWorldBounds()
        })

       
    }

    createBullet() {
        if (this.ship && this.bullets && this.bullets.countActive() < 1) {
            const bullet = this.bullets.create(this.ship.x, this.ship.y + 5, 'bullet')
            bullet.scale = 0.3
        }
    }

    loseHealth() {
        this.healthNumber -= 1
        if (this.health) {
            this.health.text = `Health: ${this.healthNumber}`
        }

        if (this.healthNumber <= 0) {
            this.scene.restart()

            if (this.score) {
                this.score.text = 'Lost'
                this.scoreNumber = 0
                this.healthNumber = 3
            }
        }
    }


}

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.CANVAS,
    width: 300,
    height: 300,
    scene: ArcanoidScene,
    physics: {
        default: 'arcade'
    },
    parent: 'container',
    input: {
        keyboard: true
    }
}
const state = reactive<{
    game: Phaser.Game | null
}>({
    game: null
})

onMounted(() => {
    if (container.value) {
        state.game = new Phaser.Game(config)
    }
})


</script>

<style scoped>
#container {
    width: 300px;
    height: 300px;
}
</style>