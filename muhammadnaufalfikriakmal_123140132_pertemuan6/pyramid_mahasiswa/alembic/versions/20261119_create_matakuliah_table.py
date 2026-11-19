"""create matakuliah table

Revision ID: dff85ba70421
Revises: c3f47474da94
Create Date: 2026-11-19 20:36:01.606558

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'dff85ba70421'
down_revision = 'c3f47474da94'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'matakuliah',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('kode_mk', sa.Text(), nullable=False),
        sa.Column('nama_mk', sa.Text(), nullable=False),
        sa.Column('sks', sa.Integer(), nullable=False),
        sa.Column('semester', sa.Integer(), nullable=False),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_matakuliah')),
        sa.UniqueConstraint('kode_mk', name=op.f('uq_matakuliah_kode_mk')),
    )


def downgrade():
    op.drop_table('matakuliah')
