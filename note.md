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

### 事件委托
1. 事件捕获
当某个元素触发某个事件（如 onclick ），顶层对象 document 就会发出一个事件流，随着 DOM 树的节点向目标元素节点流去，直到到达事件真正发生的目标元素。在这个过程中，事件相应的监听函数是不会被触发的。

2. 事件目标
当到达目标元素之后，执行目标元素该事件相应的处理函数。如果没有绑定监听函数，那就不执行。

3. 事件冒泡
从目标元素开始，往顶层元素传播。途中如果有节点绑定了相应的事件处理函数，这些函数都会被触发一次。如果想阻止事件起泡，可以使用 e.stopPropagation() 或者 e.cancelBubble=true（IE）来阻止事件的冒泡传播。

4. 事件委托/事件代理
简单理解就是将一个响应事件委托到另一个元素。
当子节点被点击时，click 事件向上冒泡，父节点捕获到事件后，我们判断是否为所需的节点，然后进行处理。其优点在于减少内存消耗和动态绑定事件。

### ref
1. 普通dom节点：如：div、span，ref上绑定的是真实DOM。
2. 类组件：ref上绑定的是类组件实例。
3. 函数组件：不能在函数组件上使用ref，因为函数组件没有实例。使用forwardRef转发，将ref向下传递给子组件。

### Context

### dom diff
react不是组件化更新，因为react没有类似vue的响应式的更新机制，不能准确定位哪里更新的。


## cra支持装饰器
npm i react-app-rewired customize-cra @babel/plugin-proposal-decorators -D

修改package.json配置：
    "scripts": {
        "start": "react-app-rewired start",
        "build": "react-app-rewired build",
        "test": "react-app-rewired test",
        "eject": "react-app-rewired eject"
    }

config-overrides.js：

    const {override, addBabelPlugin} = require('customize-cra');
    
    module.exports = override(
        addBabelPlugin([
            "@babel/plugin-proposal-decorators", {"legacy": true}
        ])
    );
    
jsconfig.json（vscode）：
    {
      "compilerOptions": {
         "experimentalDecorators": true
      }
    }
    
### 属性继承
基于属性代理：操作组件的props

### 反向继承
基于反向继承：拦截生命周期、state、渲染过程



