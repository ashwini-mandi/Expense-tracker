import React from "react";
import { Button } from "react-bootstrap";
import { saveAs } from "file-saver";

const DownloadCSV = ({ data, headers, filename, disabled }) => {
  const handleDownload = () => {
    if (!data || data.length === 0) {
      alert("No data to download!");
      return;
    }

    // Create CSV Header
    const csvHeader = [headers.join(",")];

    // Map data into rows
    const csvRows = data.map((row) =>
      headers.map((header) => row[header]).join(",")
    );

    // Combine header and rows
    const csvContent = [csvHeader, ...csvRows].join("\n");

    // Create a Blob for the CSV file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    // Trigger file download
    saveAs(blob, filename || "data.csv");
  };

  return (
    <Button
      variant="success"
      onClick={handleDownload}
      disabled={disabled}
      className="mt-4"
    >
      Download CSV
    </Button>
  );
};

export default DownloadCSV;
