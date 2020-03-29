import React from 'react';
import ReactDom from 'react-dom';

import Zoom from '../lib';

const App = () => (
  <Zoom>
    <div>REACT ZOOM</div>
  </Zoom>
);

ReactDom.render(<App />, document.getElementById('app'));
