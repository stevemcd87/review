import React, { useState, useEffect } from "react";
import "./NoteTable.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export default function NoteTable() {
  let [tableColumns, setTableColumns] = useState([]),
    [tableRows, setTableRows] = useState([]);
  useEffect(() => {
    updateTable("add", "column");
  }, []);
  useEffect(() => {
    console.log("tableColumns");
    console.log(tableColumns);
  }, [tableColumns]);
  return (
    <div className="note-table-component">
      <table className="nt-table">
        <caption>Table</caption>
        <thead className="nt-thead">
          <tr className="nt-thead-tr">
            {tableColumns.map(column => {
              return (
                <th key={column.id} className="nt-th">
                  <TableData
                    id={column.id}
                    inputValue={column.inputValue}
                    updateTableData={updateTableData}
                  />
                </th>
              );
            })}
            <th className="nt-th">
              <button
                type="button"
                onClick={() => updateTable("add", "column")}
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr></tr>
        </tbody>
      </table>
    </div>
  );

  function updateTable(method, colOrRow, elementIndex = null) {
    // checks if
    let isColumn = colOrRow === "column" ? true : false,
      array = isColumn ? tableColumns : tableRows,
      setArray = isColumn ? setTableColumns : setTableRows,
      list = array.slice(),
      methodFunc = method === "add" ? add : remove,
      methodFuncParams = method === "add" ? [list] : [list, elementIndex],
      id = list.length === 0 ? 0 : +list[list.length - 1].id + 1;
    setArray(methodFunc(...methodFuncParams));
    function add(arr) {
      arr.push({
        inputValue: "",
        id: id,
        setTableColumns: setTableColumns
      });
      return arr;
    }
    function remove(arr, indexToRemove) {
      arr.splice(indexToRemove, 1);
      return arr;
    }
  }

  function updateTableData(id, inputValue) {
    let tcs = tableColumns.slice(),
      tcIndex = tcs.findIndex(tc => tc.id === id);
    tcs[tcIndex].inputValue = inputValue;
    setTableColumns(tcs);
  }
}

function TableData({ inputValue, id, updateTableData }) {
  return (
    <>
      <input
        type="text"
        defaultValue={inputValue}
        className="nt-input"
        onChange={e => updateTableData(id, e.target.value)}
        spellCheck={true}
        aria-label={inputValue + " input"}
      />
    </>
  );
}
