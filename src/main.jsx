import React from 'react';
import { createRoot } from 'react-dom/client';
import { IntlProvider } from 'react-intl';
import { Carousel } from './Carousel.jsx';
import { LateAlert } from './LateAlert.jsx';
import { CompactMessage } from './CompactMessage.jsx';

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
        <pre className="error" style={{ color: 'crimson', whiteSpace: 'pre-wrap' }}>
          {String(this.state.error)}
        </pre>
      );
    }
    return this.props.children;
  }
}

function Case({ id, title, steps, children }) {
  return (
    <article id={id} style={{ border: '1px solid #ccc', padding: 16, marginBottom: 16 }}>
      <h2>{title}</h2>
      <ol>
        {steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <button
        type="button"
        className="simulate"
        onClick={() => simulateGoogleTranslate(document.querySelector(`#${id} .target`))}
      >
        simulate Google Translate
      </button>
      <div className="target">
        <ErrorBoundary>{children}</ErrorBoundary>
      </div>
    </article>
  );
}

function App() {
  return (
    <IntlProvider locale="en" defaultLocale="en">
      <main>
        <h1>eslint-plugin-react-google-translate: three uncovered patterns</h1>
        <p>
          <code>npm run lint</code> reports nothing on any of the three cases.
          Each one can also be reproduced by translating this page with Chrome
          instead of clicking "simulate".
        </p>

        <Case
          id="swap"
          title="1. Same-type elements with differently laid out text children, no key (src/Carousel.jsx)"
          steps={['simulate Google Translate', 'click "next"']}
        >
          <Carousel />
        </Case>

        <Case
          id="component"
          title="2. A component rendered before a text node (src/LateAlert.jsx)"
          steps={['simulate Google Translate', 'click "mount the alert"']}
        >
          <LateAlert />
        </Case>

        <Case
          id="intl"
          title="3. A component that renders a bare text node: react-intl <FormattedMessage /> (src/CompactMessage.jsx)"
          steps={[
            'click "toggle compact" (on)',
            'simulate Google Translate',
            'click "toggle compact" again (off)',
          ]}
        >
          <CompactMessage />
        </Case>
      </main>
    </IntlProvider>
  );
}

createRoot(document.getElementById('root')).render(<App />);
