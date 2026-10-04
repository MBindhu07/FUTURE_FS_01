# PulseStore — Professional Dynamic REST API Store

A mentor-review-ready vanilla HTML/CSS/JavaScript product listing application using FakeStoreAPI and ES modules.

## Included features

- FakeStoreAPI product + category requests using async/await
- `api.js` contains fetch logic only
- Central state object in `app.js`
- Debounced live search
- Dynamic category tabs
- Featured, price, rating and A–Z sorting
- Responsive product grid (1 / 2 / 3 / 4 columns)
- Wishlist with localStorage persistence
- Product quick-view modal with description, rating and actions
- Add to cart, quantity controls, remove item and subtotal
- Cart drawer: full-width on small screens, compact side panel on desktop
- Cart + search/category/sort/wishlist preferences saved in localStorage
- Safe JSON parsing with try/catch
- Loading skeletons with shimmer
- Error banner with Retry
- Empty search state + Clear Filters
- Dark/light theme toggle saved in localStorage
- Keyboard `/` shortcut for search and Escape for dialogs
- Visible focus states and reduced-motion support
- Back-to-top button
- Professional responsive mobile-first design
- No framework or external UI library

## Structure

```text
pulsestore-enhanced/
├── index.html
├── css/style.css
├── js/
│   ├── api.js
│   ├── app.js
│   └── storage.js
├── README.md
└── .gitignore
```

## Run

Use VS Code Live Server, or from this folder:

```bash
python3 -m http.server 5500
```

Open `http://localhost:5500`.

## Mentor testing checklist

1. Search while typing — no page reload.
2. Click every category.
3. Test every sort option.
4. Add several products to the cart.
5. Increase/decrease quantities and remove products.
6. Refresh and verify cart persistence.
7. Add/remove wishlist items and refresh.
8. Open product Details and test modal actions.
9. Toggle light/dark theme and refresh.
10. DevTools Network → Offline → Retry; verify error banner.
11. DevTools → Slow 3G; verify skeletons.
12. Test at 320, 375, 600, 768, 900, 1024, 1200 and 1440px.
13. Check Console for errors.
