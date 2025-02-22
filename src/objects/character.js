/**
 * Clase que representa a un personaje en pantalla.
 * @extends Container
 */
export default class Character extends Phaser.GameObjects.Container {
    /**
     * Contructor del personaje
     * @param {Scene} scene, escena en la que aparece
     * @param {number} x - posición X
     * @param {number} y - posicion Y
     * @param {String} nombre - nombre del personaje
     * @param {int} num - indice del personaje en el diccionario
     * @param {Sprite} sprite - identificador del sprite que se usará
     * @param {bool} focus - si estan hablando en el instante actual
     */
    constructor(scene, x, y, sprite, nombre, num) {
        super(scene, x, y);
        this.add(sprite);
        this.scene = scene;
        this.sprite = sprite;
        this.nombre = nombre;
        this.index = num;
        this.sprite.setBlendMode(Phaser.BlendModes.DARKEN);
        this.onUnfocus(); // por defecto siempre aparecen oscuros
        scene.add.existing(this);

        let char = this;
        this.fadeIn = scene.tweens.add({
            targets: char,
            ease: 'Sine.easeInOut',
            duration: 250,
            paused: true,
            alpha: { from: 0, to: 1 },
            persist: true,
            onComplete: function () {
                // char.setVisible(true);
            },
        });

        this.fadeOut = scene.tweens.add({
            targets: char,
            ease: 'Sine.easeInOut',
            duration: 250,
            alpha: { from: 1, to: 0 },
            paused: true,
            persist: true,
            onComplete: function () {
                // char.setVisible(false);
            },
        });

        this.alpha = 0;
        this.seen = false;
    }

    /**
     * el personaje habla (añade al script de la escena el mensaje correspondiente al final del array)
     * @param {String} mensaje -  pues lo que dice, no te voy a mentir.
     */
    say(mensaje) {
        this.scene.script.push(this.nombre + ":\n" + mensaje); // blabla
    }

    /**
     * ilumina al personaje
     */
    onFocus() {
        this.focus = true;
        this.sprite.clearTint(); // sin filtro
    }

    /**
     * oscurece al personaje
     */
    onUnfocus() {
        this.focus = false;
        this.sprite.setTint(0xbababa); // filtro oscuro
    }

    /**
     * ilumina a todo el mundo
     * @param {Character[]} personajes - array de personajes sobre el que cicla para acceder y oscurecerlos.
     */
    static focusEveryone(personajes) {
        for (let p of Object.values(personajes)) {
            p.onFocus();
        }
    }

    /**
     * oscurece a todos excepto a quien está hablando
     * @param {Character[]} personajes - array de personajes sobre el que cicla para acceder y oscurecerlos.
     */
    unfocusEveryoneElse(personajes) {
        for (let p of Object.values(personajes)) {
            if (p !== this) { // si es distinto a este
                p.onUnfocus();
            }
        }
    }

    /**
     * oscurece a todo el mundo, hablante inclusive
     * @param {Character[]} personajes - array de personajes sobre el que cicla para acceder y oscurecerlos.
     */
    static unfocusEveryone(personajes) {
        for (let p of Object.values(personajes)) {
            p.onUnfocus();
        }
    }


    /////////////////////////////////////
    ////// ENTRADA/SALIDA DE PJS  ///////
    /////////////////////////////////////
    onEnter(personajes) {
        // this.setVisible(true);
        this.seen = true;
        this.move(personajes);
        this.fadeIn.play();
    }

    onExit(personajes) {
        // this.setVisible(false);
        this.seen = false;
        // this.move(personajes);
        this.fadeOut.play();
        for (let p of Object.values(personajes)) {
            p.move(personajes);
        }
    }

    static onEnterEveryone(personajes) {
        for (let p of Object.values(personajes)) {
            p.seen = true;
        }
        for (let p of Object.values(personajes)) {
            if (p.seen) {
                p.fadeIn.play();
                p.move(personajes);
            }
        }
    }

    static onExitEveryone(personajes) {
        for (let p of Object.values(personajes)) {
            if (p.seen) p.fadeOut.play();
        }
        for (let p of Object.values(personajes)) {
            p.seen = false;
        }
    }

    move(personajes) {
        let i = 1;
        for (let p of Object.values(personajes)) {
            if (p.seen) {
                //p.setX(p.scene.width * i / (Character.getVisibles(personajes) + 1));
                p.scene.tweens.add({
                    targets: p,
                    duration: 500,
                    x: p.scene.width * i / (Character.getVisibles(personajes) + 1),
                    ease: 'Sine.easeInOut',
                    //yoyo: true,
                    //repeat: 2,
                    persist: true,
                })
                
                i++;
            }
        }
    }


    /**
     *  método para saber que personajes hay visibles ahora mismo
     * @param {*} personajes - diccionario de personajes
     * @returns la cantidad de personajes que hay vibiles ahora mismo
     */
    static getVisibles(personajes) {
        let i = 0;
        for (let p of Object.values(personajes)) {
            if (p.seen)
                ++i;
        }
        return i;
    }
}
