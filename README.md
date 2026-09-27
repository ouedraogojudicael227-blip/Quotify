# Quotify

Une citation inspirante, chaque jour.

Site web + application (PWA). Open source. Pas de compte.

## Lancer en local

```bash
git clone https://github.com/ouedraogojudicael227-blip/Quotify.git
cd Quotify
python3 -m http.server 8080
```

Ouvre `http://localhost:8080` (site) ou `http://localhost:8080/index.html?shell=app` (vue app).

## Fonctions

- Citation du jour
- Explorer par thème et recherche
- Favoris enregistrés sur l’appareil
- Copier / partager
- Français et anglais
- Mode clair / sombre
- Hors-ligne après la première ouverture

## Structure

```
index.html
explorer.html
favoris.html
css/style.css
js/app.js
js/data.js
js/i18n.js
manifest.json
sw.js
```

## Contribuer

Lis [CONTRIBUTING.md](CONTRIBUTING.md). Le plus utile : ajouter des citations dans `js/data.js`.

## Licence

[MIT](LICENSE)
