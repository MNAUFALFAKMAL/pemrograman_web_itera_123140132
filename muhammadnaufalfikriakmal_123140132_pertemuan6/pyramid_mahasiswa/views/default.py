from pyramid.view import view_config


ENDPOINTS = [
    {'method': 'GET', 'path': '/api/mahasiswa',
     'description': 'Menampilkan seluruh data mahasiswa'},
    {'method': 'GET', 'path': '/api/mahasiswa/{id}',
     'description': 'Menampilkan detail mahasiswa berdasarkan ID'},
    {'method': 'POST', 'path': '/api/mahasiswa',
     'description': 'Menambahkan data mahasiswa baru'},
    {'method': 'PUT', 'path': '/api/mahasiswa/{id}',
     'description': 'Memperbarui data mahasiswa'},
    {'method': 'DELETE', 'path': '/api/mahasiswa/{id}',
     'description': 'Menghapus data mahasiswa'},
    {'method': 'GET', 'path': '/api/matakuliah',
     'description': 'Menampilkan seluruh data mata kuliah'},
    {'method': 'GET', 'path': '/api/matakuliah/{id}',
     'description': 'Menampilkan detail mata kuliah berdasarkan ID'},
    {'method': 'POST', 'path': '/api/matakuliah',
     'description': 'Menambahkan data mata kuliah baru'},
    {'method': 'PUT', 'path': '/api/matakuliah/{id}',
     'description': 'Memperbarui data mata kuliah'},
    {'method': 'DELETE', 'path': '/api/matakuliah/{id}',
     'description': 'Menghapus data mata kuliah'},
]


@view_config(route_name='home', renderer='../templates/home.jinja2')
def home_view(request):
    """Halaman ringkasan endpoint RESTful API yang tersedia."""
    return {'project': 'pyramid_mahasiswa', 'endpoints': ENDPOINTS}
