import React, { useState } from 'react';

// Case 2: a component rendered before a text node, in the same parent.
//
// <Alert /> renders null until it has something to show (think: data
// arriving, a feature flag, a notification). Nothing here is conditional in
// the JSX, so the plugin stays silent. When the alert finally mounts, React
// calls parent.insertBefore(alertNode, textNode): if Google Translate has
// replaced that text node in the meantime, NotFoundError.
//
// Fix: wrap the text in an element (<span>…</span>), as for the existing
// rule.
function Alert({ message }) {
  if (!message) return null;
  return <strong>{message}</strong>;
}

export function LateAlert() {
  const [message, setMessage] = useState(null);
  return (
    <section>
      <button
        type="button"
        id="mount-alert"
        onClick={() => setMessage('Your documents are under review.')}
      >
        mount the alert
      </button>
      <p>
        <Alert message={message} />
        You can contact us at any time about your file.
      </p>
    </section>
  );
}
