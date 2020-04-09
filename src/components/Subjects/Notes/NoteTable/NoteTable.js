import React, { useState, useEffect, useRef } from "react";
import "./NoteTable.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function NoteTable({setTable}) {
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
                    updateTableData={updateColumn}
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
                  <button type="button" onClick={e=>removeDataRow(ind)}>X</button>
                </td>
                {tr.map((t, i) => {
                  return (
                    <td key={t.id}>
                      <TableData
                        id={t.id}
                        inputValue={t.inputValue}
                        updateTableData={updateDataRowInput}
                      />
                    </td>
                  );
                })}
              </tr>
            );
          })}
          <tr className="nt-tr-last">
            <td>
              <button type="button" onClick={addDataRow}>
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </td>
            {columnHeaders.map((v, i, a) => {
              return (
                <td key={i}>
                  <button
                    type="button"
                    disabled={a.length === 1 && i === 0}
                    onClick={() => removeColumn(i)}
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
    updateDataRows();

  }

  function updateDataRows(indexToRemove=null){
    let dataRowsClone = dataRows.slice(),
      updateDataRows = indexToRemove ? removeDataColumn() : addDataColumn();
    setDataRows(updateDataRows);

    function removeDataColumn(){
      return dataRowsClone.map((dr)=>{
        dr.splice(indexToRemove,1);
        return dr
      })
    }
    function addDataColumn(){
      return dataRowsClone.map((v,i)=>{
        v.push({
          inputValue: "",
          id:  i + "-" + columnHeaders.length
        })
        return v
      })
    }
  }

  function removeColumn(indexToRemove) {
    let columnHeadersClone = columnHeaders.slice(),
      dataRowsClone = dataRows.slice();
    columnHeadersClone.splice(indexToRemove,1);
    setColumnHeaders(columnHeadersClone);
    updateDataRows(indexToRemove);
  }

  function updateColumn(id, inputValue){
    let clone = columnHeaders.slice(),
      index = clone.findIndex(ch=>ch.id === id);
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
            id: clone.length  + "-" + i
          };
        })
    ];
    clone.push(row);
    setDataRows(clone)
  }

  function removeDataRow(indexToRemove) {
    let clone = dataRows.slice();
    clone.splice(indexToRemove,1);
    setDataRows(clone);
  }

  function updateDataRowInput(id, inputValue){
    let clone = dataRows.slice(),
      indexes = id.split('-'),
      row = +indexes[0],
      column = +indexes[1]
    clone[row][column].inputValue = inputValue;
    setDataRows(clone);
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
        aria-label={id}
      />
    <Preview val={inputValue}/>
  </>
  );
}

function Preview ({val}){
  let [prev, setPrev] = useState(),
    [sup, setSup] = useState();

  useEffect(()=>{
    setSup(val.match(/(?<=<sup>).*(?=<\/sup>)/));
  },[val])

  useEffect(()=>{
    if(sup){
      setPrev(val.replace(/<sup>.*<\/sup>/, ""))
    } else {
      setPrev(null)
    }
  },[sup])

  return (
    <span>{prev}<sup>{sup}</sup></span>
  )
}
