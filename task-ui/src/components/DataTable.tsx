import { useState } from "react";

interface Column<T> {
  header: string;
  accessor: (item: T) => React.ReactNode;
}

interface Props<T> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  searchable?: boolean;
  searchFields?: (keyof T)[];
}

export default function DataTable<T>({
  data,
  columns,
  pageSize = 5,
  searchable = true,
  searchFields = []
}: Props<T>) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // 🔍 FILTER
  const filteredData = data.filter((item) => {
    if (!searchable || !search) return true;

    return searchFields.some((field) => {
      const value = String(item[field] ?? "").toLowerCase();
      return value.includes(search.toLowerCase());
    });
  });

  // 📄 PAGINATION
  const totalPages = Math.ceil(filteredData.length / pageSize);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <>
      {/* 🔍 SEARCH */}
      {searchable && (
        <input
          className="form-control mb-3"
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      )}

      {/* 📊 TABLE */}
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            {columns.map((col, i) => (
              <th key={i}>{col.header}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {paginatedData.map((item, i) => (
            <tr key={i}>
              {columns.map((col, j) => (
                <td key={j}>{col.accessor(item)}</td>
              ))}
            </tr>
          ))}

          {paginatedData.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="text-center">
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 📄 PAGINATION */}
      {totalPages > 1 && (
        <nav>
          <ul className="pagination">

            <li className={`page-item ${currentPage === 1 && "disabled"}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Previous
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, i) => (
              <li
                key={i}
                className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}

            <li className={`page-item ${currentPage === totalPages && "disabled"}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </button>
            </li>

          </ul>
        </nav>
      )}
    </>
  );
}