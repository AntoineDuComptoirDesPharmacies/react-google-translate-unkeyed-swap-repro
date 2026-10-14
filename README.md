# eslint-plugin-react-google-translate: three uncovered patterns

Three pages that are clean under both rules of `eslint-plugin-react-google-translate`
(1.1.0, type information enabled) and still crash under Google Translate.

- Live (static build): https://antoineducomptoirdespharmacies.github.io/react-google-translate-unkeyed-swap-repro/
- In the browser with lint and dev server: https://stackblitz.com/github/AntoineDuComptoirDesPharmacies/react-google-translate-unkeyed-swap-repro

```sh
npm install
npm run lint   # 0 problems on src/*.jsx
npm run dev    # open the page, follow the steps of each case
```

Each case has a "simulate Google Translate" button that does what Chrome's page
translation does to the DOM: every text node is replaced by
`<font><font>…</font></font>`. Translating the page with Chrome itself gives the
same result.

Automated check (needs `npm i -D playwright && npx playwright install chromium`):

```sh
npm test
```

## Case 1 — same-type elements with differently laid out text children, no key (`src/Carousel.jsx`)

`{VALUES[index].body}` renders one of two `<p>` whose children are not laid out
the same way (`text, <br/>, text` versus `text, NBSP, text, <br/>, text`). React
keeps the same `<p>` and reconciles its children by index, so switching slides
inserts a node in front of a text node Google Translate has already replaced:
`NotFoundError: Failed to execute 'insertBefore' on 'Node'`. Nothing is
conditional, nothing has a conditional sibling, hence no report.

Fix: a distinct `key` on each body (`<p key="mission">`). React then remounts
the element and only ever inserts elements, which Google Translate does not move.

## Case 2 — a component rendered before a text node (`src/LateAlert.jsx`)

`<p><Alert message={message} /> You can contact us…</p>`: `Alert` renders
`null` until it has a message. Nothing is conditional in the JSX. When the
alert mounts, React calls `parent.insertBefore(alertNode, textNode)` on a text
node Google Translate has replaced: `NotFoundError insertBefore`.

Fix: wrap the text in an element, as for the existing rule.

## Case 3 — a component that renders a bare text node (`src/CompactMessage.jsx`)

`{compact && <FormattedMessage … />} <span>…</span>`: react-intl renders the
message as a bare text node (default `textComponent` is `React.Fragment`), so
this is the plugin's own "conditional text node with siblings" pattern, but the
rule sees a `JSXElement` and stays silent. Once Google Translate has replaced
the message's text node, unmounting it is `parent.removeChild(staleNode)`:
`NotFoundError: Failed to execute 'removeChild' on 'Node'`.

Fix: `<span><FormattedMessage … /></span>`.
