import React, { useState, useEffect } from "react";
import "./NoteTable.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function NoteTable() {
  let [columnHeaders, setColumnHeaders] = useState([]),
    [dataRows, setDataRows] = useState([]);
  useEffect(() => {
    addColumn()
  }, []);
  useEffect(() => {
    console.log("columnHeaders");
    console.log(columnHeaders);
  }, [columnHeaders]);
  useEffect(() => {
    console.log("dataRows");
    console.log(dataRows);
  }, [dataRows]);
  return (
    <div className="note-table-component">
      <table className="nt-table">
        <caption>Table</caption>
        <thead className="nt-thead">
          <tr className="nt-thead-tr">
            <th className="nt-th">{""}</th>
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
              <button type="button" onClick={addColumn}>
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {dataRows.map((tr, ind) => {
            return (
              <tr key={`dr-${ind}`}>
                <td>
                  <button type="button" onClick={e=>removeRow(ind)}>X</button>
                </td>
                {tr.map((t, i) => {
                  return (
                    <td key={"dr-" + ind + "-" + i}>
                      <TableData
                        id={t.id}
                        inputValue={t.inputValue}
                        updateTableData={updateTableData}
                      />
                    </td>
                  );
                })}
              </tr>
            );
          })}
          <tr className="nt-tr-last">
            <td>
              <button type="button" onClick={() => updateTable("add", "row")}>
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </td>
            {columnHeaders.map((v, i) => {
              return (
                <td key={i}>
                  <button
                    type="button"
                    disabled={i === 0}
                    onClick={() => updateTable("remove", "column", i)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );

  function addColumn() {
    let clone = columnHeaders.slice(),
    id = clone.length === 0 ? 0 + "" : +clone[clone.length - 1].id + 1 + "";
    clone.push({
      inputValue: "",
      id: id
    });
    console.log(clone);
    setColumnHeaders(clone);
    function updateDataRows(){}
  }

  function removeColumn(indexToRemove) {
    let clone = columnHeaders.slice();
    clone.splice(indexToRemove,1);
    setColumnHeaders(clone);
  }

  function addRow() {
    let clone = dataRows.slice(),
      row = [
      ...Array(columnHeaders.length)
        .fill("")
        .map((v, i) => {
          return {
            inputValue: "",
            id: i
          };
        })
    ];
    clone.push(row);
    setDataRows(clone)

  }

  function removeRow(indexToRemove) {
    let clone = dataRows.slice();
    clone.splice(indexToRemove,1);
    setDataRows(clone);
  }

  function updateTable(method, colOrRow, elementIndex = null) {
    let isColumn = colOrRow === "column" ? true : false,
      array = isColumn ? columnHeaders : dataRows,
      setArray = isColumn ? setColumnHeaders : setDataRows,
      list = array.slice(),
      methodFunc = method === "add" ? add : remove,
      methodFuncParams = method === "add" ? [list] : [list, elementIndex],
      id = list.length === 0 ? 0 + "" : +list[list.length - 1].id + 1 + "";
    setArray(methodFunc(...methodFuncParams));
    function add(arr) {
      arr.push(isColumn ? addColumn() : addRow());
      console.log(arr);
      return arr;
    }
    function remove(arr, indexToRemove) {
      arr.splice(indexToRemove, 1);
      return arr;
    }
    function addColumn() {
      return;
    }
    function addRow() {
      return [
        ...Array(columnHeaders.length)
          .fill("")
          .map((v, i) => {
            return {
              inputValue: "",
              id: i,
              setArray: setArray
            };
          })
      ];
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
