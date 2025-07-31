import React, { useEffect, useState } from 'react';
import { DataTablePageEvent } from 'primereact/datatable';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRef } from 'react';


import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { OverlayPanel } from 'primereact/overlaypanel';
import { OverlayPanel as OverlayPanelType } from 'primereact/overlaypanel';


import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import './App.css';

function App() {
  interface DesiredData {
    id: number;
    title: string;
    thumbnail: {
      lqip: string;
    };
    place_of_origin: string;
    dimensions: string;
    artist_display: string;
    inscriptions:string;
    date_start:number;
    date_end:number;
  }


  const op = useRef<OverlayPanelType>(null);
  const [desiredData, setDesiredData] = useState<DesiredData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedRow, setSelectedRow] = useState<DesiredData[]>([]);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      const page = first / rows + 1;
      const response = await fetch(`https://api.artic.edu/api/v1/artworks?page=${page}`);
      const receivedData = await response.json();
      setDesiredData(receivedData.data);
    };

    fetchData();
  }, [first, rows]);


  const imageTemplate = (rowData: DesiredData) => (
    <img src={rowData.thumbnail?.lqip} alt={rowData.title} width="50" />
  );

  
  console.log(selectedRow.length);

  return (
    <div className="App container my-5 " style={{ borderRadius: '30px' }}>
      <DataTable
        value={desiredData}
        lazy
        paginator
        first={first}
        rows={rows}
        totalRecords={10780}
        onPage={(e: DataTablePageEvent) => {
          setFirst(e.first);
          setRows(e.rows);
          if (e.page !== undefined)
            setCurrentPage(e.page + 1);
        }}
        selectionMode="checkbox"
        selection={selectedRow}
        onSelectionChange={(e) => setSelectedRow(e.value)}
      >


        <Column
          selectionMode="multiple"
          headerStyle={{ width: '3rem' }}
        />

        <Column
          header={
            <>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  icon="pi pi-chevron-down"
                  className="p-button-text p-button-sm"
                  onClick={(e) => op.current?.toggle(e)}
                />
              </div>
              <OverlayPanel ref={op} showCloseIcon closeOnEscape dismissable={false}>
                <div className="container">
                  <input type="number" id='num_select' width={30} />
                  <button className='btn btn-success' onClick={() => {
                    const element = document.getElementById("num_select") as HTMLInputElement;
                    const select_num = Number(element.value);
                    if (!isNaN(select_num) && select_num > 0) {
                      const rowsToSelect = desiredData.slice(0, select_num);
                      setSelectedRow(rowsToSelect); 
                    }

                  }}>ok</button>
                </div>
              </OverlayPanel>
            </>
          }
          body={() => null}
          style={{ width: '2rem' }}
          exportable={false}
        />
        <Column field="title" header="Title" />
        <Column body={imageTemplate} header="Thumbnail" />
        <Column field="place_of_origin" header="Origin" />
        <Column field="inscriptions" header="Inscriptions" />
        <Column field="date_start" header="Date_start" />
        <Column field="date_end" header="Data_end" />
        <Column field="artist_display" header="Artist" />
      </DataTable>
    </div>
  );
}

export default App;
