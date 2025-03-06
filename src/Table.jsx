import React, { useState } from 'react';
import { MagnifyingGlassIcon, TrashIcon, ArchiveBoxIcon } from '@heroicons/react/24/solid';

/**
 * JSDOC
 * Composant Table - Un tableau de données réutilisable avec fonctionnalités avancées
 * @param {Object[]} data - Tableau d'objets contenant les données à afficher
 * @param {Object[]} columns - Configuration des colonnes (Header et accessor pour chaque colonne)
 * @param {number} [pageSize=10] - Nombre d'éléments par page
 * @param {boolean} [showGlobalFilter=true] - Affiche/masque la barre de recherche globale
 * @param {boolean} [enableSorting=true] - Active/désactive le tri des colonnes
 * @param {string} [ariaLabel="Tableau de données"] - Label d'accessibilité pour le tableau
 * @param {Function} [onDelete] - Fonction appelée lors de la suppression d'une ligne
 * @param {Function} [onArchive] - Fonction appelée lors de l'archivage d'une ligne
 * @param {Array} [pageSizeOptions=[5, 10, 25, 50, 100]] - Options pour le nombre d'éléments par page
 *
 * @example
 * <Table 
 *   data={employeesData}
 *   columns={[
 *     { Header: 'Nom', accessor: 'name' },
 *     { Header: 'Age', accessor: 'age' }
 *   ]}
 *   pageSize={10}
 *   showGlobalFilter={true}
 *   enableSorting={true}
 *   ariaLabel="Liste des employés"
 *   onDelete={(row) => handleDelete(row)}
 *   onArchive={(row) => handleArchive(row)}
 * />
 */

