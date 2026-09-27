# Contribuer à Quotify

Projet libre : HTML, CSS, JavaScript. Pas de framework.

## Pas de push sur `main`

`main` est protégée. Travaille sur une branche, puis ouvre une pull request.

- `main` — version stable
- `develop` — travail en cours

```bash
git checkout develop
git checkout -b feat/plus-de-citations
```

## Comment aider

1. Ouvre une issue.
2. Branche + code.
3. Teste : `python3 -m http.server 8080`
4. Pull request vers `develop` ou `main`.

## Où modifier

| Besoin | Fichier |
|---|---|
| Ajouter des citations | `js/data.js` |
| Traduire | `js/i18n.js` |
| Comportement | `js/app.js` |
| Apparence | `css/style.css` |

## Citations

Texte court, clair, pour tous. Indique l’auteur.
