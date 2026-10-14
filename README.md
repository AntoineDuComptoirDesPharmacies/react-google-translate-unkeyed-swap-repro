# eslint-plugin-react-google-translate: unkeyed swap reproduction

A page that is clean under both rules of `eslint-plugin-react-google-translate`
(1.1.0, type information enabled) and still crashes under Google Translate with
`NotFoundError: Failed to execute 'insertBefore' on 'Node'`.

```sh
npm install
npm run lint   # 0 problems on src/Carousel.jsx
npm run dev    # open the page, click "simulate Google Translate", then "next"
```

Or translate the page with Chrome itself instead of clicking "simulate": the
simulation only reproduces what Chrome does to the DOM (every text node is
replaced by `<font><font>…</font></font>`).

Automated check (needs `npm i -D playwright && npx playwright install chromium`):

```sh
npm test
```

## The pattern

`src/Carousel.jsx` renders `{VALUES[index].body}`: two `<p>` whose children
are not laid out the same way (`text, <br/>, text` versus
`text, NBSP, text, <br/>, text`). React keeps the same `<p>` and reconciles
its children by index, so switching slides inserts a node in front of a text
node Google Translate has already replaced. Nothing is conditional, nothing
has a conditional sibling, hence no report.

The fix is a distinct `key` on each body (`<p key="mission">`): React then
remounts the element and only ever inserts elements, which Google Translate
does not move.
