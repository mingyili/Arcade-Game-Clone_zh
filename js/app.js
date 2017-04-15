// 定义 单元格以及画布 的宽高
// 单元格：每块地图、敌人、玩家的宽高，这里为了统一控制所以设成全局变量
var cellW = 101,
    cellH = 83,
    canvasW = cellW * 5,
    canvasH = 616;

/**
* @description 这是我们的玩家要躲避的敌人
*/
var Enemy = function() {
    this.init();
    // 敌人的图片或者雪碧图，用一个我们提供的工具函数来轻松的加载文件
    this.sprite = 'images/enemy-bug.png';
};

/**
* @description 随机生成指定闭合区间的整数
* @constructor
* @param {number} min - 最小值
* @param {number} max - 最大值
*/
Enemy.random = function(min, max) {
    if (isNaN(min) || isNaN(max) || max < min) return 0;
    return Math.round(min + (max - min) * Math.random());
};

/**
* @description 实例化Enemy初始坐标及速度
*/
Enemy.prototype.init = function() {
    this.x = -cellW;
    // 随机生成敌人出现的行位置和速度
    this.y = cellH * this.randomRow();
    this.speed = this.randomSpeed();
};

/**
* @description 随机生成敌人所在行数 1 - 3
*/
Enemy.prototype.randomRow = function() {
    return Enemy.random(1, 3);
};

/**
* @description 随机生成敌人移动速度 50 - 500
*/
Enemy.prototype.randomSpeed = function() {
    return Enemy.random(50, 500);
};

/**
* @description 更新敌人的位置
* @constructor
* @param {string} dt - 表示时间间隙
* 每一次的移动都乘以 dt，以此来保证游戏在所有的电脑上以同样的速度运行
*/
Enemy.prototype.update = function(dt) {
    // 循环移动，当超出画布时返回初始状态重新移动
    this.x = this.x > canvasW ? -cellW : this.x + this.speed * dt;
};

// 此为游戏必须的函数，用来在屏幕上画出敌人，
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
* @description 玩家类
* @description 初始化玩家数据
*/
var Player = function() {
    // 玩家的雪碧图
    this.sprite = 'images/char-boy.png';
    // 成功次数
    this.successNum = 0;
    // 失败次数
    this.failNum = 0;
    this.reset();
};

/**
* @description 限制玩家的位置在可视区域内
* @description 当玩家到达顶部时，游戏成功
* @constructor
* @param {string} dir - dt ，表示时间间隙
*/
Player.prototype.update = function(dt) {
    // x 的范围是 0 到 canvasW - cellW
    this.x = this.x < 0 ? 0 : this.x >= canvasW ? canvasW - cellW : this.x;
    // y 的范围是 0 到 cellH * 5
    this.y = this.y >= cellH * 5 ? cellH * 5 : this.y;
    // 游戏成功
    this.y === 0 && this.success();
};


/**
* @description 重置玩家位置，复活
*/
Player.prototype.reset = function() {
    this.x = cellW * 2;
    this.y = cellH * 5;
};

/**
* @description 游戏成功
*/
Player.prototype.success = function() {
    this.successNum++;
    this.reset();
};

/**
* @description 游戏失败
*/
Player.prototype.fail = function() {
    this.failNum++;
    this.reset();
};

/**
* @description 在屏幕上渲染出玩家以
* @description 并渲染出玩家成功和失败的次数
*/
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    // 清理画布以免影响新的内容展示
    ctx.clearRect(0, 0, canvasW, 80);

    ctx.font = '20px Impact';
    ctx.fillStyle = 'green';
    // 成功次数
    ctx.fillText('SUCCESS: ' + this.successNum, 20, 30);
    // 失败次数
    ctx.fillStyle = 'red';
    ctx.fillText('FAIL: ' + this.failNum, 20, 60);

};

/**
* @description 响应键盘事件，并设置相应的玩家位置信息
* @description 左：x减，右：x加，上：y减，下：y加
* @constructor
* @param {string} dir - 玩家移动方向
*/
Player.prototype.handleInput = function(dir) {
    if (dir === 'left')  this.x -= cellW;
    if (dir === 'right') this.x += cellW;
    if (dir === 'up')    this.y -= cellH;
    if (dir === 'down')  this.y += cellH;
};

/**
* @description 撞击监测
* @description 当某个敌人所在的区域与玩家所在的区域有重叠时，证明相撞
* @description + 10, -10 是调整玩家所在的区域，在展示上更像是相撞
*/
var checkCollisions = function() {
    var isCollision = allEnemies.some(function(enemy) {
        return enemy.y === player.y &&
            enemy.x + cellW >= player.x + 10 &&
            enemy.x < player.x + cellW - 10;
    });
    // 如果相撞，执行失败
    isCollision && player.fail();
};

// 实例化 3 - 5 个敌人，并放进一个叫 allEnemies 的数组里面
var allEnemies = [],
    len = Enemy.random(3, 5);
for (var i = 0; i < len; i++) {
    var enemy = new Enemy();
    allEnemies.push(enemy);
}

// 把玩家对象放进一个叫 player 的变量里面
var player = new Player();

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