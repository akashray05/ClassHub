"""add password reset

Revision ID: 442d9552e21c
Revises: ad63ff888289
Create Date: 2026-07-31 19:34:00.200770

"""

from typing import Sequence, Union

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "442d9552e21c"
down_revision: Union[str, Sequence[str], None] = "ad63ff888289"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    op.add_column(
        "users",
        sa.Column(
            "password_reset_token_hash",
            sa.String(length=255),
            nullable=True,
        ),
    )

    op.add_column(
        "users",
        sa.Column(
            "password_reset_token_expires_at",
            sa.DateTime(timezone=True),
            nullable=True,
        ),
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_column("users", "password_reset_token_expires_at")
    op.drop_column("users", "password_reset_token_hash")
