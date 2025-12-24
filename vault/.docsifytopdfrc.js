module.exports = {
  contents: [ "_sidebar.md" ], // Use sidebar for structure
  pathName: "./",
  removeTemp: true,
  emulateMedia: "screen",
  pdfOptions: {
    format: "A4",
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<div style="font-size: 10px; text-align: center; width: 100%;">TTRPG Rulebook</div>',
    footerTemplate: '<div style="font-size: 10px; text-align: center; width: 100%;"><span class="pageNumber"></span> / <span class="totalPages"></span></div>',
    margin: {
      top: "60px",
      right: "50px",
      bottom: "60px",
      left: "50px"
    }
  }
}
