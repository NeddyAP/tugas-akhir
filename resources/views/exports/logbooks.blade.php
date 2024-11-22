<!DOCTYPE html>
<html>
<head>
    <style>
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid black; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <h2>Logbook Data Export</h2>
    <table>
        <thead>
            <tr>
                <th>Tanggal</th>
                <th>Catatan Kegiatan</th>
                <th>Keterangan Kegiatan</th>
            </tr>
        </thead>
        <tbody>
            @foreach($data as $item)
            <tr>
                <td>{{ $item->tanggal }}</td>
                <td>{{ $item->catatan }}</td>
                <td>{{ $item->keterangan }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
