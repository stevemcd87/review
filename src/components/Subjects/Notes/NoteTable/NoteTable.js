import React, { useState, useEffect, useRef } from "react";
import "./NoteTable.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function NoteTable({ setTable }) {
  let [columnHeaders, setColumnHeaders] = useState([]),
    [dataRows, setDataRows] = useState([]);
  useEffect(() => {
    addColumn();
  }, []);
  useEffect(() => {
    console.log("columnHeaders");
    console.log(columnHeaders);
    // checkTableIds("ch", columnHeaders);
  }, [columnHeaders]);

  useEffect(() => {
    // checkTableIds("dr", dataRows);
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
                  <button type="button" onClick={e => removeDataRow(ind)}>
                    X
                  </button>
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

  function checkTableIds(str, arr) {
    switch (str) {
      case "ch":
      console.log("isCHValidbefore");
      console.log(isCHValid());
        if (!isCHValid()) updateCH();
        console.log("isCHValidafter");
        console.log(isCHValid());
        break;
      case "dr":
        console.log("isDRValidbefore");
        console.log(isDRValid());
        if (!isDRValid()) updateDRIds();
        console.log("isDRValid after");
        console.log(isDRValid());
        break;
      default:
        alert("wrong parameter");
    }

    function isCHValid() {
      return arr.every((c, i) => +c.id === i);
    }
    function isDRValid() {
      return arr.every((r, ri) => r.every((d, di) => d.id === `${ri}-${di}`));
    }

    function updateDRIds() {
      console.log("updated DR");
      let updated = arr.slice().map((r, ri) => {
        return r.map((d, di) => {
          d.id = `${ri}-${di}`;
          return d;
        });
      });

      console.log(updated);
      setDataRows(updated);
    }

    function updateCH() {
      console.log("updated CH");
      let updated = arr.slice().map((v, i) => {
        v.id = i;
        return v;
      });

      console.log(updated);
      setColumnHeaders(updated);
    }
  }

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
    console.log("updateDataRows");
    console.log("chIdToRemove");
    console.log(chIdToRemove);
    let dataRowsClone = dataRows.slice(),
      updated =
        chIdToRemove
          ? removeDataColumn()
          : addDataColumn();
    console.log("ch");
    console.log(ch);
    console.log(updated);
    setDataRows(updated);

    function removeDataColumn() {
      console.log("removeDataColumn");
      console.log(dataRowsClone);
      return dataRowsClone.map(dr => {
        console.log(dr);
        let u =dr.filter((d)=>!d.id.endsWith(chIdToRemove));
        return u
      });
    }
    function addDataColumn() {
      console.log("add Data column");
      return dataRowsClone.filter((v, i) => {
        v.push({
          inputValue: "",
          id: Date.now() + "-" + i + "-" + ch[ch.length-1].id
        });
        return v;
      });
    }
  }

  function removeColumn(idToRemove) {
    console.log("remove column");
    let updatedCH = columnHeaders.filter(v=>v.id !== idToRemove),
      dataRowsClone = dataRows.slice();
      // idRemoved = updatedCH.splice(indexToRemove, 1)[0].id;
      console.log("idToRemove");
      console.log(idToRemove);
      // console.log(updatedCH.splice(indexToRemove, 1));
    // if (indexToRemove !== columnHeaders.length - 1) {
    //   let updated = updateIds(updatedCH, dataRowsClone);
    //   updatedCH = updated.newCH;
    //   dataRowsClone = updated.newDR;
    // }
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
              id: Date.now() + "-"+ i + "-" + columnHeaders[i].id
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
    console.log("updateDataRowInput");
    let clone = dataRows.slice(),
      input;
      clone.find((val)=>{
        input = val.find(v=> v.id=== id)
        return input
    });
      // indexes = id.split("-"),
      // row = +indexes[0],
      // column = +indexes[1];
    input.inputValue = inputValue;
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
      <Preview val={inputValue} />
    </>
  );
}

function Preview({ val }) {
  let [prev, setPrev] = useState(),
    [sup, setSup] = useState();

  useEffect(() => {
    setSup(val.match(/(?<=<sup>).*(?=<\/sup>)/));
  }, [val]);

  useEffect(() => {
    if (sup) {
      setPrev(val.replace(/<sup>.*<\/sup>/, ""));
    } else {
      setPrev(null);
    }
  }, [sup]);

  return (
    <span>
      {prev}
      <sup>{sup}</sup>
    </span>
  );
}
