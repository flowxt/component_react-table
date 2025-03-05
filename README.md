# React Table Library

Une librairie React moderne pour créer des tableaux de données avec tri, recherche et pagination.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)

## 📋 Caractéristiques

- ✨ Tri des colonnes (activable/désactivable)
- 🔍 Barre de recherche globale
- 📑 Pagination avancée
- 📱 Design responsive avec Tailwind CSS
- ♿ Accessibilité (ARIA) intégrée
- 🎨 Style moderne et épuré

## 🛠 Installation

```bash
npm install react-table-librairy
```

## 💻 Utilisation

```jsx
import { Table } from "react-table-librairy";

const MyComponent = () => {
  const data = [
    { id: 1, name: "John Doe", age: 30 },
    { id: 2, name: "Jane Smith", age: 25 },
  ];

  const columns = [
    { Header: "Nom", accessor: "name" },
    { Header: "Âge", accessor: "age" },
  ];

  return (
    <Table
      data={data}
      columns={columns}
      pageSize={10}
      showGlobalFilter={true}
      enableSorting={true}
      ariaLabel="Mon tableau de données"
    />
  );
};
```

## ⚙️ Props

| Prop               | Type      | Défaut                 | Description                            |
| ------------------ | --------- | ---------------------- | -------------------------------------- |
| `data`             | `Array`   | Required               | Tableau d'objets contenant les données |
| `columns`          | `Array`   | Required               | Configuration des colonnes             |
| `pageSize`         | `Number`  | `10`                   | Nombre d'éléments par page             |
| `showGlobalFilter` | `Boolean` | `true`                 | Affichage de la barre de recherche     |
| `enableSorting`    | `Boolean` | `true`                 | Activation du tri des colonnes         |
| `ariaLabel`        | `String`  | `"Tableau de données"` | Label d'accessibilité                  |

## 🔧 Structure des données

### Format des données

```jsx
const data = [
  {
    firstName: "John",
    lastName: "Doe",
    startDate: "2024-01-15",
    department: "Marketing",
    dateOfBirth: "1990-05-20",
    street: "123 Main St",
    city: "Paris",
    state: "IDF",
    zipCode: "75001",
  },
];
```

### Format des colonnes

```jsx
const columns = [
  {
    Header: "Prénom", // Titre affiché
    accessor: "firstName", // Clé dans l'objet data
  },
];
```

## 🎨 Personnalisation

Le composant utilise Tailwind CSS. Assurez-vous d'avoir Tailwind CSS configuré dans votre projet :

```bash
npm install tailwindcss
```

### Dépendances requises

```json
{
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "dependencies": {
    "@heroicons/react": "^2.2.0",
    "tailwindcss": "^4.0.9"
  }
}
```

## 🔍 Fonctionnalités détaillées

### Recherche globale

- Filtre sur toutes les colonnes
- Mise à jour en temps réel
- Insensible à la casse

### Pagination

- Navigation première/dernière page
- Navigation page précédente/suivante
- Affichage du nombre total de pages

### Tri

- Tri ascendant/descendant
- Indicateurs visuels de tri
- Tri sur toutes les colonnes

## 📝 Licence

MIT © [BARJON Florian]

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.
