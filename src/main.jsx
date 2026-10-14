import React from 'react';
import { createRoot } from 'react-dom/client';
import { Carousel } from './Carousel.jsx';

// What Chrome's page translation does to the DOM: every text node is
// replaced by <font><font>translated</font></font>. React still holds the
// original text nodes, which are no longer children of their parent.
function simulateGoogleTranslate(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) {
    if (walker.currentNode.nodeValue.trim()) textNodes.push(walker.currentNode);
  }
  for (const node of textNodes) {
    const outer = document.createElement('font');
    outer.style.verticalAlign = 'inherit';
    const inner = document.createElement('font');
    inner.style.verticalAlign = 'inherit';
    inner.textContent = node.nodeValue.toUpperCase();
    outer.appendChild(inner);
    node.parentNode.replaceChild(outer, node);
  }
}

class ErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <pre id="error" style={{ color: 'crimson' }}>
          {String(this.state.error)}
        </pre>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <main>
      <h1>eslint-plugin-react-google-translate: unkeyed swap repro</h1>
      <ol>
        <li>
          Either translate this page with Chrome, or click{' '}
          <button
            type="button"
            id="simulate"
            onClick={() => simulateGoogleTranslate(document.getElementById('carousel'))}
          >
            simulate Google Translate
          </button>
        </li>
        <li>
          Click <strong>next</strong> in the carousel: React throws
          NotFoundError insertBefore.
        </li>
      </ol>
      <div id="carousel">
        <ErrorBoundary>
          <Carousel />
        </ErrorBoundary>
      </div>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
