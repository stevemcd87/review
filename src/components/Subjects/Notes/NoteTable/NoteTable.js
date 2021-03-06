import React, { useState, useEffect } from "react";
import "./NoteTable.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function NoteTable({ setTableData, tableData, tableCaption }) {
  let [columnHeaders, setColumnHeaders] = useState([]),
    [dataRows, setDataRows] = useState([]),
    updatable = setTableData ? true : false;
  useEffect(() => {
    if (tableData) {
      setColumnHeaders(tableData.columnHeaders);
      setDataRows(tableData.dataRows);
    }
  }, [tableData]);
  useEffect(() => {
    if (setTableData) {
      setTableData({ columnHeaders: columnHeaders, dataRows: dataRows });
    }
  }, [columnHeaders, dataRows, setTableData]);

  return (
    <div className="note-table-component">
      <table className="nt-table">
        {tableCaption && <caption>{tableCaption}</caption>}
        <thead className="nt-thead">
          <tr className="nt-thead-tr">
            {updatable && <th className="nt-th">{""}</th>}
            {columnHeaders.map(ch => {
              return (
                <th key={ch.id} className="nt-th">
                  <TableData
                    id={ch.id}
                    inputValue={ch.inputValue}
                    updateTableData={updateColumn}
                    updatable={updatable}
                  />
                </th>
              );
            })}
            {updatable && (
              <th className="nt-th">
                <button type="button" onClick={addColumn}>
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {dataRows.map((tr, ind) => {
            return (
              <tr key={`dr-${ind}`}>
                {updatable && (
                  <td className="nt-td">
                    <button type="button" onClick={e => removeDataRow(ind)}>
                      X
                    </button>
                  </td>
                )}
                {tr.map((t, i) => {
                  return (
                    <td key={t.id} className="nt-td">
                      <TableData
                        id={t.id}
                        inputValue={t.inputValue}
                        updateTableData={updateDataRowInput}
                        updatable={updatable}
                      />
                    </td>
                  );
                })}
              </tr>
            );
          })}
          <tr className="nt-tr-last">
            {updatable && (
              <td className="nt-td">
                <button type="button" onClick={addDataRow}>
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </td>
            )}
            {updatable &&
              columnHeaders.map((v, i, a) => {
                return (
                  <td key={v.id} className="nt-td">
                    <button
                      type="button"
                      disabled={a.length === 1 && i === 0}
                      onClick={() => removeColumn(v.id)}
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
    setColumnHeaders(clone);
    updateDataRows(clone);
  }

  function updateDataRows(ch, chIdToRemove) {
    let dataRowsClone = dataRows.slice(),
      updated = chIdToRemove ? removeDataColumn() : addDataColumn();
    setDataRows(updated);

    function removeDataColumn() {
      return dataRowsClone.map(dr => {
        let u = dr.filter(d => !d.id.endsWith(chIdToRemove));
        return u;
      });
    }
    function addDataColumn() {
      return dataRowsClone.filter((v, i) => {
        v.push({
          inputValue: "",
          id: Date.now() + "-" + i + "-" + ch[ch.length - 1].id
        });
        return v;
      });
    }
  }

  function removeColumn(idToRemove) {
    let updatedCH = columnHeaders.filter(v => v.id !== idToRemove);
    setColumnHeaders(updatedCH);
    updateDataRows(columnHeaders, idToRemove);
  }

  function updateColumn(id, inputValue) {
    let clone = columnHeaders.slice(),
      index = clone.findIndex(ch => ch.id === id);
    clone[index].inputValue = inputValue;
    setColumnHeaders(clone);
  }

  function addDataRow() {
    let clone = dataRows.slice(),
      row = [
        ...Array(columnHeaders.length)
          .fill("")
          .map((v, i) => {
            return {
              inputValue: "",
              id: Date.now() + "-" + i + "-" + columnHeaders[i].id
            };
          })
      ];
    clone.push(row);
    setDataRows(clone);
  }

  function removeDataRow(indexToRemove) {
    let clone = dataRows.slice();
    clone.splice(indexToRemove, 1);
    setDataRows(clone);
  }

  function updateDataRowInput(id, inputValue) {
    let clone = dataRows.slice(),
      input;
    clone.find(val => {
      input = val.find(v => v.id === id);
      return input;
    });
    input.inputValue = inputValue;
    setDataRows(clone);
  }
}

function TableData({ inputValue, id, updateTableData, updatable }) {
  return (
    <>
      {updatable && (
        <textarea
          defaultValue={inputValue}
          className="nt-textarea"
          onChange={e => updateTableData(id, e.target.value)}
          spellCheck={true}
          aria-label={id}
        />
      )}
      <Preview val={inputValue} />
    </>
  );
}

function Preview({ val }) {
  let [preview, setPreview] = useState(),
    [sup, setSup] = useState();

  useEffect(() => {
    setSup(val.match(/(?<=<sup>).*(?=<\/sup>)/));
    setPreview(val);
  }, [val]);

  useEffect(() => {
    if (sup) {
      setPreview(val.replace(/<sup>.*<\/sup>/, ""));
    } else {
      setPreview(val);
    }
  }, [sup]);

  return (
    <p className="preview">
      {preview}
      <sup>{sup}</sup>
    </p>
  );
}
