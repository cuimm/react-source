函数式编程：核心是数据流，面向的是一个一个的函数。
面向对象式编程：核心是对象，面向的是一个一个的对象。

#### freeze
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

#### DISABLE_NEW_JSX_TRANSFORM
export DISABLE_NEW_JSX_TRANSFORM=true 使用自定义的createElement函数


#### setState
React为了性能考虑，会将多个setState的调用合并为一个来执行，也就是说，当执行setState的时候，state中的数据并不会马上更新

