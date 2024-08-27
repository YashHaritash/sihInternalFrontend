import React, { useState, useEffect } from 'react';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.css';

const SpreadsheetEditor = ({ socket, sessionKey }) => {
  const [data, setData] = useState(Array(50).fill().map(() => Array(50).fill('')));

  useEffect(() => {
    const handleSpreadsheetUpdate = (newData) => {
      console.log('Received spreadsheetUpdate:', newData);
      setData(newData);
    };

    const handleNewParticipant = (message) => {
      console.log(message); // Notify users of new participants
    };

    socket.on('spreadsheetUpdate', handleSpreadsheetUpdate);
    socket.on('newParticipant', handleNewParticipant);

    // Clean up listeners when component unmounts
    return () => {
      socket.off('spreadsheetUpdate', handleSpreadsheetUpdate);
      socket.off('newParticipant', handleNewParticipant);
    };
  }, [socket]);

  const handleDataChange = (changes, source) => {
    if (source === 'edit') {
      const updatedData = [...data];
      changes.forEach(([row, col, oldValue, newValue]) => {
        updatedData[row][col] = newValue;
      });
      setData(updatedData);
      console.log('Emitting spreadsheetChange:', updatedData);
      socket.emit('spreadsheetChange', sessionKey, updatedData);
    }
  };

  return (
    <HotTable
      data={data}
      colHeaders={true}
      rowHeaders={true}
      width="100%"
      height="600"
      licenseKey="non-commercial-and-evaluation"
      afterChange={handleDataChange}
    />
  );
};

export default SpreadsheetEditor;
