import unittest

import transaction
from pyramid import testing


def dummy_request(dbsession, **kwargs):
    return testing.DummyRequest(dbsession=dbsession, **kwargs)


class BaseTest(unittest.TestCase):
    def setUp(self):
        self.config = testing.setUp(settings={
            'sqlalchemy.url': 'sqlite:///:memory:'
        })
        self.config.include('pyramid_mahasiswa.models')
        settings = self.config.get_settings()

        from pyramid_mahasiswa.models import (
            get_engine,
            get_session_factory,
            get_tm_session,
        )

        self.engine = get_engine(settings)
        session_factory = get_session_factory(self.engine)
        self.session = get_tm_session(session_factory, transaction.manager)

        from pyramid_mahasiswa.models.meta import Base
        Base.metadata.create_all(self.engine)

    def tearDown(self):
        from pyramid_mahasiswa.models.meta import Base

        testing.tearDown()
        transaction.abort()
        Base.metadata.drop_all(self.engine)


class TestMahasiswaViews(BaseTest):
    def test_list_detail_create_update_delete(self):
        from pyramid_mahasiswa.views.mahasiswa import (
            mahasiswa_add,
            mahasiswa_delete,
            mahasiswa_detail,
            mahasiswa_list,
            mahasiswa_update,
        )
        from pyramid_mahasiswa.models import Mahasiswa

        created = mahasiswa_add(dummy_request(self.session, json_body={
            'nim': '12345',
            'nama': 'Budi Santoso',
            'jurusan': 'Teknik Informatika',
            'tanggal_lahir': '2000-05-15',
            'alamat': 'Jl. Merdeka No. 123, Bandung',
        }))
        self.assertTrue(created['success'])
        self.assertEqual(created['mahasiswa']['nim'], '12345')

        listed = mahasiswa_list(dummy_request(self.session))
        self.assertEqual(len(listed['mahasiswas']), 1)

        detail = mahasiswa_detail(
            dummy_request(self.session, matchdict={'id': '1'}))
        self.assertEqual(detail['mahasiswa']['nama'], 'Budi Santoso')

        updated = mahasiswa_update(dummy_request(
            self.session,
            matchdict={'id': '1'},
            json_body={'jurusan': 'Informatika Medis'},
        ))
        self.assertEqual(
            updated['mahasiswa']['jurusan'], 'Informatika Medis')

        deleted = mahasiswa_delete(
            dummy_request(self.session, matchdict={'id': '1'}))
        self.assertTrue(deleted['success'])
        self.assertIsNone(self.session.query(Mahasiswa).first())

    def test_create_invalid_field(self):
        from pyramid_mahasiswa.views.mahasiswa import mahasiswa_add

        response = mahasiswa_add(dummy_request(self.session, json_body={
            'nama': 'Mahasiswa Tanpa NIM',
            'jurusan': 'Informatika',
        }))
        self.assertEqual(response.status_int, 400)

    def test_detail_not_found(self):
        from pyramid_mahasiswa.views.mahasiswa import mahasiswa_detail

        response = mahasiswa_detail(
            dummy_request(self.session, matchdict={'id': '999'}))
        self.assertEqual(response.status_int, 404)


class TestMatakuliahViews(BaseTest):
    def test_list_detail_create_update_delete(self):
        from pyramid_mahasiswa.views.matakuliah import (
            matakuliah_add,
            matakuliah_delete,
            matakuliah_detail,
            matakuliah_list,
            matakuliah_update,
        )
        from pyramid_mahasiswa.models import Matakuliah

        created = matakuliah_add(dummy_request(self.session, json_body={
            'kode_mk': 'IF2110',
            'nama_mk': 'Pemrograman Web',
            'sks': 3,
            'semester': 3,
        }))
        self.assertTrue(created['success'])
        self.assertEqual(created['matakuliah']['kode_mk'], 'IF2110')

        listed = matakuliah_list(dummy_request(self.session))
        self.assertEqual(len(listed['matakuliahs']), 1)

        detail = matakuliah_detail(
            dummy_request(self.session, matchdict={'id': '1'}))
        self.assertEqual(detail['matakuliah']['nama_mk'], 'Pemrograman Web')

        updated = matakuliah_update(dummy_request(
            self.session,
            matchdict={'id': '1'},
            json_body={'sks': 4, 'semester': 5},
        ))
        self.assertEqual(updated['matakuliah']['sks'], 4)
        self.assertEqual(updated['matakuliah']['semester'], 5)

        deleted = matakuliah_delete(
            dummy_request(self.session, matchdict={'id': '1'}))
        self.assertTrue(deleted['success'])
        self.assertIsNone(self.session.query(Matakuliah).first())

    def test_create_missing_required_fields(self):
        from pyramid_mahasiswa.views.matakuliah import matakuliah_add

        response = matakuliah_add(dummy_request(self.session, json_body={
            'kode_mk': 'IF2110',
            'nama_mk': 'Pemrograman Web',
        }))
        self.assertEqual(response.status_int, 400)

    def test_create_invalid_sks(self):
        from pyramid_mahasiswa.views.matakuliah import matakuliah_add

        for sks in (0, -3, 'tiga'):
            response = matakuliah_add(dummy_request(self.session, json_body={
                'kode_mk': 'IF2110',
                'nama_mk': 'Pemrograman Web',
                'sks': sks,
                'semester': 3,
            }))
            self.assertEqual(response.status_int, 400)

    def test_create_duplicate_kode_mk(self):
        from pyramid_mahasiswa.views.matakuliah import matakuliah_add

        payload = {
            'kode_mk': 'IF2110',
            'nama_mk': 'Pemrograman Web',
            'sks': 3,
            'semester': 3,
        }
        matakuliah_add(dummy_request(self.session, json_body=payload))
        response = matakuliah_add(
            dummy_request(self.session, json_body=payload))
        self.assertEqual(response.status_int, 400)

    def test_detail_not_found(self):
        from pyramid_mahasiswa.views.matakuliah import matakuliah_detail

        response = matakuliah_detail(
            dummy_request(self.session, matchdict={'id': '999'}))
        self.assertEqual(response.status_int, 404)
