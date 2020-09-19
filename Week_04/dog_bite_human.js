class Animal {}

class Damage {
    constructor(from) {
        this.from = from;
    }
}
class Dog extends Animal {
    /**
     * 狗咬的行为 返回一个伤害对象
     */
    bite() {
        return new Damage(this);
    }
}

class Human extends Animal {
    /**
     * 人受到伤害
     * @param {Damage} someDamage 某种伤害，可以是被狗咬，被人骗，被砖头砸
     */
    harm(someDamage) {
        console.log(someDamage, `harm human`);
    }
}

// test
const dog = new Dog();
const zs = new Human();

zs.harm(dog.bite());
// Damage {from: Dog} harm human
