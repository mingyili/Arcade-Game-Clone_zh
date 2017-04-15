/*定义画布宽高和每格的宽高*/
var colW = 101,
    rowH = 83,
    canvasW = colW * 5,
    canvasH = 616;

// 这是我们的玩家要躲避的敌人 
var Enemy = function () {
    this.init();
    // 敌人的图片或者雪碧图，用一个我们提供的工具函数来轻松的加载文件
    this.sprite = 'images/enemy-bug.png';
};

//获取 min 到 max 闭合区间的随机整数
Enemy.random = function (min, max) {
    var temp;
    if (max < min) temp = min, min = max, max = temp;
    return Math.round(min + (max - min) * Math.random());
};
//实例化Enemy初始坐标及速度
Enemy.prototype.init = function () {
    //初始x坐标
    this.x = -colW; 
    //随机生成敌人出现的行位置和速度
    this.y = rowH * this.randomRow();
    this.speed = this.randomSpeed();
};

//随机生成行数 1-3
Enemy.prototype.randomRow = function() {
    return Enemy.random(1, 3);
};

//随机生成速度 1-5
Enemy.prototype.randomSpeed = function() {
    return Enemy.random(50, 500);
};

// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
Enemy.prototype.update = function(dt) {
    // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
    // 都是以同样的速度运行的
    // 循环移动
    this.x = this.x > canvasW ? -colW : this.x + this.speed * dt;
};

// 此为游戏必须的函数，用来在屏幕上画出敌人，
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// 玩家类
var Player = function () {
    this.reset();
    //玩家的样式可以自定义
    this.sprite = 'images/char-boy.png';
    this.successNum = 0;
    this.failNum = 0;
};

//更新玩家的位置
Player.prototype.update = function (dt) {
    //x 的范围是 0 - canvasW - colW
    this.x = this.x < 0 ? 0 : this.x >= canvasW ? canvasW - colW : this.x;
    //y 的范围是 0 - rowH * 5
    this.y = this.y >= rowH * 5 ? rowH * 5 : this.y;
    //成功
    this.y < 0 && this.success();
};

//玩家复活
Player.prototype.reset = function () {
    this.x = colW * 2;
    this.y = rowH * 5;
};

//玩家成功
Player.prototype.success = function () {
    this.successNum++;
    this.reset();
};

//玩家失败
Player.prototype.fail = function () {
    this.failNum++;
    this.reset();
};

//在屏幕上渲染出玩家
Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    
    ctx.clearRect(0, 0, canvasW, 80); //呵呵
    
    ctx.font = '20px Impact';
    ctx.fillStyle = 'green';

    ctx.fillText('SUCCESS: ' + this.successNum, 20, 30);
    
    ctx.fillStyle = 'red';
    ctx.fillText('FAIL: ' + this.failNum, 20, 60);

};

//键盘事件响应，以及对应的移动规则
Player.prototype.handleInput = function (dir) {
    if (dir === 'left')   this.x -= colW;
    if (dir === 'right')  this.x += colW;
    if (dir === 'up')    this.y -= rowH;
    if (dir === 'down') this.y += rowH;
};

// 现在实例化你的所有对象
// 把所有敌人的对象都放进一个叫 allEnemies 的数组里面
var allEnemies = [],
    len = Enemy.random(3, 5);

for (var i = 0; i < len; i++) {
    var enemy = new Enemy();
    allEnemies.push(enemy);
}

// 把玩家对象放进一个叫 player 的变量里面
var player = new Player();

// 撞击事件监测
var checkCollisions = function () {
    //玩家的位置时候与某个敌人位置重叠
    var isCollision = allEnemies.some(function (enemy) {
        return enemy.y === player.y &&
        enemy.x + colW >= player.x + 10 && 
        enemy.x < player.x + colW - 10;
    });
    if (isCollision) player.fail();
};

// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Play.handleInput()
// 方法里面。你不需要再更改这段代码了。
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});