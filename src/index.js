// import React from 'react';
// import ReactDOM from 'react-dom';

import React from './source/react';
import ReactDOM from './source/react-dom';

/**
 * EffectAnimation dom绘制后执行
 * @returns {*}
 * @constructor
 */
function EffectAnimation() {
  const ref = React.useRef();

  React.useEffect(() => {
    ref.current.style.transform = 'translate(500px)';
    ref.current.style.transition = 'all 500ms';
  });

  const style = {
    width: '200px',
    height: '200px',
    backgroundColor: 'red',
  };

  return (
      <div ref={ref} style={style}>Effect Animation</div>
  );
}

/**
 * useLayoutEffect dom绘制前执行
 * @returns {*}
 * @constructor
 */
function LayoutEffectAnimation() {
  const ref = React.useRef();

  React.useLayoutEffect(() => {
    ref.current.style.transform = 'translate(500px)';
    ref.current.style.transition = 'all 500ms';
  });
  const style = {
    width: '200px',
    height: '200px',
    backgroundColor: 'blue',
  };
  return (
      <div>
        <div ref={ref} style={style}>LayoutEffect Animation</div>
      </div>
  );
}

function Layout() {
  return (
      <div>
        <EffectAnimation/>
        <LayoutEffectAnimation/>
      </div>
  );
}


ReactDOM.render(<Layout />, document.getElementById('root'))
