/* eslint-disable */

const CodeExport = (url, name) => {
    let a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()

    window.URL.revokeObjectURL(url)
}

function s2ab(s) {

    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;

}

export default (file_name, sheet_name, header, json) => {
    import('xlsx').then(XLSX => {
        const wb = XLSX.utils.book_new();
        wb.SheetNames.push(sheet_name);
        let ws = XLSX.utils.json_to_sheet(json, header);
        let wscols = [];

        for (let i = 0; i < header['sizeCols'].length; i++) {
            wscols.push({ wch: header['sizeCols'][i] })
        }

        ws['!cols'] = wscols;

        wb.Sheets[sheet_name] = ws;
        var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
        let url = window.URL.createObjectURL(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }))

        CodeExport(url, file_name + '.xlsx')
    })
}