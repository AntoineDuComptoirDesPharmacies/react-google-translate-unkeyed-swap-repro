import React, { useState } from 'react';

const NBSP = ' ';

// Three bodies of the same element type whose children are not laid out the
// same way (text, <br />, text) vs (text, NBSP, text, <br />, text). None of
// them is conditional, none has a conditional sibling: both rules of
// eslint-plugin-react-google-translate stay silent (run `npm run lint`).
//
// Fix: give each body a distinct `key`, e.g. <p key="mission">.
const VALUES = [
  {
    title: 'Our mission',
    body: (
      <p>
        First sentence of the first slide.
        <br />
        Second sentence of the first slide.
      </p>
    ),
  },
  {
    title: 'Our community',
    body: (
      <p>
        A community of 11{NBSP}000 pharmacies sharing products.
        <br />
        Second sentence of the second slide.
      </p>
    ),
  },
];

export function Carousel() {
  const [index, setIndex] = useState(0);
  return (
    <section>
      <button
        type="button"
        id="next"
        onClick={() => setIndex((index + 1) % VALUES.length)}
      >
        next
      </button>
      <h3>{VALUES[index].title}</h3>
      <div>{VALUES[index].body}</div>
    </section>
  );
}
