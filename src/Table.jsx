import React, { useState } from 'react';
import { MagnifyingGlassIcon, TrashIcon, ArchiveBoxIcon } from '@heroicons/react/24/solid';

/**
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
  data, 
  columns, 
  pageSize = 10, 
  showGlobalFilter = true, 
  enableSorting = true, 
  ariaLabel = "Tableau de données",
  onDelete,
  onArchive,
  pageSizeOptions = [5, 10, 25, 50, 100]
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);

  // Logique de filtrage
  const filteredData = data.filter((row) =>
    columns.some((column) =>
      String(row[column.accessor]).toLowerCase().includes(globalFilter.toLowerCase())
    )
  );

  // Logique de tri avec useMemo pour optimisation
  const sortedData = React.useMemo(() => {
    let sortableData = [...filteredData];
    if (sortConfig.key !== null) {
      sortableData.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return sortableData;
  }, [filteredData, sortConfig]);

  // Pagination avec taille de page dynamique
  const totalPages = Math.ceil(sortedData.length / currentPageSize);
  const currentData = sortedData.slice(
    currentPage * currentPageSize,
    (currentPage * currentPageSize) + currentPageSize
  );

  const handleSort = (key) => {
    if (!enableSorting) return;
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'ascending' 
        ? 'descending' 
        : 'ascending'
    }));
  };

  // Gestionnaire de changement de taille de page
  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value);
    setCurrentPageSize(newSize);
    setCurrentPage(0); // Retour à la première page lors du changement
  };

  return (
    <div className="container mx-auto p-4">
      {showGlobalFilter && (
        <div className="relative mb-4">
          <input
            type="text"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl py-2 pl-10 pr-4"
            placeholder="Rechercher..."
            aria-label="Rechercher dans le tableau"
          />
          <MagnifyingGlassIcon className="w-6 h-6 absolute left-3 top-2 text-gray-500" />
        </div>
      )}

      <div className="overflow-x-auto">
        <table 
          role="grid" 
          aria-label={ariaLabel}
          className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden"
        >
          <thead className="bg-gray-100">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  onClick={() => handleSort(column.accessor)}
                  className={`text-left py-3 px-4 font-medium text-gray-700 ${
                    enableSorting ? 'cursor-pointer hover:bg-gray-200' : ''
                  }`}
                  role={enableSorting ? 'button' : 'columnheader'}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.Header}</span>
                    {sortConfig.key === column.accessor && (
                      <span>{sortConfig.direction === 'ascending' ? '▲' : '▼'}</span>
                    )}
                  </div>
                </th>
              ))}
              {(onDelete || onArchive) && (
                <th className="py-3 px-4 font-medium text-gray-700">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {currentData.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b hover:bg-gray-50">
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="py-3 px-4 text-gray-600">
                    {row[column.accessor]}
                  </td>
                ))}
                {(onDelete || onArchive) && (
                  <td className="py-3 px-4 text-gray-600">
                    <div className="flex space-x-2">
                      {onArchive && (
                        <button
                          onClick={() => onArchive(row)}
                          className="p-1 text-yellow-600 hover:text-yellow-800"
                          aria-label="Archiver"
                        >
                          <ArchiveBoxIcon className="w-5 h-5" />
                        </button>
                      )}
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

      <div className="flex flex-wrap justify-between items-center mt-4">
        <div className="flex items-center space-x-2 mb-2 sm:mb-0">
          <button
            onClick={() => setCurrentPage(0)}
            disabled={currentPage === 0}
            className="px-4 py-2 border rounded-l-xl bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            {"<<"}
          </button>
          <button
            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className="px-4 py-2 border bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            {"<"}
          </button>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage === totalPages - 1}
            className="px-4 py-2 border bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            {">"}
          </button>
          <button
            onClick={() => setCurrentPage(totalPages - 1)}
            disabled={currentPage === totalPages - 1}
            className="px-4 py-2 border rounded-r-xl bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            {">>"}
          </button>
        </div>
        
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
        
        <span className="text-gray-700">
          Page <strong>{currentPage + 1}</strong> sur <strong>{totalPages || 1}</strong>
        </span>
      </div>
    </div>
  );
};

export { Table };