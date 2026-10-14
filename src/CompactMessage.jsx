import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

// Case 3: a component that renders a bare text node.
//
// react-intl's <FormattedMessage /> renders its message as a text node (its
// default `textComponent` is React.Fragment). This is the plugin's own
// pattern — a conditionally rendered text node with siblings — but the rule
// sees a JSXElement and stays silent. Once Google Translate has replaced the
// message's text node, unmounting it is parent.removeChild(staleNode):
// NotFoundError.
//
// Fix: <span><FormattedMessage … /></span>.
export function CompactMessage() {
  const [compact, setCompact] = useState(false);
  return (
    <section>
      <button
        type="button"
        id="toggle-compact"
        aria-pressed={compact}
        onClick={() => setCompact(!compact)}
      >
        toggle compact
      </button>
      <div>
        {compact && (
          <FormattedMessage
            id="productsFound"
            defaultMessage="{count} products found"
            values={{ count: 3 }}
          />
        )}
        <span>My express order</span>
      </div>
    </section>
  );
}
