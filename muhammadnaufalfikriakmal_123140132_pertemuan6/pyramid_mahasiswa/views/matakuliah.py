from pyramid.view import view_config
from pyramid.httpexceptions import (
    HTTPNotFound,
    HTTPBadRequest,
)

from ..models import Matakuliah


REQUIRED_FIELDS = ['kode_mk', 'nama_mk', 'sks', 'semester']


def _parse_positive_int(value, field_name):
    """Konversi nilai menjadi integer dan pastikan lebih besar dari nol"""
    try:
        number = int(value)
    except (TypeError, ValueError):
        raise ValueError(f'Field {field_name} harus berupa bilangan bulat!')

    if number <= 0:
        raise ValueError(f'Field {field_name} harus lebih besar dari 0!')

    return number


# 1. READ ALL: Menampilkan daftar seluruh mata kuliah
@view_config(route_name='matakuliah_list', renderer='json')
def matakuliah_list(request):
    """View untuk mengambil semua data mata kuliah"""
    dbsession = request.dbsession
    matakuliahs = dbsession.query(
        Matakuliah).order_by(Matakuliah.id.asc()).all()
    return {'matakuliahs': [m.to_dict() for m in matakuliahs]}


# 2. READ ONE: Menampilkan detail satu mata kuliah berdasarkan ID
@view_config(route_name='matakuliah_detail', renderer='json')
def matakuliah_detail(request):
    """View untuk melihat detail satu mata kuliah berdasarkan ID di URL"""
    dbsession = request.dbsession
    matakuliah_id = request.matchdict['id']
    matakuliah = dbsession.query(
        Matakuliah).filter_by(id=matakuliah_id).first()

    if matakuliah is None:
        return HTTPNotFound(json_body={
            'error': f'Matakuliah dengan ID {matakuliah_id} tidak ditemukan'
        })

    return {'matakuliah': matakuliah.to_dict()}


# 3. CREATE: Menambahkan data mata kuliah baru
@view_config(
    route_name='matakuliah_add', request_method='POST', renderer='json')
def matakuliah_add(request):
    """View untuk menambahkan mata kuliah baru dari payload JSON"""
    try:
        json_data = request.json_body

        # Validasi field wajib
        for field in REQUIRED_FIELDS:
            if field not in json_data or json_data[field] in (None, ''):
                return HTTPBadRequest(json_body={
                    'error': f'Field {field} wajib diisi!'
                })

        # Validasi nilai numerik sks & semester
        try:
            sks = _parse_positive_int(json_data['sks'], 'sks')
            semester = _parse_positive_int(json_data['semester'], 'semester')
        except ValueError as e:
            return HTTPBadRequest(json_body={'error': str(e)})

        dbsession = request.dbsession
        kode_mk = str(json_data['kode_mk']).strip().upper()

        duplikat = dbsession.query(
            Matakuliah).filter_by(kode_mk=kode_mk).first()
        if duplikat is not None:
            return HTTPBadRequest(json_body={
                'error': f'Kode mata kuliah {kode_mk} sudah terdaftar'
            })

        matakuliah = Matakuliah(
            kode_mk=kode_mk,
            nama_mk=json_data['nama_mk'],
            sks=sks,
            semester=semester,
        )

        dbsession.add(matakuliah)
        # Flush untuk mengeksekusi INSERT dan mengisi nilai primary key
        dbsession.flush()

        return {'success': True, 'matakuliah': matakuliah.to_dict()}

    except Exception as e:
        return HTTPBadRequest(json_body={'error': str(e)})


# 4. UPDATE: Mengubah data mata kuliah yang sudah ada
@view_config(
    route_name='matakuliah_update', request_method='PUT', renderer='json')
def matakuliah_update(request):
    """View untuk mengupdate data mata kuliah berdasarkan ID"""
    dbsession = request.dbsession
    matakuliah_id = request.matchdict['id']

    matakuliah = dbsession.query(
        Matakuliah).filter_by(id=matakuliah_id).first()
    if matakuliah is None:
        return HTTPNotFound(json_body={
            'error': f'Matakuliah dengan ID {matakuliah_id} tidak ditemukan'
        })

    try:
        json_data = request.json_body

        if 'kode_mk' in json_data:
            kode_mk = str(json_data['kode_mk']).strip().upper()
            duplikat = dbsession.query(Matakuliah).filter(
                Matakuliah.kode_mk == kode_mk,
                Matakuliah.id != matakuliah.id,
            ).first()
            if duplikat is not None:
                return HTTPBadRequest(json_body={
                    'error': f'Kode mata kuliah {kode_mk} sudah terdaftar'
                })
            matakuliah.kode_mk = kode_mk

        if 'nama_mk' in json_data:
            matakuliah.nama_mk = json_data['nama_mk']

        try:
            if 'sks' in json_data:
                matakuliah.sks = _parse_positive_int(json_data['sks'], 'sks')
            if 'semester' in json_data:
                matakuliah.semester = _parse_positive_int(
                    json_data['semester'], 'semester')
        except ValueError as e:
            return HTTPBadRequest(json_body={'error': str(e)})

        return {'success': True, 'matakuliah': matakuliah.to_dict()}

    except Exception as e:
        return HTTPBadRequest(json_body={'error': str(e)})


# 5. DELETE: Menghapus data mata kuliah
@view_config(
    route_name='matakuliah_delete', request_method='DELETE', renderer='json')
def matakuliah_delete(request):
    """View untuk menghapus mata kuliah berdasarkan ID"""
    dbsession = request.dbsession
    matakuliah_id = request.matchdict['id']

    matakuliah = dbsession.query(
        Matakuliah).filter_by(id=matakuliah_id).first()
    if matakuliah is None:
        return HTTPNotFound(json_body={
            'error': f'Matakuliah dengan ID {matakuliah_id} tidak ditemukan'
        })

    dbsession.delete(matakuliah)

    return {
        'success': True,
        'message': f'Matakuliah dengan ID {matakuliah_id} berhasil dihapus',
    }
