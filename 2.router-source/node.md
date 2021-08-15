### 路由
HashRouter: 利用hash实现路由切换
BrowserRouter: 利用H5 api实现路由切换

- HashRouter   
1. hash路由切换时, 会触发hashchange事件

```js
    window.addEventListener('hashChange', () => {
      // todo...
    })

```

- BrowserRouter  
1. pushState: 向浏览器的历史堆栈压入一个url为设定值的记录，并改变历史堆栈的当前指针至栈顶.
2. replaceSatte: 不会改动浏览器历史堆栈的当前指针.
1. pushState和replaceState不会触发popstate事件.   
2. popstate: 只有在作出浏览动作, 如：用户点击浏览器的回退按钮，或者执行history.back()或history.forward()方法 时才会触发.   


```js
    history.pushState({page: 1}, null, '/page1');
    history.replaceState({page: 1}, null, '/page1');
    window.onpopstate = () => {
      // todo...
    };
    window.addEventListener('popstate', () => {
      // todo...
    })
    
```

### react路由安装
- npm i react-router-dom --save

1. Router 路由容易
- 内部使用Context向下属路由组件传递路由信息{history, location}

2. Route 路由规则
