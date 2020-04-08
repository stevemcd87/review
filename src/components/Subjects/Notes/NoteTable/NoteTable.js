import React, { useState, useEffect } from "react";
import "./NoteTable.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export default function NoteTable() {
  let [columnHeaders, setColumnHeaders] = useState([]),
    [tableRows, setTableRows] = useState([]);
  useEffect(() => {
    updateTable("add", "column");
  }, []);
  useEffect(() => {
    console.log(columnHeaders);
    lastTR();
  }, [columnHeaders]);
  return (
    <div className="note-table-component">
      <table className="nt-table">
        <caption>Table</caption>
        <thead className="nt-thead">
          <tr className="nt-thead-tr">
            {columnHeaders.map(ch => {
              return (
                <th key={ch.id} className="nt-th">
                  <TableData
                    id={ch.id}
                    inputValue={ch.inputValue}
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
          <tr className="nt-tr-last">
            {columnHeaders.map((v, i) => {
              return (
                <td key={i}>
                  <button
                    type="button"
                    onClick={() => updateTable("remove", "column", i)}
                  >X</button>
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );

  function lastTR() {
    let tr = Array(columnHeaders.length).fill("");
    console.log(tr);
  }

  function updateTable(method, colOrRow, elementIndex = null) {
    let isColumn = colOrRow === "column" ? true : false,
      array = isColumn ? columnHeaders : tableRows,
      setArray = isColumn ? setColumnHeaders : setTableRows,
      list = array.slice(),
      methodFunc = method === "add" ? add : remove,
      methodFuncParams = method === "add" ? [list] : [list, elementIndex],
      id = list.length === 0 ? 0 + "" : +list[list.length - 1].id + 1 + "";
    setArray(methodFunc(...methodFuncParams));
    function add(arr) {
      arr.push({
        inputValue: "",
        id: id,
        setColumnHeaders: setColumnHeaders
      });
      return arr;
    }
    function remove(arr, indexToRemove) {
      arr.splice(indexToRemove, 1);
      return arr;
    }
  }

  function updateTableData(id, inputValue) {
    let tcs = columnHeaders.slice(),
      tcIndex = tcs.findIndex(tc => tc.id === id);
    tcs[tcIndex].inputValue = inputValue;
    setColumnHeaders(tcs);
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
