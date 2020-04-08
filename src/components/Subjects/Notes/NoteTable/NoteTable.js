import React, { useState, useEffect } from "react";

export default function NoteTable() {
  let [tableColumns, setTableColumns] = useState([{}]),
    [tableRows, setTableRows] = useState([]);
useEffect(()=>{
  console.log('tableColumns');
  console.log(tableColumns);
},[tableColumns])
  return (
    <table className="nt-table">
    <caption>Table</caption>
      <thead className="nt-thead">
        <tr className="nt-thead-tr">
          <thead className="table-head">
            <tr className="table-head-row">

              {tableColumns.map(column => {
                return (
                  <TH
                    id={column.id}
                    inputValue={column.inputValue}
                    updateColumn={column.updateColumn}
                  />
                );
              })}
              <th>
                <button onClick={addTableColumn}>Add Column</button>
              </th>
            </tr>
          </thead>
        </tr>
      </thead>
    </table>
  );

  function addTableColumn() {
    let columns = tableColumns.slice(),
      id = columns.length === 0 ? 0 : columns[columns.length - 1].id + 1;
    columns.push({
      inputValue: "",
      id: id,
      setTableColumns: setTableColumns
    });
    setTableColumns(columns);
  }

  function addTableRow() {
    let rows = tableRows.slice(),
      id = rows.length === 0 ? 0 : rows[rows.length - 1].id + 1;
    rows.push({
      inputValue: "",
      id: id,
      setTableColumns: setTableColumns
    });
    setTableRows(rows);
  }

  function updateColumn(id, inputValue) {
    let tcs = tableColumns.slice(),
      tcIndex = tcs.findIndex(tc => tc.id === id);
    tcs[tcIndex].inputValue = inputValue;
    setTableColumns(tcs);
  }
}

// function TableHead({tableColumns}) {
//   return (
//     <thead className="table-head">
//       <tr className="table-head-row">
//         {tableColumns.map((column)=>{
//           <TH {...{ inputValue, id, setTableColumns }} />
//         })}
//       </tr>
//     </thead>
//   );
// }

function TH({ inputValue, id, updateColumn }) {
  // let [newInputValue, setNewInputValue] = useState("");
  return (
    <th className="nt-th">
      <input
        type="text"
        defaultValue={inputValue}
        className="nt-th-input"
        onChange={e => updateColumn(id, e.target.value)}
        aria-label={inputValue + " input"}
      />
    </th>
  );

  // function setColumn(){
  //   let column=
  //
  // }
}
