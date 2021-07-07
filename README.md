函数式编程：核心是数据流，面向的是一个一个的函数。
面向对象式编程：核心是对象，面向的是一个一个的对象。


React元素是不可变的，只读、不可扩展。
Object.freeze: 不可删除、不可扩展、不可修改。（浅冻结）
Object.seal: 不可删除、不可扩展、但可修改

immer.js 不可变数据库
```
// 深冻结 
function deepFreeze(obj) {
    Object.freeze(obj);
    for (let key in obj) {
        if (typeof obj[key] === 'object') {
            deepFreeze(obj[key]);
        }
    }
}
```

export DISABLE_NEW_JSX_TRANSFORM=true 使用自定义的createElement函数
