# Knowii Learning Paths

Public site: https://learn.knowii.net

One page per thing a customer can buy from [DeveloPassion](https://store.dsebastien.net), telling them the order to go through what they own. Paths are composed from modules, so each product is described once.

- `src/content/modules/<product-id>.md`: one per product (ids match the store-website product ids).
- `src/content/paths/<purchase-id>.yml`: ordered phases and steps referencing modules.
- `scripts/validate.ts`: cross-checks paths and modules against `store-website/src/data/products` when that repo is checked out next to this one (`bun run validate`).

## Develop

```sh
bun install
bun run dev
bun run build
```

Deploys to GitHub Pages from `main` via `.github/workflows/deploy.yml`.

## License

Code: MIT. Content (everything under `src/content`): © Sébastien Dubois, all rights reserved.