const Table = ({ 
  data,                                   // Les données à afficher sous forme de tableau d'objets
  columns,                                // Configuration des colonnes (titre et propriété à afficher)
  pageSize = 10,                          // Nombre d'éléments par page par défaut
  showGlobalFilter = true,                // Option pour afficher/masquer la barre de recherche
  enableSorting = true,                   // Option pour activer/désactiver le tri des colonnes
  ariaLabel = "Tableau de données",       // Label d'accessibilité pour le tableau
  onDelete,                               // Fonction callback pour la suppression d'une ligne
  onArchive,                              // Fonction callback pour l'archivage d'une ligne
  pageSizeOptions = [5, 10, 25, 50, 100]  // Options disponibles pour le nombre d'éléments par page
}) => {
  // -- GESTION D'ÉTAT --
  // Utilisation de useState pour gérer l'état local du composant
  const [currentPage, setCurrentPage] = useState(0);            // Page actuelle (commence à 0)
  const [globalFilter, setGlobalFilter] = useState('');         // Valeur du filtre global
  const [sortConfig, setSortConfig] = useState({                // Configuration du tri
    key: null,                                                  // Colonne de tri
    direction: 'ascending'                                      // Direction du tri (ascending/descending)
  }); 
  const [currentPageSize, setCurrentPageSize] = useState(pageSize); // Taille de page actuelle

  // -- FILTRAGE DES DONNÉES --
  // Filtre les données en fonction de la valeur de recherche globale
  const filteredData = data.filter((row) =>
    // Vérifie si au moins une colonne contient la valeur recherchée
    columns.some((column) =>
      String(row[column.accessor]).toLowerCase().includes(globalFilter.toLowerCase())
    )
  );

  // -- TRI DES DONNÉES --
  // Optimisation avec useMemo pour éviter des recalculs inutiles
  const sortedData = React.useMemo(() => {
    let sortableData = [...filteredData]; // Copie pour ne pas modifier les données originales
    if (sortConfig.key !== null) {
      sortableData.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        // Logique de comparaison en fonction de la direction de tri
        if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return sortableData;
  }, [filteredData, sortConfig]); // Dépendances : données filtrées et configuration de tri

  // -- PAGINATION --
  // Calcul du nombre total de pages et extraction des données pour la page actuelle
  const totalPages = Math.ceil(sortedData.length / currentPageSize);
  const currentData = sortedData.slice(
    currentPage * currentPageSize,           // Index de début
    (currentPage * currentPageSize) + currentPageSize // Index de fin
  );

  // -- GESTIONNAIRES D'ÉVÉNEMENTS --
  
  // Gestion du tri lorsqu'on clique sur un en-tête de colonne
  const handleSort = (key) => {
    if (!enableSorting) return; // Ne rien faire si le tri est désactivé
    setSortConfig(current => ({
      key,
      // Inverse la direction si on clique sur la même colonne, sinon commence par 'ascending'
      direction: current.key === key && current.direction === 'ascending' 
        ? 'descending' 
        : 'ascending'
    }));
  };

  // Gestion du changement de taille de page
  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value); // Conversion en nombre
    setCurrentPageSize(newSize);
    setCurrentPage(0); // Retour à la première page lors du changement
  };

  // -- RENDU DU COMPOSANT --
  return (
    <div className="container mx-auto p-4">
      {/* Barre de recherche globale (conditionnelle) */}
      {showGlobalFilter && (
        <div className="relative mb-4">
          <input
            type="text"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl py-2 pl-10 pr-4"
            placeholder="Rechercher..."
            aria-label="Rechercher dans le tableau" // Accessibilité
          />
          {/* Icône de recherche positionnée absolument */}
          <MagnifyingGlassIcon className="w-6 h-6 absolute left-3 top-2 text-gray-500" />
        </div>
      )}

      {/* Conteneur du tableau avec défilement horizontal */}
      <div className="overflow-x-auto">
        <table 
          role="grid"  // Rôle ARIA pour l'accessibilité
          aria-label={ariaLabel}
          className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden"
        >
          {/* En-têtes de tableau avec possibilité de tri */}
          <thead className="bg-gray-100">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  onClick={() => handleSort(column.accessor)}
                  className={`text-left py-3 px-4 font-medium text-gray-700 ${
                    enableSorting ? 'cursor-pointer hover:bg-gray-200' : ''
                  }`}
                  role={enableSorting ? 'button' : 'columnheader'} // ARIA pour le tri
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.Header}</span>
                    {/* Indicateur de direction de tri */}
                    {sortConfig.key === column.accessor && (
                      <span>{sortConfig.direction === 'ascending' ? '▲' : '▼'}</span>
                    )}
                  </div>
                </th>
              ))}
              {/* Colonne d'actions conditionnelle */}
              {(onDelete || onArchive) && (
                <th className="py-3 px-4 font-medium text-gray-700">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          {/* Corps du tableau avec les données filtrées, triées et paginées */}
          <tbody>
            {currentData.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b hover:bg-gray-50">
                {/* Cellules de données */}
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="py-3 px-4 text-gray-600">
                    {row[column.accessor]}
                  </td>
                ))}
                {/* Cellule d'actions conditionnelle */}
                {(onDelete || onArchive) && (
                  <td className="py-3 px-4 text-gray-600">
                    <div className="flex space-x-2">
                      {/* Bouton d'archivage */}
                      {onArchive && (
                        <button
                          onClick={() => onArchive(row)}
                          className="p-1 text-yellow-600 hover:text-yellow-800"
                          aria-label="Archiver"
                        >
                          <ArchiveBoxIcon className="w-5 h-5" />
                        </button>
                      )}
                      {/* Bouton de suppression */}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row)}
                          className="p-1 text-red-600 hover:text-red-800"
                          aria-label="Supprimer"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Contrôles de pagination */}
      <div className="flex flex-wrap justify-between items-center mt-4">
        {/* Boutons de navigation entre les pages */}
        <div className="flex items-center space-x-2 mb-2 sm:mb-0">
          {/* Bouton première page */}
          <button
            onClick={() => setCurrentPage(0)}
            disabled={currentPage === 0}
            className="px-4 py-2 border rounded-l-xl bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            {"<<"}
          </button>
          {/* Bouton page précédente */}
          <button
            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className="px-4 py-2 border bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            {"<"}
          </button>
          {/* Bouton page suivante */}
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage === totalPages - 1}
            className="px-4 py-2 border bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            {">"}
          </button>
          {/* Bouton dernière page */}
          <button
            onClick={() => setCurrentPage(totalPages - 1)}
            disabled={currentPage === totalPages - 1}
            className="px-4 py-2 border rounded-r-xl bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            {">>"}
          </button>
        </div>
        
        {/* Sélecteur de taille de page */}
        <div className="flex items-center space-x-2 mx-2">
          <label htmlFor="page-size" className="text-gray-700">Afficher</label>
          <select
            id="page-size"
            value={currentPageSize}
            onChange={handlePageSizeChange}
            className="border rounded px-2 py-1"
          >
            {pageSizeOptions.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
          <span className="text-gray-700">éléments par page</span>
        </div>
        
        {/* Indicateur de page actuelle */}
        <span className="text-gray-700">
          Page <strong>{currentPage + 1}</strong> sur <strong>{totalPages || 1}</strong>
        </span>
      </div>
    </div>
  );
};

export { Table };