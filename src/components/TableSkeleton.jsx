import React from 'react';

const TableSkeleton = ({ columns = 4, rows = 5, headerWidths = [], cellWidths = [] }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
    <div className="flex justify-between items-center p-6 border-b border-gray-200">
      <div className="h-8 bg-gray-300 rounded w-48 animate-pulse"></div>
      <div className="h-10 bg-gray-300 rounded w-24 animate-pulse"></div>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {Array.from({ length: columns }).map((_, index) => (
              <th key={index} className="px-6 py-3 text-left">
                <div
                  className="h-4 bg-gray-300 rounded animate-pulse"
                  style={{ width: headerWidths[index] || '100px' }}
                ></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {Array.from({ length: columns }).map((_, cellIndex) => (
                <td key={cellIndex} className="px-6 py-4 whitespace-nowrap">
                  <div
                    className="h-4 bg-gray-200 rounded animate-pulse"
                    style={{ width: cellWidths[cellIndex] || '100%' }}
                  ></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default TableSkeleton;
