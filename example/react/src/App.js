import React, { useEffect, useCallback } from 'react';
import Iris from 'iris';

const App = () => {
  useEffect(() => {
    Iris.init('XXX-ACCOUNT');
    Iris.fire('pageload', { "foo": 1 });
  });

  const handleClick = useCallback(() => {
    Iris.fire('button click');
  }, []);

  return (
    <div style={{ padding: '20px 50px' }}>
      <h1>Iris Example on React</h1>
      <button
        style={{ margin: '20px 0' }}
        onClick={handleClick}
      >
        Click me!
      </button>
    </div>
  );
}

export default App;
